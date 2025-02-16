package api_inventaryPCI.Inventary.rest;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.service.PurchaseOrderService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/purchaseOrders")
@CrossOrigin(value = "*")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createPurchaseOrder(@RequestBody(required = true)  Map<String, Object> requestMap) {
        try {
            return purchaseOrderService.createPurchaseOrderWithDetails(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse> getAllPurchaseOrders() {
        try {
            return purchaseOrderService.getAllPurchaseOrders();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deletePurchaseOrder(@PathVariable Integer id) {
        try {
            return purchaseOrderService.deletePurchaseOrder(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getDetail/{id}")
    public ResponseEntity<ApiResponse> getDetailPurchaseOrder(@PathVariable Integer id) {
        try {
            return purchaseOrderService.getDetailPurchaseOrderById(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ApiResponse> getPurchaseOrderById(@PathVariable Integer id) {
        try {
            return purchaseOrderService.getPurchaseOrderById(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/chartData")
    public ResponseEntity<ApiResponse> getPurchaseOrderChartData() {
        try {
            return purchaseOrderService.getPurchaseOrderChartData();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }
}
