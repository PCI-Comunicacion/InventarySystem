package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.PurchaseOrder;
import api_inventaryPCI.Inventary.wrapper.PurchaseOrderWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderDAO  extends JpaRepository<PurchaseOrder, Integer> {

    List<PurchaseOrderWrapper> getAllPurchaseOrders();

    PurchaseOrderWrapper getPurchaseOrderById(@Param("id") Integer id);
}
