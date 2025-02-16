package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.DetailPurchaseOrderDAO;
import api_inventaryPCI.Inventary.dao.ProductDAO;
import api_inventaryPCI.Inventary.dao.PurchaseOrderDAO;
import api_inventaryPCI.Inventary.dao.SupplierDAO;
import api_inventaryPCI.Inventary.pojo.*;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.service.PurchaseOrderService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import api_inventaryPCI.Inventary.wrapper.PurchaseOrderChartWrapper;
import api_inventaryPCI.Inventary.wrapper.PurchaseOrderWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    @Autowired
    private PurchaseOrderDAO purchaseOrderDAO;

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private SupplierDAO supplierDAO;

    @Autowired
    private DetailPurchaseOrderDAO detailPurchaseOrderDAO;

    @Override
    public ResponseEntity<ApiResponse> createPurchaseOrderWithDetails(Map<String, Object> requestMap) {
        try {
            if (jwtFilter.isUser()) {

                // Extract the nested map under the key "income"
                Map<String, Object> incomeMap = (Map<String, Object>) requestMap.get("income");

                if (validatePurchaseOrderMap(incomeMap, false)) {
                    PurchaseOrder purchaseOrder = getPurchaseOrderFromMap(incomeMap, false);
                    Optional<Supplier> supplierOptional = supplierDAO.findById(purchaseOrder.getSupplier().getId());

                    if (!supplierOptional.isPresent()) {
                        return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SUPPLIER_NOT_FOUND, null, FacturaConstantes.SUPPLIER_NOT_FOUND);
                    } else {
                        PurchaseOrder savedPurchaseOrder = purchaseOrderDAO.save(purchaseOrder);
                        List<DetailPurchaseOrder> detailPurchaseOrders = getDetailPurchaseOrdersFromMap(incomeMap, savedPurchaseOrder);
                        for (DetailPurchaseOrder detail : detailPurchaseOrders) {
                            Optional<Product> productOptional = productDAO.findById(detail.getProduct().getId());
                            if (!productOptional.isPresent()) {
                                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, FacturaConstantes.PRODUCT_NOT_FOUND);
                            } else {
                                detail.setPurchaseOrder(savedPurchaseOrder);
                                detailPurchaseOrderDAO.save(detail);
                            }
                        }

                        PurchaseOrder refreshedPurchaseOrder = purchaseOrderDAO.findById(savedPurchaseOrder.getId())
                                .orElse(savedPurchaseOrder);

                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PURCHASE_ORDER_ADDED, Map.of("purchaseOrder", refreshedPurchaseOrder), null);
                    }
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, FacturaConstantes.INVALID_DATA);
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, FacturaConstantes.UNAUTHORIZED_ACCESS);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getAllPurchaseOrders() {
        try{
            List<PurchaseOrderWrapper> purchaseOrderList = purchaseOrderDAO.getAllPurchaseOrders();
            if(Objects.nonNull(purchaseOrderList)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PURCHASE_ORDER_LIST, Map.of( "purchaseOrderList", purchaseOrderList), FacturaConstantes.PURCHASE_ORDER_LIST);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PURCHASE_ORDER_NOT_FOUND, null, FacturaConstantes.PURCHASE_ORDER_NOT_FOUND);
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> deletePurchaseOrder(Integer id) {
        try {
            if (jwtFilter.isUser()) {
                Optional<PurchaseOrder> optionalPurchaseOrder = purchaseOrderDAO.findById(id);
                if (optionalPurchaseOrder.isPresent()) {
                    PurchaseOrder purchaseOrder = optionalPurchaseOrder.get();
                    List<DetailPurchaseOrder> detailPurchaseOrders = purchaseOrder.getDetailPurchaseOrders();
                    detailPurchaseOrders.forEach(detailPurchaseOrderDAO::delete);
                    purchaseOrderDAO.delete(purchaseOrder);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PURCHASE_ORDER_DELETE, null, FacturaConstantes.PURCHASE_ORDER_DELETE);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PURCHASE_ORDER_NOT_FOUND, null, FacturaConstantes.PURCHASE_ORDER_NOT_FOUND);
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, FacturaConstantes.UNAUTHORIZED_ACCESS);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getDetailPurchaseOrderById(Integer id) {
        try {
            List<DetailPurchaseOrder> detailPurchaseOrderList = detailPurchaseOrderDAO.findByPurchaseOrderId(id);
            if(Objects.nonNull(detailPurchaseOrderList)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PURCHASE_ORDER_LIST, Map.of( "detailPurchaseOrderList", detailPurchaseOrderList), FacturaConstantes.PURCHASE_ORDER_LIST);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PURCHASE_ORDER_NOT_FOUND, null, FacturaConstantes.PURCHASE_ORDER_NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getPurchaseOrderById(Integer id) {
        try{
            PurchaseOrderWrapper purchaseOrderWrapper = purchaseOrderDAO.getPurchaseOrderById(id);
            if(Objects.nonNull(purchaseOrderWrapper)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.PURCHASE_ORDER_LIST, Map.of( "purchaseOrder", purchaseOrderWrapper), FacturaConstantes.PURCHASE_ORDER_LIST);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PURCHASE_ORDER_NOT_FOUND, null, FacturaConstantes.PURCHASE_ORDER_NOT_FOUND);
            }
        }catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getPurchaseOrderChartData() {
        try {
            List<PurchaseOrder> purchaseOrders = purchaseOrderDAO.findAll();
            List<PurchaseOrderChartWrapper> chartData = new ArrayList<>();

            for (PurchaseOrder order : purchaseOrders) {
                chartData.add(new PurchaseOrderChartWrapper(order.getPurchaseOrderDate(), order.getTotal()));
            }

            return ResponseBuilder.build("success", HttpStatus.OK.value(), "Data retrieved successfully", Map.of("chartData", chartData), null);
        } catch (Exception e) {
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong", null, e.getMessage());
        }
    }

    private List<DetailPurchaseOrder> getDetailPurchaseOrdersFromMap(Map<String, Object> requestMap, PurchaseOrder purchaseOrder) {
        List<DetailPurchaseOrder> detailPurchaseOrders = new ArrayList<>();

        Map<String, Object> detailData = (Map<String, Object>) requestMap.get("detailPurchaseOrders");

        DetailPurchaseOrder detailPurchaseOrder = new DetailPurchaseOrder();
        detailPurchaseOrder.setStock(Integer.parseInt(detailData.get("stock").toString()));
        detailPurchaseOrder.setUnitPrice(((Number) detailData.get("unit_price")).doubleValue());

        Integer productId = (Integer) detailData.get("product_id");
        Product product = productDAO.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        detailPurchaseOrder.setProduct(product);
        detailPurchaseOrder.setPurchaseOrder(purchaseOrder);
        detailPurchaseOrders.add(detailPurchaseOrder);

        return detailPurchaseOrders;
    }

    private PurchaseOrder getPurchaseOrderFromMap(Map<String, Object> requestMap, boolean validateId){
        PurchaseOrder purchaseOrder = new PurchaseOrder();
        if(validateId){
            purchaseOrder.setId(Integer.parseInt(requestMap.get("id").toString()));
        }

        Supplier supplier = new Supplier();
        supplier.setId(Integer.parseInt(requestMap.get("supplier_id").toString()));

        purchaseOrder.setSupplier(supplier);
        purchaseOrder.setPurchaseOrderDate(LocalDate.parse((String) requestMap.get("purchaseOrderDate")));
        purchaseOrder.setTotal(Double.parseDouble(requestMap.get("total").toString()));
        purchaseOrder.setObservation(requestMap.get("observation").toString());
        purchaseOrder.setStatus(requestMap.get("status").toString());
        return purchaseOrder;
    }

    private boolean validatePurchaseOrderMap(Map<String, Object> requestMap, boolean validateId){
        boolean hasRequiredFields = requestMap.containsKey("supplier_id");
        boolean hasIdIfNeeded = !validateId || requestMap.containsKey("id");
        return hasRequiredFields && hasIdIfNeeded;
    }
}