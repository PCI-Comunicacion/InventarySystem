import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExpensesService } from '../services/expenses/expenses.service';
import { IncomeService } from '../services/income/income.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexStroke, ApexTitleSubtitle, ApexGrid, ApexFill, ChartComponent, ApexLegend, ApexPlotOptions } from 'ng-apexcharts';
import { KardexService } from '../services/kardex/kardex.service';
import { ProductService } from '../services/product/product.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  labels: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: '../views/dashboard.component.html',
  styleUrls: ['../templates/dashboard/dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("chart2") chart2!: ChartComponent;
  @ViewChild("chart3") chart3!: ChartComponent;
  @ViewChild("donut-chart") chart4!: ChartComponent;

  public chartOptionsSales: Partial<ChartOptions>;
  public chartOptionsPurchase: Partial<ChartOptions>;
  public chartOptionsProfit: Partial<ChartOptions>;
  public donutChartOptions: Partial<ChartOptions>;

  listKardex: any[] = [];
  purchaseOrders: any[] = [];
  saleOrders: any[] = [];
  isDesktop!: boolean;
  sparklineDataSales: any[] = [];
  sparklineDataProfit: any[] = [];
  sparklineDataPurchase: any[] = [];

  nameProductMoreStock: string = '';
  quantityProductMoreStock: number = 0;

  nameProductLessStock: string = '';
  quantityProductLessStock: number = 0;
  loadingChart1: boolean = true;
  loadingChart2: boolean = true;
  loadingChart3: boolean = true;
  loadingChart4: boolean = true;


  constructor(
    private _incomeService: IncomeService,
    private _expensesService: ExpensesService,
    private _kardexService: KardexService,
    private _toastService: ToastrService,
    private _productService: ProductService
  ) {
    this.chartOptionsSales = {
      series: [
        {
          name: "Ventas",
          data: []
        }
      ],
      chart: {
        type: "area",
        height: 160,
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: "straight"
      },
      fill: {
        opacity: 1
      },
      xaxis: {
        type: "datetime",
        categories: []
      },
      yaxis: {
        min: 0
      },
      title: {
        text: "$0",
        offsetX: 30,
        style: {
          fontSize: "24px",
        }
      },
    };

    this.chartOptionsPurchase = {
      series: [
        {
          name: "Compras",
          data: []
        }
      ],
      chart: {
        type: "area",
        height: 160,
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: "straight"
      },
      fill: {
        opacity: 1
      },
      xaxis: {
        type: "datetime",
        categories: []
      },
      yaxis: {
        min: 0
      },
      title: {
        text: "$0",
        offsetX: 30,
        style: {
          fontSize: "24px",
        }
      },
    };

    this.chartOptionsProfit = {
      series: [
        {
          name: "Ganancia",
          data: []
        }
      ],
      chart: {
        type: "area",
        height: 160,
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: "straight"
      },
      fill: {
        opacity: 1
      },
      xaxis: {
        type: "datetime",
        categories: []
      },
      yaxis: {
        min: 0
      },
      title: {
        text: "$0",
        offsetX: 30,
        style: {
          fontSize: "24px",
        }
      },
    };

    this.donutChartOptions = {
      series: [],
      chart: {
        type: 'donut',
        width: '100%',
        height: 400
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          customScale: 0.8,
          donut: {
            size: '75%',
          },
          offsetY: 20,
        },
      },
      title: {
        text: 'Productos Más Vendidos',
        style: {
          fontSize: '18px'
        }
      },
      labels: [],
      legend: {
        position: 'left',
        offsetY: 80
      }
    };
  }

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    await this.loadData();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  async loadData(){
    this._kardexService.getAllKardex().subscribe(
      async (response: any) => {
        this.separateOrders(response.data.kardexList);
        this.prepareSparklineData();
        await this.prepareDonutChartData();
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
        this.getMoreStockProduct(response.data.products);
        this.getLessStockProduct(response.data.products);
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

  private getMoreStockProduct(products: any[]): void {
    const product = products.reduce((prev, current) => {
      return (prev.stock > current.stock) ? prev : current;
    });

    this.nameProductMoreStock = product.name;
    this.quantityProductMoreStock = product.stock;
  }

  private getLessStockProduct(products: any[]): void {
    const product = products.reduce((prev, current) => {
      return (prev.stock < current.stock) ? prev : current;
    });

    this.nameProductLessStock = product.name;
    this.quantityProductLessStock = product.stock;
  }

  private separateOrders(kardexData: any[]): void {
    kardexData.forEach((item) => {
      if (item.sale_order_id === null && item.purchase_order_id !== null) {
        this.purchaseOrders.push(item);
      } else if (item.sale_order_id !== null && item.purchase_order_id === null) {
        this.saleOrders.push(item);
      }
    });
  }

  async prepareDonutChartData() {
    this.loadingChart4 = true;
    await this._expensesService.getTop5Categories().subscribe(
      (response: any) => {
        this.donutChartOptions.series = response.data.donutData.map((item: any) => item.totalSales);
        this.donutChartOptions.labels = response.data.donutData.map((item: any) => item.categoryName);
        this.loadingChart4 = false;
      }
    );

  }

  async prepareSparklineData() {
    await this._expensesService.getChartData().subscribe(
      async (response: any) => {
        await this.updateSparklineDataSales(response.data.chartData);
      }
    );

    await this._expensesService.getProfitChartData().subscribe(
      async (response: any) => {
        await this.updateSparklineDataProfit(response.data.chartData);
      }
    );

    await this._incomeService.getChartData().subscribe( 
      async (response: any) => {
        await this.updateSparklineDataPurchase(response.data.chartData);
      }
    );
  }

  async updateSparklineDataProfit(sparklineDataArray: { date: string, profit: number }[]) {
    this.loadingChart3 = true;
    const groupedData = sparklineDataArray.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = 0;
      }
      acc[curr.date] += curr.profit;
      return acc;
    }, {} as { [key: string]: number });
  
    const sortedData = Object.keys(groupedData)
      .map(date => ({ date, value: groupedData[date] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.sparklineDataProfit = sortedData;

    this.chartOptionsProfit.series = [
      {
        name: "Ganancia",
        data: this.sparklineDataProfit.map(item => item.value)
      }
    ];
  
    this.chartOptionsProfit.xaxis = {
      type: "datetime",
      categories: this.sparklineDataProfit.map(item => item.date)
    };
  
    this.chartOptionsProfit.title = {
      text: `Ganancias $${this.sparklineDataProfit.reduce((acc, item) => acc + item.value, 0)}`,
      offsetX: 30,
      style: {
        fontSize: "24px"
      }
    };
    this.loadingChart3 = false;
  }

  async updateSparklineDataSales(sparklineDataArray: { date: string, value: number }[]) {
    this.loadingChart1 = true;
    const groupedData = sparklineDataArray.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = 0;
      }
      acc[curr.date] += curr.value;
      return acc;
    }, {} as { [key: string]: number });
  
    const sortedData = Object.keys(groupedData)
      .map(date => ({ date, value: groupedData[date] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    this.sparklineDataSales = sortedData;
  
    this.chartOptionsSales.series = [
      {
        name: "Ventas",
        data: this.sparklineDataSales.map(item => item.value)
      }
    ];
  
    this.chartOptionsSales.xaxis = {
      type: "datetime",
      categories: this.sparklineDataSales.map(item => item.date)
    };
  
    this.chartOptionsSales.title = {
      text: `Ventas $${this.sparklineDataSales.reduce((acc, item) => acc + item.value, 0)}`,
      offsetX: 30,
      style: {
        fontSize: "24px",
      }
    };
    this.loadingChart1 = false;
  }
  
  async updateSparklineDataPurchase(sparklineDataArray: { date: string, value: number }[]) {
    this.loadingChart2 = true;
    const groupedData = sparklineDataArray.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = 0;
      }
      acc[curr.date] += curr.value;
      return acc;
    }, {} as { [key: string]: number });
  
    const sortedData = Object.keys(groupedData)
      .map(date => ({ date, value: groupedData[date] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    this.sparklineDataPurchase = sortedData;
  
    this.chartOptionsPurchase.series = [
      {
        name: "Compras",
        data: this.sparklineDataPurchase.map(item => item.value)
      }
    ];
  
    this.chartOptionsPurchase.xaxis = {
      type: "datetime",
      categories: this.sparklineDataPurchase.map(item => item.date)
    };
  
    this.chartOptionsPurchase.title = {
      text: `Compras $${this.sparklineDataPurchase.reduce((acc, item) => acc + item.value, 0)}`,
      offsetX: 30,
      style: {
        fontSize: "24px",
      }
    };
    this.loadingChart2 = false;
  }
}
