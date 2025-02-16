package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierDAO extends JpaRepository<Supplier, Integer> {

    List<Supplier> getAllSupplier();

    Supplier getSupplierById(@Param("id") Integer id);
}
