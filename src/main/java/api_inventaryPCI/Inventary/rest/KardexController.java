package api_inventaryPCI.Inventary.rest;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.service.KardexService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/kardex")
@CrossOrigin(value = "*")
public class KardexController {

    @Autowired
    private KardexService kardexService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addNewKardex(@RequestBody(required = true) Map<String, String> requestMap) {
        try {
            return kardexService.addKardex(requestMap);
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllKardex() {
        try {
            return kardexService.getAllKardex();
        } catch (Exception e) {
            return ResponseBuilder.build( "error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }
}
