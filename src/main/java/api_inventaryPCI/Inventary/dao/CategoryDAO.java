package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryDAO extends JpaRepository<Category, Integer> {

    List<Category> getAllCategory();
}
