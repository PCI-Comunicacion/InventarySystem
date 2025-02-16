package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.ProductDAO;
import api_inventaryPCI.Inventary.pojo.Category;
import api_inventaryPCI.Inventary.pojo.Product;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.service.ProductService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.FacturaUtils;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import api_inventaryPCI.Inventary.wrapper.ProductWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    public ResponseEntity<ApiResponse> addProduct(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isUser()){
                if(validateProductMap(requestMap, false)){
                    Product savedProduct = productDAO.save(getProductFromMap(requestMap, false));
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PRODUCT_ADDED, Map.of( "product", savedProduct), null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            } else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getAllProducts() {
        try{
            List<ProductWrapper> productsWrapper = productDAO.getAllProducts();
            if(Objects.nonNull(productsWrapper)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PRODUCT_LIST, Map.of( "products", productsWrapper), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, null);
            }
        }catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> updateProduct(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isUser()){
                if(validateProductMap(requestMap, true)){
                    Optional<Product> productOptional = productDAO.findById(Integer.parseInt(requestMap.get("id")));
                    if(!productOptional.isEmpty()){
                        Product savedProduct = productDAO.save(getProductFromMap(requestMap, true));
                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PRODUCT_UPDATED, Map.of( "product", savedProduct), null);
                    }else{
                        return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, null);
                    }
                }else{
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> deleteProduct(Integer id) {
        try{
            if(jwtFilter.isUser()){
                Optional productOptional = productDAO.findById(id);
                if(!productOptional.isEmpty()){
                    productDAO.deleteById(id);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PRODUCT_DELETED, null, null);
                }else{
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getProductById(Integer id) {
        try{
            ProductWrapper productWrapper = productDAO.getProductById(id);
            if(Objects.nonNull(productWrapper)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PRODUCT_FOUND, Map.of( "product", productWrapper), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, null);
            }
        }catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> updateStockProduct(Integer productId, Integer stockChange) {
        try{
            if(jwtFilter.isUser()){
                Optional productOptional = productDAO.findById(productId);
                if(!productOptional.isEmpty()){
                    Product product = (Product) productOptional.get();
                    product.setStock(product.getStock() + stockChange);
                    Product savedProduct = productDAO.save(product);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PRODUCT_STOCK_UPDATED, Map.of( "product", savedProduct), null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    private Product getProductFromMap(Map<String, String> requestMap, boolean isAdd){
        Category category = new Category();
        category.setId(Integer.parseInt(requestMap.get("category_id")));

        Product product = new Product();
        if(isAdd){
            product.setId(Integer.parseInt(requestMap.get("id")));
        }

        product.setCategory(category);
        product.setName(requestMap.get("name"));
        product.setDescription(requestMap.get("description"));
        product.setStock(Integer.parseInt(requestMap.get("stock")));
        product.setPrice_purchase(Double.parseDouble(requestMap.get("price_purchase")));
        product.setPrice_sale(Double.parseDouble(requestMap.get("price_sale")));
        product.setEntryDate(FacturaUtils.getDateFromString(requestMap.get("entryDate")));
        return product;
    }

    private boolean validateProductMap(Map<String, String> requestMap, boolean validateId){
        if(requestMap.containsKey("name")){
            if(requestMap.containsKey("id") && validateId){
                return true;
            }
            if(!validateId){
                return true;
            }
        }
        return false;
    }
}
