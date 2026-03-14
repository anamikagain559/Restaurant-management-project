import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, selectCartCount } from '../../redux/features/cart/cartSlice';

interface FloatingCartButtonProps {
  onClick: () => void;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onClick }) => {
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  if (cart.length === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-10 z-[60] bg-slate-950 text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-5 hover:scale-105 transition-all group border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      <div className="relative flex items-center gap-5">
        <div className="relative">
          <ShoppingBasket className="w-6 h-6 group-hover:text-slate-950 transition-colors" />
          <span className="absolute -top-3 -right-3 bg-kona-teal text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950 group-hover:border-white transition-all">
            {cartCount}
          </span>
        </div>
        <span className="font-black text-xs uppercase tracking-widest group-hover:text-slate-950 transition-colors">
          Assets Protocol • ${cartTotal.toFixed(2)}
        </span>
      </div>
    </button>
  );
};
