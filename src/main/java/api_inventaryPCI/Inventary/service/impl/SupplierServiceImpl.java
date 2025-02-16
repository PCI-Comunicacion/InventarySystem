package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.SupplierDAO;
import api_inventaryPCI.Inventary.pojo.Supplier;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.service.SupplierService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierDAO supplierDAO;

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    public ResponseEntity<ApiResponse> addSupplier(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isUser()){
                if(validateSupplierMap(requestMap, false)){
                    Supplier supplier = supplierDAO.save(getSupplierFromMap(requestMap, false));
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SUPPLIER_ADDED, Map.of( "supplier", supplier), null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getAllSuppliers() {
        try{
            List<Supplier> suppliersList = supplierDAO.getAllSupplier();
            if(Objects.nonNull(suppliersList)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SUPPLIER_LIST, Map.of( "suppliers", suppliersList), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SUPPLIER_NOT_FOUND, null, null);
            }
        }catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> updateSupplier(Map<String, String> requestMap) {
        try{
             if(jwtFilter.isUser()) {
                 Optional<Supplier> supplierOptional = supplierDAO.findById(Integer.parseInt(requestMap.get("id")));
                 if (validateSupplierMap(requestMap, true)) {
                     if(!supplierOptional.isEmpty()){
                         Supplier supplier = supplierDAO.save(getSupplierFromMap(requestMap, true));
                         return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SUPPLIER_UPDATED, Map.of("supplier", supplier), null);
                     }else{
                         return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SUPPLIER_NOT_FOUND, null, null);
                     }

                 } else {
                        return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                 }
             } else {
                    return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
             }
        } catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> deleteSupplier(Integer id) {
        try{
            if(jwtFilter.isUser()){
                Optional supplierOptional = supplierDAO.findById(id);
                if(!supplierOptional.isEmpty()){
                    supplierDAO.deleteById(id);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SUPPLIER_DELETE, null, null);
                }else{
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SUPPLIER_NOT_FOUND, null, null);
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
    public ResponseEntity<ApiResponse> getSupplierById(Integer id) {
        log.info("Buscando proveedor por id: {}", id);

        try {
            Supplier supplier = supplierDAO.getSupplierById(id);
            if (Objects.nonNull(supplier)) {
                return new ResponseEntity<>(new ApiResponse("success", HttpStatus.OK.value(), FacturaConstantes.SUPPLIER_LIST, Map.of("supplier", supplier), null), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResponse("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SUPPLIER_NOT_FOUND, null, null), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    private boolean validateSupplierMap(Map<String, String> requestMap, boolean validateId){
        if(requestMap.containsKey("comercial_name")){
            if(requestMap.containsKey("id") && validateId){
                return true;
            }
            if(!validateId){
                return true;
            }
        }
        return false;
    }


    private Supplier getSupplierFromMap(Map<String, String> requestMap, boolean validateId){
        Supplier supplier = new Supplier();
        if(validateId){
            supplier.setId(Integer.parseInt(requestMap.get("id")));
        }
        supplier.setComercial_name(requestMap.get("comercial_name"));
        supplier.setEmail(requestMap.get("email"));
        supplier.setIsForeign(requestMap.get("isForeign"));
        supplier.setAddress(requestMap.get("address"));
        return supplier;
    }
}
