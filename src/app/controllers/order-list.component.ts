import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IncomeCreateComponent } from './income-create.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpensesCreateDialogComponent } from './expenses-create-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ExpensesService } from '../services/expenses/expenses.service';
import { IncomeService } from '../services/income/income.service';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-order-list',
  templateUrl: '../views/order-list.component.html',
  styleUrls: ['../templates/order/order-list.component.css']
})
export class OrderListComponent implements OnInit {
  @ViewChild('dialogRangeDates') dialogTemplate!: TemplateRef<any>;
  selectedOrderType: string = 'purchaseOrders';
  isDesktop!: boolean;
  isSelectedPurchaseOrder: boolean = true;
  endDate: string = '';
  startDate: string = '';
  dataSourcePurchaseOrders: any;
  dataSourceSaleOrders: any;

  constructor(
    private dialog: MatDialog,
    private _toastService: ToastrService,
    private _incomeService: IncomeService,
    private _expensesService: ExpensesService
  ){}

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  onOrderTypeChange(event: any) {
    if(event.target.value === 'purchaseOrders') {
      this.isSelectedPurchaseOrder = true;
    } else {
      this.isSelectedPurchaseOrder = false;
    }
  }

  newOrder(){
    switch(this.selectedOrderType){
      case 'purchaseOrders':
        this.openCreatePurchaseOrderDialog();
        break;
      case 'saleOrders':
        this.openCreateExpenseDialog();
        break;
    }
  }
  
  openCreatePurchaseOrderDialog(){
    this.dialog.open(IncomeCreateComponent,{
      width: "600px",
      height: "auto",
      data: '',
    }).afterClosed().subscribe( async result => {
      if(result === 'created'){
        this._toastService.success('Orden de salida creada con éxito', 'Éxito', {
          progressBar: true,
          timeOut: 3000,
          progressAnimation: 'decreasing'
        });
      }
    }); 
  }

  openCreateExpenseDialog(){
    this.dialog.open(ExpensesCreateDialogComponent,{
      width: "400px",
      height: "auto",
      data: '',
    }).afterClosed().subscribe( async result => {
      if(result === 'created'){
        this._toastService.success('Orden de ingreso creada con éxito', 'Éxito', {
          progressBar: true,
          timeOut: 3000,
          progressAnimation: 'decreasing'
        });
      }
    }); 
  }

  closedModal() {
    this.endDate = '';
    this.startDate = '';
    this.dialog.closeAll();
  }

  openDialogRangeDates(): void {
    this.dialog.open(this.dialogTemplate, {
      disableClose: true,
      width: 'auto',
      height: 'auto',
    });
  }

  generatePDF(): void {
    if(this.endDate === '' || this.startDate === ''){
      this._toastService.error('Debe seleccionar un rango de fechas', 'Error', {
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'decreasing'
      });
    } else {
      if(this.selectedOrderType === 'purchaseOrders'){
        this._incomeService.getAllIncome().subscribe(
          (response: any) => {
            this.dataSourcePurchaseOrders = response.data.purchaseOrderList;
            this.processPdfPurchase(this.dataSourcePurchaseOrders);
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
        this._expensesService.getAllExpenses().subscribe(
          (response: any) => {
            this.dataSourceSaleOrders = response.data.saleOrderList;
            this.processPdfSales(this.dataSourceSaleOrders);
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
    }
  }

  async getDetailsForPDFPurchase(sortedData: any[]): Promise<any[]> {
    const promises = sortedData.map(async (item: any) => {
      const response = await this._incomeService.getDetailIncomeById(item.id).toPromise();
      return {
        ...item,
        stock: response.data.detailPurchaseOrderList[0].stock,
        purchaseOrderDate: new Date(item.purchaseOrderDate).toLocaleDateString()
      };
    });
  
    return Promise.all(promises);
  }

  async processPdfPurchase(dataOrders: any){
    const datePipe = new DatePipe('es-ES');

    const transformedStartDate: string | null = datePipe.transform(this.startDate, 'dd/MM/yyyy');
    const transformedEndDate: string | null = datePipe.transform(this.endDate, 'dd/MM/yyyy');

    const filteredData = dataOrders.filter((item: any) => {
      const itemDate = new Date(item.purchaseOrderDate);
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      return itemDate >= startDate && itemDate <= endDate;
    });
  
    const sortedData = filteredData.sort((a: any, b: any) => {
      const dateA = new Date(a.purchaseOrderDate).getTime();
      const dateB = new Date(b.purchaseOrderDate).getTime();
      return dateA - dateB;
    });

    const dataForPDF = await this.getDetailsForPDFPurchase(sortedData);

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

    const subtitle = 'Registro de Compras';
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

    const head = [['Fecha', 'Proveedor', 'Descripción', 'Cantidad', 'Total']];
  
    const data = dataForPDF.map((item: any) => [
      item.purchaseOrderDate,
      item.supplierName,
      item.observation,
      item.stock,
      `$ ${item.total}`
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
  
    doc.save(`Reporte_ordenes_ingreso_${formattedStartDate}_a_${formattedEndDate}.pdf`);

    this.endDate = '';
    this.startDate = '';
    this.closedModal();
  }

  async getDetailsForPDFSale(sortedData: any[]): Promise<any[]> {
    const promises = sortedData.map(async (item: any) => {
      const response = await this._expensesService.getDetailExpenseById(item.id).toPromise();
      return {
        ...item,
        stock: response.data.detailSaleOrderList[0].stock,
        saleOrderDate: new Date(item.saleOrderDate).toLocaleDateString()
      };
    });
  
    return Promise.all(promises);
  }

  async processPdfSales(dataOrders: any){
    const datePipe = new DatePipe('es-ES');

    const transformedStartDate: string | null = datePipe.transform(this.startDate, 'dd/MM/yyyy');
    const transformedEndDate: string | null = datePipe.transform(this.endDate, 'dd/MM/yyyy');

    const filteredData = dataOrders.filter((item: any) => {
      const itemDate = new Date(item.saleOrderDate);
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      return itemDate >= startDate && itemDate <= endDate;
    });
  
    const sortedData = filteredData.sort((a: any, b: any) => {
      const dateA = new Date(a.saleOrderDate).getTime();
      const dateB = new Date(b.saleOrderDate).getTime();
      return dateA - dateB;
    });

    const dataForPDF = await this.getDetailsForPDFSale(sortedData);

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

    const subtitle = 'Registro de Ventas';
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

    const head = [['Fecha', 'Cliente', 'Descripción', 'Cantidad', 'Total']];

    const data = dataForPDF.map((item: any) => [
      item.saleOrderDate,
      item.customerName,
      item.observation,
      item.stock,
      `$ ${item.total}`
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
  
    doc.save(`Reporte_ordenes_salida_${formattedStartDate}_a_${formattedEndDate}.pdf`);

    this.endDate = '';
    this.startDate = '';
    this.closedModal();

  }
}
