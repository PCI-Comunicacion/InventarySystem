package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerDAO extends JpaRepository<Customer, Integer> {

    Customer findByDni(@Param(("dni")) String dni);

    List<Customer> getAllCustomers();
}
