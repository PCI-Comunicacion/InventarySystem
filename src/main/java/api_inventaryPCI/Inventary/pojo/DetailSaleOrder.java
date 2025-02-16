package api_inventaryPCI.Inventary.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@NamedQuery(
        name = "DetailSaleOrder.findBySaleOrderId",
        query = "SELECT d FROM DetailSaleOrder d WHERE d.saleOrder.id = :id"
)

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "DetailSaleOrder")
public class DetailSaleOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "paymentMethod")
    private String paymentMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saleOrder_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "customer"})
    private SaleOrder saleOrder;

}

