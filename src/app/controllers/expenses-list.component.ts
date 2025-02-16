import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { MatSort } from '@angular/material/sort';
import { SaleOrder } from '../models/saleOrder.model';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-expenses-list',
  templateUrl: '../views/expenses-list.component.html',
  styleUrls: ['../templates/expenses/expenses-list.component.css']
})

export class ExpensesListComponent {
  @ViewChild('dialogTemplateDetails') dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSort) sort2!: MatSort;
  
  displayedColumns: string[] = ['id', 'saleOrderDate','customer', 'observation', 'total', 'acciones'];
  displayedColumns2: string[] = ['product', 'paymentMethod', 'quantity', 'unitPrice'];

  listSaleOrder: SaleOrder[] = [];
  dataSaleOrder = new MatTableDataSource<SaleOrder>();
  dataSource: SaleOrder[] = [];
  searchTerm: string = '';
  selectedCustomerId: number | null = null;
  selectedOrderSaleDetails: any;
  isDesktop!: boolean;
  noResults: boolean = false;

  constructor(
    private dialog:MatDialog,
    private _expenseService: ExpensesService,
    private _toastService: ToastrService
  ){}

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    this.loadDataExpenses();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  } 

  async loadDataExpenses(){
    this._expenseService.getAllExpenses().subscribe(
      (response: any) =>{
        this.dataSaleOrder = new MatTableDataSource<SaleOrder>(response.data.saleOrderList);
        this.dataSaleOrder.paginator = this.paginator;
        this.listSaleOrder = response.data.saleOrderList;
        this.dataSaleOrder.sort = this.sort;
        this.dataSource = response.data.saleOrderList;
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
    this._expenseService.getDetailExpenseById(element.id).subscribe(
      (response: any) => {
        this.selectedOrderSaleDetails = response.data.detailSaleOrderList;
        this.dialog.open(this.dialogTemplate, {
          disableClose: true,
          width: "630px",
          height: "auto",
        });
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
