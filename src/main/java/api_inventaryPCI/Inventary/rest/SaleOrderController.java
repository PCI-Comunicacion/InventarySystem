package api_inventaryPCI.Inventary.rest;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.service.SaleOrderService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/saleOrders")
@CrossOrigin(value = "*")
public class SaleOrderController {

    @Autowired
    private SaleOrderService saleOrderService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createSaleOrder(@RequestBody(required = true) Map<String, Object> requestMap) {
        try {
            return saleOrderService.createSaleOrderWithDetails(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse> getAllSaleOrders() {
        try {
            return saleOrderService.getAllSaleOrders();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteSaleOrder(@PathVariable Integer id) {
        try {
            return saleOrderService.deleteSaleOrder(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getDetail/{id}")
    public ResponseEntity<ApiResponse> getDetailSaleOrder(@PathVariable Integer id) {
        try {
            return saleOrderService.getDetailSaleOrderById(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ApiResponse> getSaleOrder(@PathVariable Integer id) {
        try {
            return saleOrderService.getSaleOrderById(id);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/chartData")
    public ResponseEntity<ApiResponse> getSaleOrderChartData() {
        return saleOrderService.getSaleOrderChartData();
    }

    @GetMapping("/profitData")
    public ResponseEntity<ApiResponse> getSaleOrderProfitData() {
        return saleOrderService.getSaleOrderProfitData();
    }

    @GetMapping("/top5Categories")
    public ResponseEntity<ApiResponse> getTop5Categories() {
        return saleOrderService.getTop5Categories();
    }
}
