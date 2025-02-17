import Product from "../screens/Product";

export type OrderType = {
  id: number;
  order_id: string;
  user: string;
  date: string;
  time: string;
  total: string;
  status: string;
  delivery_address: string;
  discount: string;
  products: object[];
};
