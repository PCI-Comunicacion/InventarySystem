package api_inventaryPCI.Inventary.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@NamedQuery(name = "Customer.findByDni", query = "select c from Customer c where c.identification=:dni")

@NamedQuery(name = "Customer.getAllCustomers", query = "select c from Customer c")

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "customer")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column( name = "identification")
    private String identification;

    @Column(name = "phone_number")
    private String phone_number;

    @Column( name = "email")
    private String email;

    @Column( name = "address")
    private String address;

}
