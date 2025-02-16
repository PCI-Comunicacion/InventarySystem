package api_inventaryPCI.Inventary.wrapper;

import api_inventaryPCI.Inventary.pojo.DetailPurchaseOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderWrapper {
    private Integer id;
    private Integer supplierId;
    private String supplierName;
    private LocalDate purchaseOrderDate;
    private String status;
    private Double total;
    private String observation;

    public PurchaseOrderWrapper(Integer id, Integer supplierId, String supplierName, LocalDate purchaseOrderDate, String status, Double total, String observation) {
        this.id = id;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.purchaseOrderDate = purchaseOrderDate;
        this.status = status;
        this.total = total;
        this.observation = observation;
    }

    private List<DetailPurchaseOrder> detailPurchaseOrders;

}
