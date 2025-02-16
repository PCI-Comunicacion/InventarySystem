package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.Product;
import api_inventaryPCI.Inventary.wrapper.ProductWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDAO extends JpaRepository<Product, Integer> {

    List<ProductWrapper> getAllProducts();

    ProductWrapper getProductById(@Param("id") Integer id);
}
