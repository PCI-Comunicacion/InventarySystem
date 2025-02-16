package api_inventaryPCI.Inventary.rest;


import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.service.CustomerService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/customer")
@RestController
@CrossOrigin(value = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addCustomer(@RequestBody Map<String, String> requestMap) {
        try {
            return customerService.addCustomer(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getCustomer")
    public ResponseEntity<ApiResponse> getAllCustomers() {
        try {
            return customerService.getAllCustomers();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateCustomer(@RequestBody Map<String, String> requestMap) {
        try {
            return customerService.updateCustomer(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Integer id) {
        try {
            return customerService.deleteCustomer(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getByDni/{dni}")
    public ResponseEntity<ApiResponse> getByDni(@PathVariable String dni) {
        try {
            return customerService.getByDni(dni);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ApiResponse> getCustomerById(@PathVariable Integer id) {
        try {
            return customerService.getCustomerById(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }
}
