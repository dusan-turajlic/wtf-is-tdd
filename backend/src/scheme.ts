export interface ProductTable {
  product_id: string;
  name: string;
  price: number;
  description: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductImageTable {
  product_image_id: string;
  product_id: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}
