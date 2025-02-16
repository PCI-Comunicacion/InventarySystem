package api_inventaryPCI.Inventary.wrapper;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategorySalesWrapper {
    private String categoryName;
    private Long totalSales;
}
