package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.util.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface CategoryService {

    ResponseEntity<ApiResponse> addCategory(Map<String, Object> requestMap);

    ResponseEntity<ApiResponse> getAllCategory();

    ResponseEntity<ApiResponse> updateCategory(Map<String, Object> requestMap);
}
