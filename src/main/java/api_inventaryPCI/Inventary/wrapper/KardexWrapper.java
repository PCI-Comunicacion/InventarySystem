package api_inventaryPCI.Inventary.wrapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KardexWrapper {

    private Integer id;
    private Integer currentStock;
    private Integer previousStock;
    private String observations;
    private Integer product_id;
    private String nameProduct;
    private Integer purchase_order_id;
    private Integer sale_order_id;
}
