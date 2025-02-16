import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { UserCreateDialogComponent } from './user-create-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  templateUrl: '../views/user-list.component.html',
  styleUrls: ['../templates/user/user-create-dialog.component.css']
})
export class UserListComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;  //Se bindea con los componentes del html 
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'email', 'position', 'role',  'status', 'edit', 'delete'];
  dataSource: User[] = [];
  listUser: User[] = [];
  dataUser= new MatTableDataSource<User>();
  searchTerm: string = '';
  isDesktop!: boolean;
  noResults: boolean = false;

  constructor(
    private dialog: MatDialog,
    private _userService: UserService,
    private _toastService: ToastrService
  ){}

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    this.loadUsers();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  loadUsers() {
    this._userService.getAllUsers().subscribe(
      (response: any) => {
        this.dataUser = new MatTableDataSource(response.data.users);
        this.dataSource = this.dataUser.data;
        this.dataUser.paginator = this.paginator;
        this.dataUser.sort = this.sort;
        this.listUser = response.data;
      },
      (error: HttpErrorResponse) => {
        this._toastService.error(error.error.error, error.error.message, {
          progressBar: true,
          timeOut: 2000,
          progressAnimation: 'decreasing',
        });
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue =  (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataUser.filterPredicate = (data: any, filter: string) => {
      return data.name.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter)
    };
    this.dataUser.filter = filterValue;
    this.checkNoResults();
  }

  checkNoResults() {
    this.noResults = this.dataUser.filteredData.length === 0;
  }

  openCreateUserDialog(){
    this.dialog.open(UserCreateDialogComponent,{
      width: "600px",
      height: "auto",
      data: ''
    }).afterClosed().subscribe(async result => {
      if(result === 'created'){
        this.loadUsers();
      }
    });
  }

  openEditUserDialog(element: any, element_id: any){
    this.dialog.open(UserCreateDialogComponent,{
      width: "600px",
      height: "auto",
      data: [element_id, element],
    }).afterClosed().subscribe(async result => {
      if(result === 'updated'){
        this.loadUsers();
      }
    });
  }

  openDeleteUserDialog(id: any){
    this.dialog.open(DeleteDialogComponent,{
      width: "600px",
      height: "auto",
      data: [id, 'user'],
    }).afterClosed().subscribe(async result => {
      if(result === 'deleted'){
        this.loadUsers();
      }
    });
  }
}
