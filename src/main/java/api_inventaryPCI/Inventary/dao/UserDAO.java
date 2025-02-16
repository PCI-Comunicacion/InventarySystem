package api_inventaryPCI.Inventary.dao;

import api_inventaryPCI.Inventary.pojo.User;
import api_inventaryPCI.Inventary.wrapper.UserWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserDAO extends JpaRepository<User, Integer> {

    User findByEmail(@Param(("email")) String email);

    @Query("SELECT new api_inventaryPCI.Inventary.wrapper.UserWrapper(u.id, u.name, u.email, u.status, u.position, u.role) FROM User u WHERE u.email = :email")
    UserWrapper findUserWrapperByEmail(@Param("email") String email);

    List<UserWrapper> getAllUsers();

    List<String> getAllAdmins();

    @Transactional
    @Modifying
    Integer updateStatus(@Param("status") String status, @Param("id") Integer id);
}
