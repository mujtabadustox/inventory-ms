// Temporary inline types to resolve import issues
interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  pictures: string[];
  category: string;
}

export const dummyInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 199.99,
    stock: 45,
    pictures: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    category: "Electronics"
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable 100% organic cotton t-shirt, available in multiple colors",
    price: 29.99,
    stock: 128,
    pictures: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    category: "Clothing"
  },
  {
    id: "3",
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle, keeps drinks cold for 24 hours",
    price: 24.99,
    stock: 67,
    pictures: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"],
    category: "Home & Garden"
  },
  {
    id: "4",
    name: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with touch controls and multiple brightness levels",
    price: 89.99,
    stock: 12,
    pictures: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"],
    category: "Electronics"
  },
  {
    id: "5",
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials, perfect for all yoga styles",
    price: 49.99,
    stock: 89,
    pictures: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"],
    category: "Sports"
  },
  {
    id: "6",
    name: "Smartphone Case",
    description: "Durable protective case with built-in kickstand for iPhone and Android",
    price: 19.99,
    stock: 156,
    pictures: ["https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?w=400"],
    category: "Electronics"
  },
  {
    id: "7",
    name: "Running Shoes",
    description: "Lightweight running shoes with superior cushioning and breathable mesh",
    price: 129.99,
    stock: 34,
    pictures: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    category: "Sports"
  },
  {
    id: "8",
    name: "Coffee Maker",
    description: "Programmable coffee maker with built-in grinder and thermal carafe",
    price: 149.99,
    stock: 23,
    pictures: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400"],
    category: "Home & Garden"
  },
  {
    id: "9",
    name: "Denim Jeans",
    description: "Classic fit denim jeans with stretch comfort, available in various washes",
    price: 79.99,
    stock: 67,
    pictures: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
    category: "Clothing"
  },
  {
    id: "10",
    name: "Gaming Mouse",
    description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons",
    price: 69.99,
    stock: 41,
    pictures: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"],
    category: "Electronics"
  },
  {
    id: "11",
    name: "Plant Pot Set",
    description: "Ceramic plant pots in various sizes, perfect for indoor and outdoor plants",
    price: 39.99,
    stock: 78,
    pictures: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400"],
    category: "Home & Garden"
  },
  {
    id: "12",
    name: "Fitness Tracker",
    description: "Water-resistant fitness tracker with heart rate monitor and sleep tracking",
    price: 89.99,
    stock: 29,
    pictures: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400"],
    category: "Electronics"
  }
];

export const categories = [
  "Electronics",
  "Clothing", 
  "Home & Garden",
  "Sports",
  "Books",
  "Automotive",
  "Beauty",
  "Toys",
  "Food & Beverages",
  "Health & Wellness"
];

// Export the type for use in other components
export type { InventoryItem };
