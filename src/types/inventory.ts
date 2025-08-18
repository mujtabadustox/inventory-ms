export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  pictures: string[];
  category: string;
}

export interface InventoryFilters {
  search: string;
  sortBy: 'name' | 'price' | 'stock' | 'category';
  sortOrder: 'asc' | 'desc';
  category: string;
}

export interface AddEditItemForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  pictures: string[];
  category: string;
}
