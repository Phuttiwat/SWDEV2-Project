
// Product Interfaces
export interface Product {
  _id?: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  picture: string;
  isActive: boolean;
}

export interface ProductResponse {
  success: boolean;
  count: number;
  data: Product[];
}


export type CreateProductPayload = {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  picture: string;
  isActive?: boolean; // มี default true ใน schema, เลยให้ optional
};

export type UpdateProductPayload = {
  name?: string;
  sku?: string;
  description?: string;
  category?: string;
  price?: number;
  stockQuantity?: number;
  unit?: string;
  picture?: string;
  isActive?: boolean;
};

// Request Interfaces
export type TransactionType = "stockIn" | "stockOut";

export interface RequestItemPayload {
  transactionDate?: string;        // "2025-11-14" (ใน schema มี default Date.now, เลยให้ optional ได้)
  transactionType: TransactionType;
  itemAmount: number; 
  product_id: string;    
}

export type RequestPayload = RequestItemPayload[];

export interface CreateRequestPayload {
  transactionDate?: string | Date;  // ถ้าไม่ส่ง backend ใช้ Date.now เอง
  transactionType: TransactionType;
  itemAmount: number;
  user: string;        // user ObjectId
  product_id: string;  // product ObjectId
}

export interface UpdateRequestPayload {
  transactionDate?: string | Date;
  transactionType?: TransactionType;
  itemAmount?: number;
  user?: string;
  product_id?: string;
}





  
