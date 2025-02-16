package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.CustomerDAO;
import api_inventaryPCI.Inventary.dao.DetailSaleOrderDAO;
import api_inventaryPCI.Inventary.dao.ProductDAO;
import api_inventaryPCI.Inventary.dao.SaleOrderDAO;
import api_inventaryPCI.Inventary.pojo.Customer;
import api_inventaryPCI.Inventary.pojo.DetailSaleOrder;
import api_inventaryPCI.Inventary.pojo.Product;
import api_inventaryPCI.Inventary.pojo.SaleOrder;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.service.SaleOrderService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import api_inventaryPCI.Inventary.wrapper.CategorySalesWrapper;
import api_inventaryPCI.Inventary.wrapper.SaleOrderChartWrapper;
import api_inventaryPCI.Inventary.wrapper.SaleOrderProfitWrapper;
import api_inventaryPCI.Inventary.wrapper.SaleOrderWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SaleOrderServiceImpl implements SaleOrderService {

    @Autowired
    private SaleOrderDAO saleOrderDAO;

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomerDAO customerDAO;

    @Autowired
    private DetailSaleOrderDAO detailSaleOrderDAO;

    @Override
    public ResponseEntity<ApiResponse> createSaleOrderWithDetails(Map<String, Object> requestMap) {
        try {
            if (jwtFilter.isUser()) {

                // Extract the nested map under the key "expenses"
                Map<String, Object> expensesMap = (Map<String, Object>) requestMap.get("expenses");
                if (validateSaleOrderMap(expensesMap, false)) {
                    SaleOrder saleOrder = getSaleOrderFromMap(expensesMap, false);
                    Optional<Customer> customerOptional = customerDAO.findById(saleOrder.getCustomer().getId());
                    if (!customerOptional.isPresent()) {
                        return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.CUSTOMER_NOT_FOUND, null, null);
                    } else {
                        SaleOrder savedSaleOrder = saleOrderDAO.save(saleOrder);
                        List<DetailSaleOrder> detailSaleOrders = getDetailSaleOrdersFromMap(expensesMap, savedSaleOrder);
                        for (DetailSaleOrder detail : detailSaleOrders) {
                            Optional<Product> productOptional = productDAO.findById(detail.getProduct().getId());
                            if (!productOptional.isPresent()) {
                                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.PRODUCT_NOT_FOUND, null, null);
                            } else {
                                detail.setSaleOrder(savedSaleOrder);
                                detailSaleOrderDAO.save(detail);
                            }
                        }

                        SaleOrder refreshedSaleOrder = saleOrderDAO.findById(savedSaleOrder.getId())
                                .orElse(savedSaleOrder);

                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SALE_ORDER_ADDED, Map.of("saleOrder", refreshedSaleOrder), null);
                    }
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getAllSaleOrders() {
        try{
            List<SaleOrderWrapper> saleOrderList = saleOrderDAO.getAllSaleOrders();
            if(Objects.nonNull(saleOrderList)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SALE_ORDER_LIST, Map.of("saleOrderList" , saleOrderList), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SALE_ORDER_NOT_FOUND, null, null);
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> deleteSaleOrder(Integer id) {
        try {
            if (jwtFilter.isUser()) {
                Optional<SaleOrder> optionalSaleOrder = saleOrderDAO.findById(id);
                if (optionalSaleOrder.isPresent()) {
                    SaleOrder saleOrder = optionalSaleOrder.get();
                    List<DetailSaleOrder> detailSaleOrders = saleOrder.getDetailSaleOrders();
                    detailSaleOrders.forEach(detailSaleOrderDAO::delete);

                    saleOrderDAO.delete(saleOrder);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SALE_ORDER_DELETED, null, null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SALE_ORDER_NOT_FOUND, null, null);
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getDetailSaleOrderById(Integer id) {
        try {
            List<DetailSaleOrder> detailSaleOrders = detailSaleOrderDAO.findBySaleOrderId(id);
            if(Objects.nonNull(detailSaleOrders)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.DETAIL_SALE_ORDER_LIST, Map.of("detailSaleOrderList" , detailSaleOrders), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.DETAIL_SALE_ORDER_NOT_FOUND, null, null);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getSaleOrderById(Integer id) {
        try {
            SaleOrderWrapper saleOrderWrapper = saleOrderDAO.getSaleOrderById(id);
            if(Objects.nonNull(saleOrderWrapper)){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.SALE_ORDER, Map.of("saleOrder" , saleOrderWrapper), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.SALE_ORDER_NOT_FOUND, null, null);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getSaleOrderChartData() {
        try {
            List<SaleOrder> saleOrders = saleOrderDAO.findAll();
            List<SaleOrderChartWrapper> chartData = new ArrayList<>();

            for (SaleOrder order : saleOrders) {
                chartData.add(new SaleOrderChartWrapper(order.getSaleOrderDate(), order.getTotal()));
            }

            return ResponseBuilder.build("success", HttpStatus.OK.value(), "Data retrieved successfully", Map.of("chartData", chartData), null);
        } catch (Exception e) {
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong", null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getSaleOrderProfitData() {
        try {
            List<SaleOrder> saleOrders = saleOrderDAO.findAll();
            List<SaleOrderProfitWrapper> profitData = new ArrayList<>();

            for (SaleOrder order : saleOrders) {
                List<DetailSaleOrder> detailSaleOrders = detailSaleOrderDAO.findBySaleOrderId(order.getId());
                double totalVenta = order.getTotal();
                double ganancia = 0;

                for (DetailSaleOrder detail : detailSaleOrders) {
                    int stock = detail.getStock();
                    double precioCompra = detail.getProduct().getPrice_purchase();
                    double precioVenta = detail.getUnitPrice();

                    ganancia += precioVenta * stock - stock * precioCompra;
                }

                profitData.add(new SaleOrderProfitWrapper(order.getSaleOrderDate(), ganancia));
            }

            return ResponseBuilder.build("success", HttpStatus.OK.value(), "Data retrieved successfully", Map.of("chartData", profitData), null);
        } catch (Exception e) {
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong", null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getTop5Categories() {
        try {
            List<CategorySalesWrapper> topCategories = detailSaleOrderDAO.findTop5Categories()
                    .stream()
                    .map(record -> new CategorySalesWrapper((String) record[0], (Long) record[1]))
                    .sorted((c1, c2) -> Long.compare(c2.getTotalSales(), c1.getTotalSales()))
                    .limit(5)
                    .collect(Collectors.toList());

            return ResponseBuilder.build("success", HttpStatus.OK.value(), "Data retrieved successfully", Map.of("donutData", topCategories), null);
        } catch (Exception e) {
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong", null, e.getMessage());
        }
    }

    private List<DetailSaleOrder> getDetailSaleOrdersFromMap(Map<String, Object> requestMap, SaleOrder saleOrder) {
        List<DetailSaleOrder> detailSaleOrders = new ArrayList<>();

        Map<String, Object> detailData = (Map<String, Object>) requestMap.get("detailSaleOrders");

        DetailSaleOrder detailSaleOrder = new DetailSaleOrder();
        detailSaleOrder.setStock(Integer.parseInt(detailData.get("stock").toString()));
        detailSaleOrder.setUnitPrice(((Number) detailData.get("unit_price")).doubleValue());
        detailSaleOrder.setPaymentMethod((String) detailData.get("paymentMethod"));

        Integer productId = (Integer) detailData.get("product_id");
        Product product = productDAO.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        detailSaleOrder.setProduct(product);
        detailSaleOrder.setSaleOrder(saleOrder);
        detailSaleOrders.add(detailSaleOrder);

        return detailSaleOrders;
    }

    private SaleOrder getSaleOrderFromMap(Map<String, Object> requestMap, boolean validateId){
        SaleOrder saleOrder = new SaleOrder();
        if(validateId){
            saleOrder.setId(Integer.parseInt(requestMap.get("id").toString()));
        }
        Customer customer = new Customer();
        customer.setId(Integer.parseInt(requestMap.get("customer_id").toString()));

        saleOrder.setCustomer(customer);
        saleOrder.setSaleOrderDate(LocalDate.parse((String) requestMap.get("saleOrderDate")));
        saleOrder.setTotal(Double.parseDouble(requestMap.get("total").toString()));
        saleOrder.setObservation(requestMap.get("observation").toString());
        saleOrder.setStatus(requestMap.get("status").toString());
        return saleOrder;
    }

    private boolean validateSaleOrderMap(Map<String, Object> requestMap, boolean validateId){
        boolean hasRequiredFields = requestMap.containsKey("customer_id");
        boolean hasIdIfNeeded = !validateId || requestMap.containsKey("id");
        return hasRequiredFields && hasIdIfNeeded;
    }
}
