package api_inventaryPCI.Inventary.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;
import java.util.List;

@NamedQuery(
        name = "SaleOrder.getAllSaleOrders",
        query = "SELECT new api_inventaryPCI.Inventary.wrapper.SaleOrderWrapper" +
                "(s.id, s.customer.id, s.customer.name, s.saleOrderDate, s.status, s.total, s.observation) " +
                "FROM SaleOrder s"
)

@NamedQuery(
        name = "SaleOrder.getSaleOrderById",
        query = "SELECT new api_inventaryPCI.Inventary.wrapper.SaleOrderWrapper" +
                "(s.id, s.customer.id, s.customer.name, s.saleOrderDate, s.status, s.total, s.observation) " +
                "FROM SaleOrder s WHERE s.id = :id"
)

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "SaleOrder")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "customer"})
public class SaleOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private LocalDate saleOrderDate;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String observation;

    @Column
    private Double total;

    @OneToMany(mappedBy = "saleOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "saleOrder"})
    private List<DetailSaleOrder> detailSaleOrders;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Customer customer;
}
