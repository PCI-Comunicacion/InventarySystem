package api_inventaryPCI.Inventary.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ResponseBuilder {

    public static ResponseEntity<ApiResponse> build(String status, int statusCode, String message, Object data, String error) {
        ApiResponse response = new ApiResponse(status, statusCode, message, data, error);
        return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
    }
}
