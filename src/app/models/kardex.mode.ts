export interface Kardex {
    id: number;
    nameProduct: string;
    transactionDate: Date;
    transactionType: string;
    previousStock: number;
    currentStock: number;
    observations: string;
}
  