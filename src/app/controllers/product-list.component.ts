import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../models/product.model';
import { ProductCreateDialogComponent } from './product-create-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category';
import { MatSort} from '@angular/material/sort';

@Component({
  selector: "app-product-list",
  templateUrl: "../views/product-list.component.html",
  styleUrls: ["../templates/product/product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  @ViewChild("dialogTemplateCategory") dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    "name",
    "category",
    "price_purchase",
    "price_sale",
    "stock",
    "status",
    "edit",
    "delete",
  ];
  displayedColumns2: string[] = ["id", "name", "actions"];

  dataProduct = new MatTableDataSource<Product>();
  dataSource: Product[] = [];
  searchTerm: string = "";
  selectedSupplierId: number | null = null;
  isDesktop!: boolean;
  noResults: boolean = false;
  globalFilter: string = "";
  listCategories: Category[] = [];
  newNameCategory: string = "";
  isEditing: boolean = false;
  idCategory: number = 0;

  constructor(
    private dialog: MatDialog,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _toastService: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    this.loadProducts();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }


  loadProducts() {
    this._productService.getAllProducts().subscribe(
      (response: any) => {
        this.dataProduct = new MatTableDataSource(response.data.products);
        this.dataSource = this.dataProduct.data;
        this.dataProduct.paginator = this.paginator;
        this.dataProduct.sort = this.sort;
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

  ngAfterViewInit() {
    this.dataProduct.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataProduct.filterPredicate = (data: any, filter: string) => {
      return (
        data.name.toLowerCase().includes(filter) ||
        data.nameCategory.toLowerCase().includes(filter)
      );
    };
    this.dataProduct.filter = filterValue;
    this.checkNoResults();
  }

  checkNoResults() {
    this.noResults = this.dataProduct.filteredData.length === 0;
  }

  openCreateProductDialog() {
    this.dialog
      .open(ProductCreateDialogComponent, {
        width: "600px",
        height: "auto",
        data: "",
      })
      .afterClosed()
      .subscribe(async (result) => {
        if (result === "created") {
          this.loadProducts();
        }
      });
  }

  openDeleteDialog(id: any) {
    this.dialog
      .open(DeleteDialogComponent, {
        width: "555px",
        height: "auto",
        data: [id, "product"],
      })
      .afterClosed()
      .subscribe(async (result) => {
        if (result === "deleted") {
          this.loadProducts();
        }
      });
  }

  openEditDialog(element: any, element_id: any) {
    this.dialog
      .open(ProductCreateDialogComponent, {
        width: "600px",
        height: "auto",
        data: [element_id, element],
      })
      .afterClosed()
      .subscribe(async (result) => {
        if (result === "updated") {
          this.loadProducts();
        }
      });
  }

  async openCategoryDialog() {
    this._categoryService.getAllCategories().subscribe(
      (response: any) => {
        this.listCategories = response.data.categories;
        this.dialog.open(this.dialogTemplate, {
          width: "500px",
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

  openEditCategory(category: Category, id: any){
    this.newNameCategory = category.name;
    this.idCategory = id;
    this.isEditing = true;
  }

  saveCategory(){
    if(!this.isEditing){
      this._categoryService.createCategory(this.newNameCategory).subscribe(
        (response: any) => {
          this._toastService.success(response.message, "Categoria creada", {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: "decreasing",
          });
          this.newNameCategory = "";
          this.dialog.closeAll();
        },
        (error: HttpErrorResponse) => {
          this._toastService.error(error.error.error, error.error.message, {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: "decreasing",
          });
        }
      );
    } else{
      const category : Category = {
        id: this.idCategory,
        name: this.newNameCategory
      }
      this._categoryService.updateCategory(category).subscribe(
        (response: any) => {
          this._toastService.success(response.message, "Categoria actualizada", {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: "decreasing",
          });
          this.dialog.closeAll();
        },
        (error: HttpErrorResponse) => {
          this._toastService.error(error.error.error, error.error.message, {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: "decreasing",
          });
        }
      );

      this.idCategory = 0;
      this.isEditing = false;
      this.newNameCategory = "";
    } 
  }

  cancelar():void{
    this.dialog.closeAll();
  }

}
