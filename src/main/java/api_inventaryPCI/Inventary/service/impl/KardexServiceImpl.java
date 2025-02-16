package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.KardexDAO;
import api_inventaryPCI.Inventary.pojo.*;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.service.KardexService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import api_inventaryPCI.Inventary.wrapper.KardexWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class KardexServiceImpl implements KardexService {

    @Autowired
    private KardexDAO kardexDAO;

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    public ResponseEntity<ApiResponse> addKardex(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isUser()){
                if(validateKardexMap(requestMap, false)){
                    Kardex savedKardex = kardexDAO.save(getKardexFromMap(requestMap, false));
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.KARDEX_ADDED, Map.of( "kardex", savedKardex), null);
                } else {
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
    public ResponseEntity<ApiResponse> getAllKardex() {
        try{
            List<KardexWrapper> kardexList = kardexDAO.getAllKardex();
            if(Objects.nonNull(kardexList)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.KARDEX_LIST, Map.of("kardexList" , kardexList), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, null);
            }
        }catch (Exception e) {
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    private boolean validateKardexMap(Map<String, String> requestMap, boolean validateId) {
        boolean hasRequiredFields = requestMap.containsKey("currentStock") && requestMap.containsKey("previousStock") && requestMap.containsKey("observations");
        boolean hasIdIfNeeded = !validateId || requestMap.containsKey("kardexId");
        return hasRequiredFields && hasIdIfNeeded;
    }

    private Kardex getKardexFromMap(Map<String, String> requestMap, boolean isAdd) {
        Kardex kardex = new Kardex();

        if (isAdd && requestMap.containsKey("kardexId")) {
            try {
                kardex.setId(Integer.parseInt(requestMap.get("kardexId")));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid Kardex ID format", e);
            }
        }
        Product producto = new Product();
        try {
            producto.setId(Integer.parseInt(requestMap.get("product_id")));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid Product ID format", e);
        }
        kardex.setProduct(producto);

        try {
            kardex.setCurrentStock(Integer.parseInt(requestMap.get("currentStock")));
            kardex.setPreviousStock(Integer.parseInt(requestMap.get("previousStock")));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid stock format", e);
        }
        kardex.setObservations(requestMap.get("observations"));

        String purchaseOrderId = requestMap.get("purchase_order_id");
        if (purchaseOrderId != null && !purchaseOrderId.isEmpty()) {
            try {
                PurchaseOrder purchaseOrder = new PurchaseOrder();
                purchaseOrder.setId(Integer.parseInt(purchaseOrderId));
                kardex.setPurchaseOrder(purchaseOrder);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid Purchase Order ID format", e);
            }
        } else {
            kardex.setPurchaseOrder(null);
        }

        String saleOrderId = requestMap.get("sale_order_id");
        if (saleOrderId != null && !saleOrderId.isEmpty()) {
            try {
                SaleOrder saleOrder = new SaleOrder();
                saleOrder.setId(Integer.parseInt(saleOrderId));
                kardex.setSaleOrder(saleOrder);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid Sale Order ID format", e);
            }
        } else {
            kardex.setSaleOrder(null);
        }

        return kardex;
    }
}
