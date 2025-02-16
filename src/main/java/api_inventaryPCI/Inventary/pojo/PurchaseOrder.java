package api_inventaryPCI.Inventary.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import java.time.LocalDate;
import java.util.List;

@NamedQuery(
        name = "PurchaseOrder.getAllPurchaseOrders",
        query = "SELECT new api_inventaryPCI.Inventary.wrapper.PurchaseOrderWrapper" +
                "(s.id, s.supplier.id, s.supplier.comercial_name, s.purchaseOrderDate, s.status, s.total, s.observation) " +
                "FROM PurchaseOrder s"
)

@NamedQuery(
        name = "PurchaseOrder.getPurchaseOrderById",
        query = "SELECT new api_inventaryPCI.Inventary.wrapper.PurchaseOrderWrapper" +
                "(s.id, s.supplier.id, s.supplier.comercial_name, s.purchaseOrderDate, s.status, s.total, s.observation) " +
                "FROM PurchaseOrder s WHERE s.id = :id"
)

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "PurchaseOrder")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "supplier"})
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private LocalDate purchaseOrderDate;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String observation;

    @Column
    private Double total;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "purchaseOrder"})
    private List<DetailPurchaseOrder> detailPurchaseOrders;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Supplier supplier;
}
