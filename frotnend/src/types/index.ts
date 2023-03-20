export interface Product {
  productId: string;
  name: string;
  price: number;
  amount: number;
  images?: string[] | null;
}
