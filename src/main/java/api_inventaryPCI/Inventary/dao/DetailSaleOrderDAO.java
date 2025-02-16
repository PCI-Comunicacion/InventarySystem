package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.DetailSaleOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface DetailSaleOrderDAO extends JpaRepository<DetailSaleOrder, Integer> {

    @Query("SELECT p.category.name, SUM(d.stock) as totalSales " +
            "FROM DetailSaleOrder d JOIN d.product p " +
            "GROUP BY p.category.name " +
            "ORDER BY totalSales DESC")
    List<Object[]> findTop5Categories();

    List<DetailSaleOrder> findBySaleOrderId(@Param("id") Integer id);
}
