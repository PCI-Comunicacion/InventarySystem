package api_inventaryPCI.Inventary.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@NamedQuery(name = "Supplier.getAllSupplier", query = "select s from Supplier s")

@NamedQuery(name = "Supplier.getSupplierById", query = "select s from Supplier s where s.id=:id")

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "supplier")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "comercial_name")
    private String comercial_name;

    @Column(name = "isForeign")
    private String isForeign;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;
}
