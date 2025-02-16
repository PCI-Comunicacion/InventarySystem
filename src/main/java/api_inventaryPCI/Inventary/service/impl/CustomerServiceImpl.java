package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.CustomerDAO;
import api_inventaryPCI.Inventary.pojo.Customer;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.service.CustomerService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerDAO customerDAO;

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    public ResponseEntity<ApiResponse> addCustomer(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isUser()){
                if(validateCustomerMap(requestMap, false)){
                    Customer customer = customerDAO.findByDni(requestMap.get("identification"));
                    if(Objects.isNull(customer)){
                        Customer savedCustomer = customerDAO.save(getCustomerFromMap(requestMap, false));
                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CUSTOMER_ADDED, Map.of("customer", savedCustomer), null);
                    }
                    else{
                        return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.CUSTOMER_ALREADY_EXISTS, null, null);
                    }
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, null);
            }
        }catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getAllCustomers() {
        try{
            List<Customer> customers = customerDAO.getAllCustomers();
            return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CUSTOMER_LIST, Map.of("customers", customers), null);
        }catch (Exception e){
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> updateCustomer(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isUser()) {
                Optional<Customer> customerOptional = customerDAO.findById(Integer.parseInt(requestMap.get("id")));
                if (validateCustomerMap(requestMap, true)) {
                    if(!customerOptional.isEmpty()){
                        Customer updatedCustomer = customerDAO.save(getCustomerFromMap(requestMap, true));
                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CUSTOMER_UPDATED, Map.of("customer", updatedCustomer), null);
                    }else{
                        return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.CUSTOMER_NOT_FOUND, null, null);
                    }
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, null);
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        } catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> deleteCustomer(Integer id) {
        try{
            if(jwtFilter.isUser()){
                Optional customerOptional = customerDAO.findById(id);
                if(!customerOptional.isEmpty()){
                    customerDAO.deleteById(id);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CUSTOMER_DELETED, null, null);
                }else{
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.CUSTOMER_NOT_FOUND, null, null);
                }
            }else{
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, null);
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getByDni(String dni) {
        try {
            Customer customer = customerDAO.findByDni(dni);
            if (Objects.nonNull(customer)) {
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CUSTOMER_FOUND, Map.of("customer", customer), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.CUSTOMER_NOT_FOUND, null, null);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getCustomerById(Integer id) {
        try{
            Optional<Customer> customerOptional = customerDAO.findById(id);
            if(!customerOptional.isEmpty()){
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.CUSTOMER_FOUND, Map.of("customer", customerOptional.get()), null);
            }else{
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.CUSTOMER_NOT_FOUND, null, null);
            }
        }catch (Exception e){
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    private Customer getCustomerFromMap(Map<String, String> requestMap, boolean validateId){
        Customer customer = new Customer();
        if(validateId){
            customer.setId(Integer.parseInt(requestMap.get("id")));
        }
        customer.setName(requestMap.get("name"));
        customer.setSurname(requestMap.get("surname"));
        customer.setIdentification(requestMap.get("identification"));
        customer.setAddress(requestMap.get("address"));
        customer.setEmail(requestMap.get("email"));
        customer.setPhone_number(requestMap.get("phone_number"));
        return customer;
    }

    private boolean validateCustomerMap(Map<String, String> requestMap, boolean validateId){
        if(requestMap.containsKey("name") && requestMap.containsKey("identification")){
            if(requestMap.containsKey("id") && validateId){
                return true;
            }
            if(!validateId){
                return true;
            }
        }
        return false;
    }
}
