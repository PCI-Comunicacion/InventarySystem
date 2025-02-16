package api_inventaryPCI.Inventary.util;

import lombok.Data;

@Data
public class ApiResponse {
    private String status;
    private String message;
    private int statusCode;
    private Object data;
    private String error;

    public ApiResponse(String status, int statusCode, String message, Object data, String error) {
        this.status = status;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.error = error;
    }
}
