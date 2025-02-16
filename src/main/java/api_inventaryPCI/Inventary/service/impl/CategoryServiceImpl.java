package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.CategoryDAO;
import api_inventaryPCI.Inventary.pojo.Category;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.service.CategoryService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryDAO categoryDAO;

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    public ResponseEntity<ApiResponse> addCategory(Map<String, Object> requestMap) {
        try{
            if(jwtFilter.isUser()){
                if(validateCategoryMap(requestMap, false)) {
                    Category savedCategory = categoryDAO.save(getCategoryFromMap(requestMap, false));
                    return ResponseBuilder.build("sucess", HttpStatus.OK.value(), FacturaConstantes.CATEGORY_ADDED, Map.of("category", savedCategory), null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.error("error: ", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getAllCategory() {
        try{
            if(jwtFilter.isUser()){
                List<Category> categories = categoryDAO.getAllCategory();
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CATEGORY_LIST, Map.of("categories", categories), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> updateCategory(Map<String, Object> requestMap) {
        try{
            if(jwtFilter.isUser()){
                if(validateCategoryMap(requestMap, true)) {
                    Optional optional = categoryDAO.findById((Integer) requestMap.get("id"));
                    if (!optional.isEmpty()) {
                        Category updatedCategory = categoryDAO.save(getCategoryFromMap(requestMap, true));
                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CATEGORY_UPDATED, Map.of("category", updatedCategory), null);
                    } else {
                        return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.CATEGORY_NOT_FOUND, null, null);
                    }
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, "error !!!1");
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    private boolean validateCategoryMap(Map<String, Object> requestMap, boolean validateId) {
        log.info("requestMap: {}", requestMap);
        boolean hasRequiredFields = requestMap.containsKey("name");
        boolean hasIdIfNeeded = !validateId || requestMap.containsKey("id");
        return hasRequiredFields && hasIdIfNeeded;
    }

    private Category getCategoryFromMap(Map<String, Object> requestMap, Boolean isAdd){

        Category category = new Category();
        if(isAdd){ category.setId((Integer) requestMap.get("id")); }
        category.setName((String) requestMap.get("name"));
        return category;
    }
}
