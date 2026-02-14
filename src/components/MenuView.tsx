import React, { useState } from 'react';
import { Plus, UtensilsCrossed, Edit2, Trash2, X, Image as ImageIcon, Tag, Hash, DollarSign, AlignLeft, Type, CheckCircle2 } from 'lucide-react';
import {
  useGetAllMenuQuery,
  useDeleteMenuMutation,
  useUpdateMenuMutation,
  useCreateMenuMutation
} from '../redux/features/menu/menuApi';

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
  const { data: menuData, isLoading } = useGetAllMenuQuery(undefined);
  const [deleteMenu] = useDeleteMenuMutation();
  const [updateMenu] = useUpdateMenuMutation();
  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course' as Category,
    image: '',
    available: true
  });

  const menuItems: MenuItem[] = menuData?.data || [];
  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenu(id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete item');
      }
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      await updateMenu({
        id: item.id,
        data: { available: !item.available }
      }).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update availability');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMenu({
        ...newItem,
        price: Number(newItem.price)
      }).unwrap();
      setIsModalOpen(false);
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        image: '',
        available: true
      });
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to create item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Menu Management</h2>
          <p className="text-slate-500 text-sm">Manage your dishes and pricing</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Categories */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto pb-1">
          {(['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                pb-3 text-sm font-medium whitespace-nowrap transition-colors relative
                ${activeCategory === category ? 'text-orange-600' : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              {category}
              {activeCategory === category && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                    }}
                  />
                ) : (
                  <UtensilsCrossed className="w-10 h-10 text-slate-300" />
                )}

                {/* Actions Overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() => console.log('Edit', item.id)}
                    className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-slate-700 hover:text-orange-500 hover:scale-110 transition-all border border-white/20"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-slate-700 hover:text-red-500 hover:scale-110 transition-all border border-white/20"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {!item.available && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-full">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                  <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{item.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                  <button
                    onClick={() => toggleAvailability(item)}
                    className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-slate-500">{item.available ? 'Available' : 'Unavailable'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add New Menu Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Type className="w-4 h-4 text-orange-500" />
                    Item Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50/50"
                    placeholder="E.g. Signature Truffle Pasta"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <AlignLeft className="w-4 h-4 text-orange-500" />
                    Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50/50 resize-none"
                    placeholder="Short description of the dish..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      Price
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-slate-50/50"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Tag className="w-4 h-4 text-orange-500" />
                      Category
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-slate-50/50 cursor-pointer font-sans"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as Category })}
                    >
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" />
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="Paste image link here..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-slate-50/50"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <p className="text-xs text-orange-700 font-medium">
                    This item will be marked as <span className="font-bold underline text-orange-800">Available</span> by default.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
                >
                  {isCreating ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}