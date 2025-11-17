
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
    isActive?: boolean;
  } | string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Request Form Component Interfaces
export interface RequestFormProps {
  transactionType: TransactionType;
  productId: string;
  itemAmount: number;
  transactionDate: string | Date | null;
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  productsLoading: boolean;
  error: string;
  onTransactionTypeChange: (value: TransactionType) => void;
  onProductChange: (value: string) => void;
  onItemAmountChange: (value: number) => void;
  onTransactionDateChange: (value: string | Date | null) => void;
  onSubmit: () => void;
  buttonText?: string;
  loadingText?: string;
  disableProductSelect?: boolean;
}

export interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
  buttonText?: string;
  loadingText?: string;
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
  disabled?: boolean;
}

export interface TransactionTypeSelectProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}





  
