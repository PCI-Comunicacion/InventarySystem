package api_inventaryPCI.Inventary.pojo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@NamedQuery(name = "User.findByEmail", query = "select u from User u where u.email=:email")

@NamedQuery(name = "User.getAllUsers", query = "select new api_inventaryPCI.Inventary.wrapper.UserWrapper(u.id, u.name, u.email, u.status , u.position, u.role) from User u where u.role='user'")

@NamedQuery(name = "User.updateStatus", query = "update User u set u.status=:status where u.id=:id")

@NamedQuery(name = "User.getAllAdmins", query = "select u.email from User u where u.role='admin'")

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column( name = "email")
    private String email;

    @Column( name = "password")
    private String password;

    @Column( name = "status")
    private String status;

    @Column( name = "role")
    private String role;

    @Column( name = "position")
    private String position;

}
