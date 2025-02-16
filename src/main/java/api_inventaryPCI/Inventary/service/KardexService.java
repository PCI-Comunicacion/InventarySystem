package api_inventaryPCI.Inventary.service;

import api_inventaryPCI.Inventary.util.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface KardexService {

    ResponseEntity<ApiResponse> addKardex(Map<String, String> requestMap);

    ResponseEntity<ApiResponse> getAllKardex();

}
