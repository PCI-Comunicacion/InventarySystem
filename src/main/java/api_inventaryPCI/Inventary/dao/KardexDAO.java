package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.Kardex;
import api_inventaryPCI.Inventary.wrapper.KardexWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KardexDAO extends JpaRepository<Kardex, Integer> {

    List<KardexWrapper> getAllKardex();
}
