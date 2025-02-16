package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.SaleOrder;
import api_inventaryPCI.Inventary.wrapper.SaleOrderWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleOrderDAO extends JpaRepository<SaleOrder, Integer> {

    List<SaleOrderWrapper> getAllSaleOrders();

    SaleOrderWrapper getSaleOrderById(@Param("id") Integer id);
}
