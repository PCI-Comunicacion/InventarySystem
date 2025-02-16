package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.pojo.Customer;
import api_inventaryPCI.Inventary.util.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface CustomerService {

    ResponseEntity<ApiResponse> addCustomer(Map<String,String> requestMap);

    ResponseEntity<ApiResponse> getAllCustomers();

    ResponseEntity<ApiResponse> updateCustomer(Map<String, String> requestMap);

    ResponseEntity<ApiResponse> deleteCustomer(Integer id);

    ResponseEntity<ApiResponse> getCustomerById(Integer id);

    ResponseEntity<ApiResponse> getByDni(String dni);
}
