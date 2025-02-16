package api_inventaryPCI.Inventary.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.Date;

@NamedQuery(
        name = "Product.getAllProducts",
        query = "SELECT new api_inventaryPCI.Inventary.wrapper.ProductWrapper" +
                "(p.id, p.name, p.description, p.price_purchase, p.price_sale, p.stock, p.entryDate,  p.category.id, p.category.name) " +
                "FROM Product p"
)

@NamedQuery(
        name = "Product.getProductById",
        query = "SELECT new api_inventaryPCI.Inventary.wrapper.ProductWrapper" +
                "(p.id, p.name, p.description, p.price_purchase, p.price_sale, p.stock, p.entryDate, p.category.id, p.category.name) " +
                "FROM Product p WHERE p.id = :id"
)

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "product")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "category"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "price_purchase")
    private Double price_purchase;

    @Column(name = "price_sale")
    private Double price_sale;

    @Column(name = "entryDate")
    private Date entryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "category"})
    private Category category;
}
