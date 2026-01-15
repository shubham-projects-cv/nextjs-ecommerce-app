export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
