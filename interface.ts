
// Product Interfaces
export interface Product {
  _id: string;              // มาจาก MongoDB
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  picture: string;
  isActive: boolean;        // มีใน schema + swagger

  createdAt: string | Date; // timestamps: true
  updatedAt: string | Date;

  // virtual populate (ไม่อยู่ใน swagger, แต่ backend ใช้ได้)
  requests?: Request[];
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

export interface Request {
  _id: string;
  transactionDate: string | Date;
  transactionType: TransactionType;
  itemAmount: number;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | string;
  product_id: {
    _id: string;
    name: string;
    sku: string;
    category: string;
    stockQuantity: number;
  } | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Request Form Component Interfaces
export interface RequestFormProps {
  transactionType: TransactionType;
  productId: string;
  itemAmount: number;
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  productsLoading: boolean;
  error: string;
  onTransactionTypeChange: (value: TransactionType) => void;
  onProductChange: (value: string) => void;
  onItemAmountChange: (value: number) => void;
  onSubmit: () => void;
}

export interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
}

export interface ErrorMessageProps {
  message: string;
}

export interface ItemAmountInputProps {
  value: number;
  onChange: (value: number) => void;
}

export interface StockInfoProps {
  product: Product;
  transactionType: TransactionType;
}

export interface ProductSelectProps {
  products: Product[];
  value: string;
  onChange: (value: string) => void;
}

export interface TransactionTypeSelectProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}





  
