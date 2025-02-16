package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.pojo.DetailPurchaseOrder;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.wrapper.PurchaseOrderWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface PurchaseOrderService {

    ResponseEntity<ApiResponse> createPurchaseOrderWithDetails(Map<String, Object> requestMap);

    ResponseEntity<ApiResponse> getAllPurchaseOrders();

    ResponseEntity<ApiResponse> deletePurchaseOrder(Integer id);

    ResponseEntity<ApiResponse> getDetailPurchaseOrderById(Integer id);

    ResponseEntity<ApiResponse> getPurchaseOrderChartData();

    ResponseEntity<ApiResponse> getPurchaseOrderById(Integer id);
}
