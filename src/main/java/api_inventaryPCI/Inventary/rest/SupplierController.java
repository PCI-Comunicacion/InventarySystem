package api_inventaryPCI.Inventary.rest;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.service.SupplierService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/supplier")
@RestController
@CrossOrigin(value = "*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addNewSupplier(@RequestBody Map<String, String> requestMap) {
        try {
            return supplierService.addSupplier(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getSupplier")
    public ResponseEntity<ApiResponse> getAllSuppliers() {
        try {
            return supplierService.getAllSuppliers();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateSupplier(@RequestBody Map<String, String> requestMap) {
        try {
            return supplierService.updateSupplier(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteSupplier(@PathVariable Integer id) {
        try {
            return supplierService.deleteSupplier(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ApiResponse> getSupplierByID(@PathVariable Integer id) {
        try {
            return supplierService.getSupplierById(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }
}
