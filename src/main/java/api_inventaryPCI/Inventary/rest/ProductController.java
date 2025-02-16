package api_inventaryPCI.Inventary.rest;


import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.service.ProductService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/product")
@RestController
@CrossOrigin(value = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody(required = true) Map<String, String> requestMap) {
        try {
            return productService.addProduct(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getProducts")
    public ResponseEntity<ApiResponse> getAllProducts() {
        try {
            return productService.getAllProducts();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateProduct(@RequestBody Map<String, String> requestMap) {
        try {
            return productService.updateProduct(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Integer id) {
        try {
            return productService.deleteProduct(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ApiResponse> getProductByID(@PathVariable Integer id) {
        try {
            return productService.getProductById(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @PatchMapping("/update-stock/{id}")
    public ResponseEntity<ApiResponse> updateProductStock(@PathVariable Integer id, @RequestParam Integer stockChange) {
        try {
            return productService.updateStockProduct(id, stockChange);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }
}
