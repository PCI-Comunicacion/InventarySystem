package api_inventaryPCI.Inventary.wrapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductWrapper {

    private Integer id;
    private String name;
    private String description;
    private Double price_purchase;
    private Double price_sale;
    private Integer stock;
    private Date entryDate;
    private Integer category_id;
    private String nameCategory;
}
