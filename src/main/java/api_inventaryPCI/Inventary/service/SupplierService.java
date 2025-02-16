package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.pojo.Supplier;
import api_inventaryPCI.Inventary.util.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface SupplierService {

    ResponseEntity<ApiResponse> addSupplier(Map<String, String> requestMap);

    ResponseEntity<ApiResponse> getAllSuppliers();

    ResponseEntity<ApiResponse> updateSupplier(Map<String, String> requestMap);

    ResponseEntity<ApiResponse> deleteSupplier(Integer id);

    ResponseEntity<ApiResponse> getSupplierById(Integer id);
}
