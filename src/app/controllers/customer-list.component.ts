import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { CustomerCreateDialogComponent } from './customer-create-dialog.component';
import { Customer } from '../models/customer.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-customer-list',
  templateUrl: '../views/customer-list.component.html',
  styleUrls: ['../templates/customer/customer-list.component.css']
})
export class CustomerListComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['identification', 'name', 'surname', 'phone_number', 'email', 'address', 'edit'];
  dataSource: Customer[] = [];
  dataCustomer = new MatTableDataSource<Customer>();
  searchTerm: string = '';
  isDesktop!: boolean;
  listCustomer: Customer[] = [];
  noResults: boolean = false;

  constructor(
    private dialog: MatDialog,
    private _customerService: CustomerService,
  ){}

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    this.loadDataCustomers();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  loadDataCustomers(){
    this._customerService.getAllCustomers().subscribe(
      (response: any) => {
        this.dataCustomer = new MatTableDataSource(response.data.customers);
        this.dataSource = this.dataCustomer.data;
        this.dataCustomer.paginator = this.paginator;
        this.dataCustomer.sort = this.sort;
        this.listCustomer = response.data.customers;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataCustomer.filterPredicate = (data: any, filter: string) => {
      return data.identification.toLowerCase().includes(filter);
    };
    this.dataCustomer.filter = filterValue;
    this.checkNoResults();
  }

  checkNoResults() {
    this.noResults = this.dataCustomer.filteredData.length === 0;
  }

  openCreateCustomerDialog(){
    this.dialog.open(CustomerCreateDialogComponent,{
      width: "600px",
      height: "auto",
      data: ''
    })
    .afterClosed()
    .subscribe( async result => {
      if(result === 'created'){
        this.loadDataCustomers();
      }
    }); 
  }

  openDeleteDialog(id: any){
    this.dialog.open(DeleteDialogComponent,{
      width: "555px",
      height: "auto",
      data: [id, 'customer'],
    })
    .afterClosed()
    .subscribe( async result => {
      if(result === 'deleted'){
        this.loadDataCustomers();
      }
    });
  }

  openEditDialog(element: any, element_id: any){
    this.dialog.open(CustomerCreateDialogComponent,{
      width: "600px",
      height: "auto",
      data: [element_id, element],
    })
    .afterClosed()
    .subscribe( async result => {
      if(result === 'updated'){
        this.loadDataCustomers();
      }
    }); 
  }
}
