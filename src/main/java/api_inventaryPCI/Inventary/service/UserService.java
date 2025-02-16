package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.util.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface UserService {

    ResponseEntity<ApiResponse> signUp(Map<String,String> requestMap);

    ResponseEntity<ApiResponse> login(Map<String,String> requestMap);

    ResponseEntity<ApiResponse> getAllUsers();

    ResponseEntity<ApiResponse> updateStatus(Map<String,String> requestMap);

    ResponseEntity<ApiResponse> updateUser(Map<String,String> requestMap);

    ResponseEntity<ApiResponse> deleteUser(Integer id);

    ResponseEntity<ApiResponse> checkToken();

    ResponseEntity<ApiResponse> getUserByEmail(String email);

    ResponseEntity<ApiResponse> changePassword(Map<String,String> requestMap);

    ResponseEntity<ApiResponse> forgotPassword(Map<String,String> requestMap);
}
