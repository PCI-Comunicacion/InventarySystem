package api_inventaryPCI.Inventary.wrapper;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SaleOrderProfitWrapper {
    private LocalDate date;
    private Double profit;
}
