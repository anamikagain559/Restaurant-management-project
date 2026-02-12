import React, { useState } from 'react';
import { Plus, UtensilsCrossed, Edit2, Trash2 } from 'lucide-react';
type Category = 'All' | 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages';
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  available: boolean;
}
export function MenuView() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Crispy Calamari',
    description: 'Served with marinara sauce and lemon wedges',
    price: 14.0,
    category: 'Appetizers',
    available: true
  },
  {
    id: '2',
    name: 'Bruschetta',
    description: 'Toasted bread with tomatoes, garlic, basil, and olive oil',
    price: 10.0,
    category: 'Appetizers',
    available: true
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with roasted vegetables and quinoa',
    price: 26.0,
    category: 'Main Course',
    available: true
  },
  {
    id: '4',
    name: 'Ribeye Steak',
    description: '12oz steak served with mashed potatoes and asparagus',
    price: 34.0,
    category: 'Main Course',
    available: true
  },
  {
    id: '5',
    name: 'Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms and parmesan',
    price: 22.0,
    category: 'Main Course',
    available: false
  },
  {
    id: '6',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    price: 9.0,
    category: 'Desserts',
    available: true
  },
  {
    id: '7',
    name: 'Cheesecake',
    description: 'New York style cheesecake with strawberry topping',
    price: 8.5,
    category: 'Desserts',
    available: true
  },
  {
    id: '8',
    name: 'Craft Beer',
    description: 'Selection of local craft beers',
    price: 7.0,
    category: 'Beverages',
    available: true
  },
  {
    id: '9',
    name: 'House Wine',
    description: 'Red or White, glass',
    price: 9.0,
    category: 'Beverages',
    available: true
  }];

  const filteredItems =
  activeCategory === 'All' ?
  menuItems :
  menuItems.filter((item) => item.category === activeCategory);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Menu Management</h2>
          <p className="text-slate-500 text-sm">
            Manage your dishes and pricing
          </p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Categories */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto pb-1">
          {(
          [
          'All',
          'Appetizers',
          'Main Course',
          'Desserts',
          'Beverages'] as
          const).
          map((category) =>
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
                pb-3 text-sm font-medium whitespace-nowrap transition-colors relative
                ${activeCategory === category ? 'text-orange-600' : 'text-slate-500 hover:text-slate-700'}
              `}>

              {category}
              {activeCategory === category &&
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
            }
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) =>
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">

            {/* Image Placeholder */}
            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
              <UtensilsCrossed className="w-10 h-10 text-slate-300" />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-orange-500">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {!item.available &&
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-full">
                    Sold Out
                  </span>
                </div>
            }
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 line-clamp-1">
                  {item.name}
                </h3>
                <span className="font-bold text-orange-600">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                {item.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span
                  className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`} />

                  <span className="text-xs text-slate-500">
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);

}