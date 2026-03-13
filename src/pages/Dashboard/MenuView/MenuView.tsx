import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});
import { Plus, UtensilsCrossed, Edit2, Trash2, X, Image as ImageIcon, Tag, DollarSign, AlignLeft, Type, CheckCircle2, Search } from 'lucide-react';
import {
  useGetAllMenuQuery,
  useDeleteMenuMutation,
  useUpdateMenuMutation,
  useCreateMenuMutation
} from '../../../redux/features/menu/menuApi';

type Category = 'All' | 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  isAvailable: boolean;
}

import { useSelector } from 'react-redux';
import { useCurrentUser } from '../../../redux/features/auth/authSlice';

export function MenuView() {
  const user = useSelector(useCurrentUser);
  const isAdmin = user?.role === 'admin';
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: menuData, isLoading } = useGetAllMenuQuery(undefined);
  const [deleteMenu] = useDeleteMenuMutation();
  const [updateMenu] = useUpdateMenuMutation();
  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course' as Category,
    image: '',
    isAvailable: true
  });

  const menuItems: MenuItem[] = menuData?.data || [];
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316', // orange-500
      cancelButtonColor: '#64748b', // slate-500
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
    });

    if (result.isConfirmed) {
      try {
        await deleteMenu(id).unwrap();
        Toast.fire({
          icon: 'success',
          title: 'Item deleted successfully'
        });
      } catch (err: any) {
        Swal.fire({
          title: 'Error!',
          text: err?.data?.message || 'Failed to delete item',
          icon: 'error',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    if (!isAdmin) return;
    try {
      await updateMenu({
        id: item._id, // Backend uses _id
        data: { isAvailable: !item.isAvailable }
      }).unwrap();
      Toast.fire({
        icon: 'success',
        title: `Item is now ${!item.isAvailable ? 'available' : 'unavailable'}`
      });
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to update availability',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  const handleOpenEdit = (item: MenuItem) => {
    if (!isAdmin) return;
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      isAvailable: item.isAvailable
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setItemFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      image: '',
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenu({
          id: editingItem._id,
          data: {
            ...itemFormData,
            price: Number(itemFormData.price)
          }
        }).unwrap();
      } else {
        await createMenu({
          ...itemFormData,
          price: Number(itemFormData.price)
        }).unwrap();
      }
      setIsModalOpen(false);
      Toast.fire({
        icon: 'success',
        title: editingItem ? 'Item updated successfully' : 'Item created successfully'
      });
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to save item',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-orange-600 to-orange-500">
              {isAdmin ? 'Menu Management' : 'Our Menu'}
            </span>
          </h2>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-8 h-[2px] bg-orange-200" />
            {isAdmin ? 'Fine-tune your culinary offerings' : 'Discover our handcrafted delicacies'}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="group relative flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:bg-orange-500 hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 hover:shadow-orange-200 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10">Add Menu</span>
        </button>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/40 backdrop-blur-md p-2 rounded-[2rem] border border-white/60 shadow-sm sticky top-0 z-20">
        {/* Categories - Capsule Style */}
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth px-2">
          <div className="flex gap-2 p-1">
            {(['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                  ${activeCategory === category 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105' 
                    : 'text-slate-600 hover:bg-white hover:text-orange-600 hover:shadow-md'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar - Glassmorphism */}
        <div className="relative w-full lg:w-80 group px-2">
          <div className="absolute inset-0 bg-orange-500/5 rounded-2xl blur-xl group-focus-within:bg-orange-500/10 transition-all duration-500" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search our collection..."
            className="w-full pl-12 pr-6 py-3.5 bg-white rounded-2xl border-none shadow-inner-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-orange-500 animate-spin" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-orange-200 blur-sm animate-pulse" />
          </div>
          <p className="text-slate-400 font-bold animate-pulse">Preparing the Menu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item._id}
              className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 group border border-slate-100 hover:border-orange-100 relative animate-in fade-in zoom-in duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-56 rounded-[2rem] overflow-hidden mb-5 bg-slate-50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <UtensilsCrossed className="w-12 h-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}

                {/* Actions Overlay */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-slate-700 hover:text-orange-500 hover:scale-110 transition-all border border-white"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-slate-700 hover:text-red-500 hover:scale-110 transition-all border border-white"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-orange-600 text-xs font-black rounded-full shadow-lg border border-white">
                    {item.category}
                  </span>
                </div>

                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-30">
                    <div className="transform -rotate-12 border-4 border-white px-6 py-2 rounded-xl">
                      <span className="text-white text-xl font-black tracking-widest uppercase">
                        Sold Out
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 pr-2">
                    {item.name}
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-orange-500 drop-shadow-sm">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 h-10 font-medium">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-black text-slate-400 tracking-wider uppercase">
                      {item.isAvailable ? 'Available' : 'Restocking'}
                    </span>
                  </div>
                  
                  {isAdmin && (
                    <button
                      onClick={() => toggleAvailability(item)}
                      className="text-xs font-bold text-orange-500 hover:text-orange-600 underline underline-offset-4 decoration-2 decoration-orange-200 hover:decoration-orange-500 transition-all"
                    >
                      Toggle Availability
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden relative z-10 animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-slate-100">
            {/* Modal Header */}
            <div className="relative h-32 bg-slate-900 flex items-center px-10">
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-orange-500/20 to-transparent" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-1">
                  {editingItem ? 'Refine Dish' : 'Create Masterpiece'}
                </h3>
                <p className="text-orange-400 font-bold tracking-wide uppercase text-xs">
                  {editingItem ? 'Updating catalog details' : 'Adding to the collection'}
                </p>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">
                    Signature Name
                  </label>
                  <div className="relative group">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      required
                      type="text"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                      placeholder="E.g. Velvet Ocean Salmon"
                      value={itemFormData.name}
                      onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">
                    Epicurean Description
                  </label>
                  <div className="relative group">
                    <AlignLeft className="absolute left-4 top-5 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                    <textarea
                      required
                      rows={3}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner resize-none"
                      placeholder="Narrate the ingredients and flavors..."
                      value={itemFormData.description}
                      onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">
                    Value ($)
                  </label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-slate-800 shadow-inner"
                      value={itemFormData.price}
                      onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">
                    Collection
                  </label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                    <select
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-slate-800 cursor-pointer shadow-inner appearance-none"
                      value={itemFormData.category}
                      onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value as Category })}
                    >
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">
                    Visual Presentation (URL)
                  </label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="url"
                      placeholder="Paste a striking image link..."
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                      value={itemFormData.image}
                      onChange={(e) => setItemFormData({ ...itemFormData, image: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black tracking-widest uppercase text-xs hover:bg-slate-50 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-[2] relative group overflow-hidden bg-slate-900 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">
                    {isCreating ? 'Curating...' : (editingItem ? 'Publish Updates' : 'Add to Menu')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}