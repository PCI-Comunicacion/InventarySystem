package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.pojo.DetailSaleOrder;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.wrapper.SaleOrderWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface SaleOrderService {

    ResponseEntity<ApiResponse> createSaleOrderWithDetails(Map<String, Object> requestMap);

    ResponseEntity<ApiResponse> getAllSaleOrders();

    ResponseEntity<ApiResponse> deleteSaleOrder(Integer id);

    ResponseEntity<ApiResponse> getDetailSaleOrderById(Integer id);

    ResponseEntity<ApiResponse> getSaleOrderChartData();

    ResponseEntity<ApiResponse> getSaleOrderProfitData();

    ResponseEntity<ApiResponse> getSaleOrderById(Integer id);

    ResponseEntity<ApiResponse> getTop5Categories();
}

