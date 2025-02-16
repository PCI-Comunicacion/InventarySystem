package api_inventaryPCI.Inventary.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@NamedQuery(
        name = "DetailPurchaseOrder.findByPurchaseOrderId",
        query = "SELECT d FROM DetailPurchaseOrder d WHERE d.purchaseOrder.id = :id"
)

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "DetailPurchaseOrder")
public class DetailPurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "unit_price")
    private Double unitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchaseOrder_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "customer"})
    private PurchaseOrder purchaseOrder;
}
