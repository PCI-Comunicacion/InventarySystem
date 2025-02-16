import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { IncomeService } from 'src/app/services/income/income.service';
import { MatSort } from '@angular/material/sort';
import { PurchaseOrder } from '../models/purchaseOrder.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-income-list',
  templateUrl: './../views/income-list.component.html',
  styleUrls: ['./../templates/income/income-list.component.css']
})
export class IncomeListComponent {
  @ViewChild('dialogTemplateDetails') dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['id', 'supplier', 'purchaseOrderDate', 'observation', 'total', 'acciones'];
  displayedColumns2: string[] = ['product', 'quantity', 'unitPrice' ];

  listPurchaseOrder: PurchaseOrder[] = [];
  dataPurchaseOrder = new MatTableDataSource<PurchaseOrder>();
  dataSource: PurchaseOrder[] = [];
  searchTerm: string = '';
  selectedCustomerId: number | null = null;
  isDesktop!: boolean;
  selectedOrderSaleDetails: any;
  noResults: boolean = false;

  constructor(
    private dialog:MatDialog,
    private _incomeService: IncomeService,
    private _toastService: ToastrService
  ){}

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    await this.loadData();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  async loadData(){
    this._incomeService.getAllIncome().subscribe(
      (response: any) => {
        this.dataPurchaseOrder = new MatTableDataSource<PurchaseOrder>(response.data.purchaseOrderList);
        this.listPurchaseOrder = response.data.purchaseOrderList;
        this.dataPurchaseOrder.sort = this.sort;
        this.dataPurchaseOrder.paginator = this.paginator;
        this.dataSource = response.data.purchaseOrderList;

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

  async openDetailOrderialog(element: any){
    this._incomeService.getDetailIncomeById(element.id).subscribe(
      (response: any) => {
        this.selectedOrderSaleDetails = response.data.detailPurchaseOrderList;
        this.dialog.open(this.dialogTemplate, {
          disableClose: true,
          width: "auto",
          height: "auto",
        })
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

  closeDetailsOrderDialog(){
    this.dialog.closeAll();
  }
}
