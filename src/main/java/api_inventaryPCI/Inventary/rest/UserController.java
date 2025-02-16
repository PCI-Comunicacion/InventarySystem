package api_inventaryPCI.Inventary.rest;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.service.TokenRevocationService;
import api_inventaryPCI.Inventary.service.UserService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping(path = "/user" )
@CrossOrigin(value = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/testAPI")
    public ResponseEntity<ApiResponse> test(){
        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.TEST_API_OK, null, null);
    }

    @Autowired
    private TokenRevocationService tokenRevocationService;

    @PostMapping(value = "/signup", produces = "application/json")
    public ResponseEntity<ApiResponse> signUp(@RequestBody(required = true) Map<String, String> requestMap) {
        try {
            return userService.signUp(requestMap);
        } catch (Exception e) {;
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody(required = true) Map<String, String> requestMap) {
        try {
            return userService.login(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            tokenRevocationService.revokeToken(token);
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getUsers")
    public ResponseEntity<ApiResponse> getUsers() {
        try {
            return userService.getAllUsers();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/updateUser")
    public ResponseEntity<ApiResponse> updateUser(@RequestBody(required = true) Map<String, String> requestMap) {
        try {
            return userService.updateUser(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PutMapping("/updateUserStatus")
    public ResponseEntity<ApiResponse> updateStatusUser(@RequestBody(required = true) Map<String, String> requestMap) {
        try {
            return userService.updateStatus(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Integer id) {
        try {
            return userService.deleteUser(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/checkToken")
    public ResponseEntity<ApiResponse> validarToken(){
        try{
            return userService.checkToken();
        }catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<ApiResponse> updatePassword(@RequestBody(required = true) Map<String, String> requestMap) {
        try{
            return userService.changePassword(requestMap);
        }catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<ApiResponse> recoveryPassword(@RequestBody Map<String, String> requestMap) {
        try {
            return userService.forgotPassword(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getUserByEmail")
    public ResponseEntity<ApiResponse> getUserByEmail(@RequestParam String email) {
        try {
            return userService.getUserByEmail(email);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }
}
