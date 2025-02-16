import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from 'src/app/services/supplier/supplier.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { Supplier } from '../models/supplier.model';
import { SupplierCreateDialogComponent } from './supplier-create-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-supplier-list',
  templateUrl: '../views/supplier-list.component.html',
  styleUrls: ['../templates/supplier/supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = [ 'comercial_name', 'address', 'email', 'isForeign', 'edit'];
  
  listSupplier: Supplier[] = [];
  dataSupplier= new MatTableDataSource<Supplier>();
  dataSource: Supplier[] = [];
  searchTerm: string = '';
  isDesktop!: boolean;
  noResults: boolean = false;

  constructor(
    private dialog: MatDialog, 
    private _supplierService: SupplierService,
    private _toastService: ToastrService
  ){}

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    this.loadDataSuppliers();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  async loadDataSuppliers(){
    this._supplierService.getAllSuppliers().subscribe(
      (response: any) => {
        this.dataSupplier = new MatTableDataSource(response.data.suppliers);
        this.dataSource = this.dataSupplier.data;
        this.dataSupplier.paginator = this.paginator;
        this.listSupplier = response.data.suppliers;
        this.dataSupplier.sort = this.sort;
      }, 
      (error: HttpErrorResponse) =>{
        this._toastService.error('Error al cargar los proveedores', 'Error', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing'
        });
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue =  (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSupplier.filterPredicate = (data: any, filter: string) => {
      return data.comercial_name.toLowerCase().includes(filter)
    };
    this.dataSupplier.filter = filterValue;
    this.checkNoResults();
  }

  checkNoResults() {
    this.noResults = this.dataSupplier.filteredData.length === 0;
  }

  openCreateSupplierDialog(){
    this.dialog.open(SupplierCreateDialogComponent,{
      width: "600px",
      height: "auto",
      data: '',
    })
    .afterClosed()
    .subscribe( async result => {
      if(result === 'created'){
        await this.loadDataSuppliers();
      }
    });
  }

  openDeleteDialog(id: any){
    this.dialog.open(DeleteDialogComponent,{
      width: "555px",
      height: "auto",
      data: [id, 'supplier']
    })
    .afterClosed()
    .subscribe( async result => {
      if(result === 'deleted'){
        this.loadDataSuppliers();
      }
    });
  }

  openEditDialog(element: any, element_id: any){
    this.dialog.open(SupplierCreateDialogComponent,{
      width: "600px",
      height: "auto",
      data: [element_id, element],
    })
    .afterClosed()
    .subscribe( async result => {
      if(result === 'updated'){
        this.loadDataSuppliers();
      }
    }); 
  }
}
