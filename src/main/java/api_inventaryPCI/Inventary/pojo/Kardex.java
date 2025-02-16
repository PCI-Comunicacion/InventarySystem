package api_inventaryPCI.Inventary.pojo;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@NamedQuery(
        name = "Kardex.getAllKardex",
        query = "SELECT new api_inventaryPCI.Inventary.wrapper.KardexWrapper" +
                "(k.id, k.currentStock, k.previousStock, k.observations, k.product.id, k.product.name, k.purchaseOrder.id, k.saleOrder.id) FROM Kardex k"
)

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "kardex")
public class Kardex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer currentStock;

    private Integer previousStock;

    private String observations;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", nullable = true)
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "sale_order_id", nullable = true)
    private SaleOrder saleOrder;
}
