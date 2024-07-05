export interface ShoeModelType {
    id: number;
    model: string;
  }
  
  export interface BrandType {
    id: number;
    description: string;
  }
  
  export interface ColorType {
    id: number;
    description: string;
  }
  
  export interface SizeType {
    id: number;
    size: string;
  }

export interface NewProduct {
    price: number;
    stock: number;
    image?: string | null;
    detail?: string | null; 
    model: number | null; 
    brand: number | null; 
    size: number | null; 
    color: number | null
}

export interface Product {
    id: number;
    price: number;
    stock: number; 
    image: string | null; 
    detail: string | null; 
    model: ShoeModelType | null;
    brand: BrandType | null;
    size: SizeType | null; 
    color: ColorType | null; 
}

export interface Cart {
    id: number;
    user_email: string;
    items: Item[];
    date: string; 
    user: number
}

export interface Item {
    id: number;
    quantity: number;
    product: Product;
    cart: Cart;
  }
  export interface NewItem {
    product_id: number, 
    quantity?: number
  }
  