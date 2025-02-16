import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { KardexService } from 'src/app/services/kardex/kardex.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: "app-expenses-create-dialog",
  templateUrl: "../views/expenses-create-dialog.component.html",
  styleUrls: ["../templates/expenses/expenses-create-dialog.component.css"],
})
export class ExpensesCreateDialogComponent {
  expensesForm!: FormGroup;
  customerList: any;
  customers: any;
  productList: any;
  products: any;
  isDesktop!: boolean;
  displayedColumns: string[] = ["nameProduct", "quantity", "priceSale"];
  dataSource = new MatTableDataSource<any>([]);
  selectedStatus: string = "";
  selectedMethodPayment: string = "";
  selectedProduct: any;

  statusOptions = [
    { id: "select", name: "Seleccionar" },
    { id: "pending", name: "Pendiente" },
    { id: "completed", name: "Completado" },
  ];

  paymentMethods = [
    { id: "select", name: "Seleccionar" },
    { id: "cash", name: "Efectivo" },
    { id: "creditCard", name: "Tarjeta de crédito" },
    { id: "debitCard", name: "Tarjeta de débito" },
    { id: "transfer", name: "Transferencia" },
    { id: "checks", name: "Cheques" },
  ];

  typeOptions = [
    { id: "none", name: "Ninguno" },
    { id: "sort", name: "Sorteo" },
    { id: "donation", name: "Donación" },
    { id: "promotion", name: "Promoción" },
    { id: "other", name: "Otro" },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public key: string,
    private dialogRef: MatDialogRef<ExpensesCreateDialogComponent>,
    private _productService: ProductService,
    private _customerService: CustomerService,
    private _toastService: ToastrService,
    private _expensesService: ExpensesService,
    private _kardexService: KardexService
  ) {
    this.expensesForm = this.fb.group({
      nameCustomer: ["", Validators.required],
      nameProduct: ["", Validators.required],
      quantity: ["", Validators.required],
      type: ["none", Validators.required],
      observations: ["", Validators.required],
      status: ["select", Validators.required],
      paymentMethod: ["select", Validators.required],
    });
    this.expensesForm.get("nameCustomer")?.setValue(null);
  }

  ngOnInit(): void {
    this.checkDeviceType();

    this._customerService.getAllCustomers().subscribe(
      (response: any) => {
        this.customerList = response.data.customers;
        this.customers = response.data.customers;
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

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
  }

  onPaymentMethodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedMethodPayment = target.value;
  }

  async saveSaleOrder() {
    if (this.expensesForm.get("nameCustomer")?.value) {
      this._productService.getProductById(this.expensesForm.get("nameProduct")?.value).subscribe(
          (response: any) => {
            this.selectedProduct = response.data.product;

            if(this.selectedProduct.stock < this.expensesForm.get("quantity")?.value){
              this._toastService.error(
                "La cantidad ingresada supera el stock disponible",
                "Error",
                {
                  progressBar: true,
                  timeOut: 2000,
                  progressAnimation: "decreasing",
                }
              );
            } else {
              const currentDate = new Date().toISOString().split("T")[0];
              const detailSaleOrders = {
                product_id: this.selectedProduct.id,
                stock: this.expensesForm.get("quantity")?.value,
                unit_price: this.selectedProduct.price_sale,
                paymentMethod: this.selectedMethodPayment,
              };
  
              const saleOrder = {
                customer_id: this.expensesForm.get("nameCustomer")?.value,
                saleOrderDate: currentDate,
                status: this.selectedStatus,
                observation: this.expensesForm.get("observations")?.value,
                total: this.expensesForm.get("type")?.value !== "none" ? 0 :
                  this.expensesForm.get("quantity")?.value *
                  this.selectedProduct.price_sale,
                detailSaleOrders: detailSaleOrders,
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
  
                this._expensesService.addExpenses(saleOrder).subscribe(
                  (response : any) => {
                    
                    if (this.selectedStatus === "completed") {
  
                      const saleOrderId = response.data.saleOrder.id;
  
                        const previousStock = this.selectedProduct.stock;
                        const stockChange = -this.expensesForm.get("quantity")?.value;
  
                        this._productService.updateStock(this.selectedProduct.id, stockChange).subscribe(
                            (response: any) => {
                              const updatedStock = response.data.product.stock;
                              const kardex = {
                                currentStock: updatedStock,
                                previousStock: previousStock,
                                observations: this.expensesForm.get("observations")?.value,
                                product_id: this.selectedProduct.id,
                                purchase_order_id: null,
                                sale_order_id: saleOrderId,
                              };
                              this._kardexService.addKardex(kardex).subscribe(
                                (response: any) =>{
                                },
                                (error: HttpErrorResponse) =>{
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
