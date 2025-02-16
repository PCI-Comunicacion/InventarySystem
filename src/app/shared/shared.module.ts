import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateFormatPipe } from './date-format/date-format.pipe';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { ExpensesListComponent } from '../controllers/expenses-list.component';
import { IncomeListComponent } from '../controllers/income-list.component';
import { ExpensesCreateDialogComponent } from '../controllers/expenses-create-dialog.component';
import { IncomeCreateComponent } from '../controllers/income-create.component';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    DeleteDialogComponent,
    DateFormatPipe,
    SidebarComponent,
    IncomeListComponent,
    ExpensesListComponent,
    IncomeCreateComponent,
    ExpensesCreateDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatTooltipModule,
    MatNativeDateModule,
    JsonPipe,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgApexchartsModule,
  ],
  exports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatFormFieldModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    FormsModule, 
    ReactiveFormsModule, 
    DateFormatPipe,
    JsonPipe,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgApexchartsModule,
    IncomeListComponent,
    ExpensesListComponent,
    IncomeCreateComponent,
    ExpensesCreateDialogComponent
  ]
})
export class SharedModule { }
