package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.DetailPurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetailPurchaseOrderDAO extends JpaRepository<DetailPurchaseOrder, Integer> {

    List<DetailPurchaseOrder> findByPurchaseOrderId(@Param("id") Integer id);
}
