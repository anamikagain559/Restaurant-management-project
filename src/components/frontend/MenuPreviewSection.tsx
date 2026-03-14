import React from 'react';
import { UtensilsCrossed, Plus } from 'lucide-react';
import { MenuItem, Category } from '../../types/frontend';

interface MenuPreviewSectionProps {
  isMenuLoading: boolean;
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  filteredItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

export const MenuPreviewSection: React.FC<MenuPreviewSectionProps> = ({
  isMenuLoading,
  activeCategory,
  setActiveCategory,
  filteredItems,
  addToCart
}) => {
  return (
    <section id="menu" className="py-32 bg-slate-50 overflow-hidden relative">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-kona-pink/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-4">
              Curated Cart
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-kona-maroon tracking-tighter uppercase leading-[0.85]">
              Discovery <br /> <span className="text-kona-teal">Prototypes</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-sm text-right hidden md:block">
            Each dish is a masterpiece of seasonal engineering and flavor optimization.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-16">
          {(['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
                ${activeCategory === category ? 'bg-kona-maroon text-white shadow-[0_0_30px_rgba(0,0,0,0.2)] scale-110' : 'bg-white text-slate-400 hover:text-kona-maroon border border-slate-100 hover:bg-slate-50'}
              `}>
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {isMenuLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group relative bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden flex flex-col hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="h-64 relative p-4">
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-inner">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <UtensilsCrossed className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}

                    {/* Glass Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md text-kona-maroon text-[8px] font-black tracking-[0.3em] uppercase rounded-full shadow-lg border border-white/50">
                        {item.category}
                      </span>
                    </div>

                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <span className="px-8 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl">
                          Depleted
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-kona-maroon/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-2 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-kona-maroon group-hover:text-kona-teal transition-colors tracking-tighter uppercase leading-tight">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-lg text-slate-500 line-clamp-2 leading-relaxed mb-8 h-12 md:h-16 font-light italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price Unit</span>
                      <span className="text-2xl font-black text-slate-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-kona-teal hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                    >
                      <Plus className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-kona-teal to-kona-light opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
