import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { map, startWith } from "rxjs";
import { IncomeService } from "src/app/services/income/income.service";
import { KardexService } from "src/app/services/kardex/kardex.service";
import { ProductService } from "src/app/services/product/product.service";
import { SupplierService } from "src/app/services/supplier/supplier.service";

@Component({
  selector: "app-income-create",
  templateUrl: "../views/income-create.component.html",
  styleUrls: ["../templates/income/income-create.component.css"],
})
export class IncomeCreateComponent {
  incomeForm!: FormGroup;
  supplierList: any;
  suppliers: any;
  productList: any;
  products: any;
  productDetails: any;
  isDesktop!: boolean;
  displayedColumns: string[] = ["nameProduct", "quantity", "pricePurchase"];
  dataSource = new MatTableDataSource<any>([]);
  selectedStatus: string = "";
  incomeNumber: any;
  selectedProduct: any;

  statusOptions = [
    { id: "select", name: "Seleccionar" },
    { id: "pending", name: "Pendiente" },
    { id: "completed", name: "Completado" },
  ];

  typeOptions = [
    { id: "none", name: "Ninguno" },
    { id: "broke", name: "Defecto de Fabrica" },
    { id: "other", name: "Otro" },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public key: string,
    private dialogRef: MatDialogRef<IncomeCreateComponent>,
    private _productService: ProductService,
    private _supplierService: SupplierService,
    private _toastService: ToastrService,
    private _incomeService: IncomeService,
    private _kardexService: KardexService
  ) {
    this.incomeForm = this.fb.group({
      nameSupplier: ["", Validators.required],
      nameProduct: ["", Validators.required],
      quantity: ["", Validators.required],
      type: ["none", Validators.required],
      observations: ["", Validators.required],
      status: ["select", Validators.required],
    });
    this.incomeForm.get("nameSupplier")?.setValue(null);
    this.incomeForm.get("type")?.setValue("none");
  }

  ngOnInit(): void {
    this.checkDeviceType();
    this._supplierService.getAllSuppliers().subscribe(
      (response: any) => {
        this.supplierList = response.data.suppliers;
        this.suppliers = response.data.suppliers;
      },
      (error: HttpErrorResponse) => {
        this._toastService.error(error.error.error, error.error.message, {
          progressBar: true,
          timeOut: 2000,
          progressAnimation: "decreasing",
        });
      }
    );

    this._productService.getAllProducts().subscribe(
      (response: any) => {
        this.productList = response.data.products;
        this.products = response.data.products;
      },
      (error: HttpErrorResponse) => {
        this._toastService.error(error.error.error, error.error.message, {
          progressBar: true,
          timeOut: 2000,
          progressAnimation: "decreasing",
        });
      }
    );
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
  }

  async savePurchaseOrder() {
    if (this.incomeForm.get("nameSupplier")?.value) {
      this._productService
        .getProductById(this.incomeForm.get("nameProduct")?.value)
        .subscribe(
          (response: any) => {
            this.selectedProduct = response.data.product;

            const currentDate = new Date().toISOString().split("T")[0];
            const detailPurchaseOrders = {
              product_id: this.selectedProduct.id,
              stock: this.incomeForm.get("quantity")?.value,
              unit_price: this.selectedProduct.price_purchase,
            };

            const purchaseOrder = {
              supplier_id: this.incomeForm.get("nameSupplier")?.value,
              purchaseOrderDate: currentDate,
              status: this.selectedStatus,
              observation: this.incomeForm.get("observations")?.value,
              total: this.incomeForm.get("type")?.value !== "none" ? 0 : this.incomeForm.get("quantity")?.value *
                this.selectedProduct.price_purchase,
              detailPurchaseOrders: detailPurchaseOrders,
            };

            if (
              this.selectedStatus === "" ||
              this.selectedStatus === "select"
            ) {
              this._toastService.error(
                "Por favor, seleccione un estado",
                "Error",
                {
                  progressBar: true,
                  timeOut: 2000,
                  progressAnimation: "decreasing",
                }
              );
            } else {
              this._incomeService.addIncome(purchaseOrder).subscribe(
                (response: any) => {
                  if (this.selectedStatus === "completed") {
                    const purchaseOrderId = response.data.purchaseOrder.id;

                    const previousStock = this.selectedProduct.stock;
                    const stockChange = this.incomeForm.get("quantity")?.value;

                    this._productService
                      .updateStock(this.selectedProduct.id, stockChange)
                      .subscribe(
                        (response: any) => {
                          const updatedStock = response.data.product.stock;
                          const kardex = {
                            currentStock: updatedStock,
                            previousStock: previousStock,
                            observations:
                              this.incomeForm.get("observations")?.value,
                            product_id: this.selectedProduct.id,
                            purchase_order_id: purchaseOrderId,
                            sale_order_id: null,
                          };
                          this._kardexService.addKardex(kardex).subscribe(
                            (response: any) => {},
                            (error: HttpErrorResponse) => {
                              this._toastService.error(
                                error.error.error,
                                error.error.message,
                                {
                                  progressBar: true,
                                  timeOut: 2000,
                                  progressAnimation: "decreasing",
                                }
                              );
                            }
                          );
                        },
                        (error: HttpErrorResponse) => {
                          this._toastService.error(
                            error.error.error,
                            error.error.message,
                            {
                              progressBar: true,
                              timeOut: 2000,
                              progressAnimation: "decreasing",
                            }
                          );
                        }
                      );
                  }
                  this.dialogRef.close("created");
                },
                (error) => {
                  this._toastService.error(
                    "Error al crear la orden de venta",
                    "Error",
                    {
                      progressBar: true,
                      timeOut: 2000,
                      progressAnimation: "decreasing",
                    }
                  );
                }
              );
            }
          },
          (error: HttpErrorResponse) => {
            this._toastService.error(error.error.error, error.error.message, {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: "decreasing",
            });
          }
        );
    } else {
      this._toastService.error("Por favor, ingrese todos los campos", "Error", {
        progressBar: true,
        timeOut: 2000,
        progressAnimation: "decreasing",
      });
    }
  }

  cancel(): void {
    this.dialogRef.close("canceled");
  }

  closedModal() {
    this.dialogRef.close();
  }
}
