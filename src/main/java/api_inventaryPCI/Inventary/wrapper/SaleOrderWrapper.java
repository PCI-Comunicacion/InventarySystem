package api_inventaryPCI.Inventary.wrapper;

import api_inventaryPCI.Inventary.pojo.DetailSaleOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleOrderWrapper {
    private Integer id;
    private Integer customerId;
    private String customerName;
    private LocalDate saleOrderDate;
    private String status;
    private Double total;
    private String observation;

    public SaleOrderWrapper(Integer id, Integer customerId, String customerName, LocalDate saleOrderDate, String status, Double total, String observation) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.saleOrderDate = saleOrderDate;
        this.status = status;
        this.total = total;
        this.observation = observation;
    }
    private List<DetailSaleOrder> detailSaleOrders;
}
