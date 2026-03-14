export type Category = 'All' | 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  isAvailable: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}
