package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.wrapper.ProductWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ProductService {

    ResponseEntity<ApiResponse> addProduct(Map<String, String> requestMap);

    ResponseEntity<ApiResponse> getAllProducts();

    ResponseEntity<ApiResponse> updateProduct(Map<String, String> requestMap);

    ResponseEntity<ApiResponse> deleteProduct(Integer id);

    ResponseEntity<ApiResponse> getProductById(Integer id);

    ResponseEntity<ApiResponse> updateStockProduct(Integer id, Integer stockChange);
}
