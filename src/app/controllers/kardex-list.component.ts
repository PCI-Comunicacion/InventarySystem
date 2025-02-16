import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { IncomeService } from 'src/app/services/income/income.service';
import { KardexService } from 'src/app/services/kardex/kardex.service';
import { jsPDF } from 'jspdf'; // Importar jsPDF
import 'jspdf-autotable'; // Importar autotable para tablas
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Kardex } from '../models/kardex.mode';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-kardex-list',
  templateUrl: '../views/kardex-list.component.html',
  styleUrls: ['../templates/kardex/kardex-list.component.css'],
})
export class KardexListComponent implements OnInit, AfterViewInit {
  @ViewChild('dialogRangeDates') dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  searchTerm: string = '';
  dataKardex = new MatTableDataSource<Kardex>();
  listKardex: Kardex[] = [];
  displayedColumns: string[] = [
    'product',
    'transactionDate',
    'transactionType',
    'previousStock',
    'currentStock',
    'price',
    'observations',
  ];
  selectedKardexDetails: any[] = [];
  dataSource: any;

  endDate: string = '';
  startDate: string = '';
  noResults: boolean = false;
  
  countTotalDiscontinued: number = 0;
  countTotalIncome: number = 0;
  countTotalExpenses: number = 0;
  isDesktop!: boolean;

  constructor(
    private dialog: MatDialog,
    private _kardexService: KardexService,
    private _incomeService: IncomeService,
    private _expenseService: ExpensesService,
    private _toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this._kardexService.getAllKardex().subscribe(
      (response: any) => {
        this.dataKardex = new MatTableDataSource<Kardex>(response.data.kardexList);
        this.dataKardex.sort = this.sort;
        this.dataKardex.paginator = this.paginator;
        this.dataSource = this.getKardexMovements(response.data.kardexList);
        this.listKardex = response.data.kardexList;
      },
      (error: HttpErrorResponse) => {
        this._toastService.error(error.error.error, error.error.message, {
          progressBar: true,
          timeOut: 2000,
          progressAnimation: "decreasing",
        });
      }
    );
    this.checkDeviceType();
  }

  ngAfterViewInit() {
    this.dataKardex.paginator = this.paginator;
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  getKardexMovements(kardexData: any[]): any[] {
    return kardexData.map((item) => {
      if (item.sale_order_id === null && item.purchase_order_id !== null) {
        item.transactionType = 'Compra';
        this._incomeService.getIncomeById(item.purchase_order_id).subscribe(
          (response: any) => {
            item.transactionDate = response.data.purchaseOrder.purchaseOrderDate;
            this._incomeService.getDetailIncomeById(item.purchase_order_id).subscribe(
              (response: any) => {
                item.price = response.data.detailPurchaseOrderList[0].product.price_purchase;
              },
              (error: HttpErrorResponse) => {
                this._toastService.error(error.error.error, error.error.message, {
                  progressBar: true,
                  timeOut: 2000,
                  progressAnimation: "decreasing",
                });
              }
            );
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
      else if (item.purchase_order_id === null && item.sale_order_id !== null) {
        item.transactionType = 'Venta';
        this._expenseService.getExpenseById(item.sale_order_id).subscribe(
          (response: any) => {
            item.transactionDate = response.data.saleOrder.saleOrderDate;
            this._expenseService.getDetailExpenseById(item.sale_order_id).subscribe(
              (response: any) => {
                item.price = response.data.detailSaleOrderList[0].product.price_sale;
              },
              (error: HttpErrorResponse) => {
                this._toastService.error(error.error.error, error.error.message, {
                  progressBar: true,
                  timeOut: 2000,
                  progressAnimation: "decreasing",
                });
              }
          );
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
      return item;
    });
  }

  openDialogRangeDates(): void {
    this.dialog.open(this.dialogTemplate, {
      disableClose: true,
      width: 'auto',
      height: 'auto',
    });
  }

  generatePDF(): void {
    const datePipe = new DatePipe('es-ES');

    const transformedStartDate: string | null = datePipe.transform(this.startDate, 'dd/MM/yyyy');
    const transformedEndDate: string | null = datePipe.transform(this.endDate, 'dd/MM/yyyy');

    const filteredData = this.dataSource.filter((item: any) => {
      const itemDate = new Date(item.transactionDate);
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      return itemDate >= startDate && itemDate <= endDate;
    });
  
    const sortedData = filteredData.sort((a: any, b: any) => {
      const dateA = new Date(a.transactionDate).getTime();
      const dateB = new Date(b.transactionDate).getTime();
      return dateB - dateA;
    });

    const dataForPDF = sortedData.map((item: any) => ({
      ...item,
      transactionDate: new Date(item.transactionDate).toLocaleDateString()
    }));

    const doc = new jsPDF();
  
    const pageWidth = doc.internal.pageSize.getWidth();

    const title = 'PCI COMUNICACIÓN';
    const titleFontSize = 26;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(titleFontSize);
    const titleTextWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleTextWidth) / 2;

    doc.text(title, titleX, 20);

    const title2 = 'PRONTA COMUNICACION';
    const titleFontSize2 = 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(titleFontSize2);
    const titleTextWidth2 = doc.getTextWidth(title2);
    const titleX2 = (pageWidth - titleTextWidth2) / 2;

    doc.text(title2, titleX2, 25);

    const subtitle = 'Registro de Movimientos';
    const subtitleFontSize = 13;
    doc.setFontSize(subtitleFontSize);

    doc.setFont('helvetica', 'bold');

    const subtitleX = 15;
    const subtitleY = 37;

    doc.text(subtitle, subtitleX, subtitleY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Desde:', 15, 44);
    
    doc.setFont('helvetica', 'normal');
    doc.text(transformedStartDate ?? 'Fecha no disponible', 30, 44);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Hasta:', 60, 44);
    
    doc.setFont('helvetica', 'normal');
    doc.text(transformedEndDate ?? 'Fecha no disponible', 75, 44);

    const head = [[ 'Fecha', 'Producto', 'Cantidad Anterior', 'Cantidad Actual', 'Movimiento', 'Descripción']];
  
    const data = dataForPDF.map((item: any) => [
      item.transactionDate,
      item.nameProduct,
      item.previousStock,
      item.currentStock,
      item.transactionType,
      item.observations
    ]);
  
    (doc as any).autoTable({
      head: head,
      body: data,
      startY: 50,
      headStyles: {
        fillColor: '#000000',
        textColor: '#FFFFFF',
        fontSize: 12,
        fontStyle: 'bold'
      }
    });

    const formattedStartDate = new Date(this.startDate).toLocaleDateString();
    const formattedEndDate = new Date(this.endDate).toLocaleDateString();
  
    doc.save(`Reporte_Kardex_${formattedStartDate}_a_${formattedEndDate}.pdf`);

    this.endDate = '';
    this.startDate = '';
    this.closedModal();
  }

  closedModal() {
    this.endDate = '';
    this.startDate = '';
    this.dialog.closeAll();
  }
}