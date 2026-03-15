import React, { useState, useEffect } from 'react';
import { X, ShoppingBasket, UtensilsCrossed, Trash2, Minus, Plus, ArrowLeft, User, Phone, MapPin } from 'lucide-react';
import { useGetAllMenuQuery } from '../../redux/features/menu/menuApi';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectIsCartOpen,
  setCartOpen
} from '../../redux/features/cart/cartSlice';

interface CartDrawerProps {
  user: any;
  navigate: (path: string) => void;
  createOrder: (data: any) => { unwrap: () => Promise<any> };
  isOrdering: boolean;
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const CartDrawer: React.FC<CartDrawerProps> = ({
  user,
  navigate,
  createOrder,
  isOrdering
}) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const isOpen = useSelector(selectIsCartOpen);

  const onClose = () => dispatch(setCartOpen(false));

  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'ADDRESS'>('CART');
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    deliveryAddress: ''
  });

  const { data: menuResponse } = useGetAllMenuQuery(undefined);
  const menuData = menuResponse?.data || [];

  useEffect(() => {
    if (user) {
      setAddressData(prev => ({ ...prev, name: user.email?.split('@')[0] || '' }));
    }
  }, [user]);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleCheckoutClick = () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to proceed to checkout.',
        icon: 'info',
        confirmButtonColor: '#f97316',
        showCancelButton: true,
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
      });
      return;
    }
    setCheckoutStep('ADDRESS');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!addressData.phone || !addressData.deliveryAddress) {
      Toast.fire({
        icon: 'warning',
        title: 'Please provide all delivery details'
      });
      return;
    }

    try {
      await createOrder({
        user: user?._id || user?.userId,
        email: user?.email,
        items: cart.map(i => ({
          menuItem: i.item._id,
          quantity: i.quantity,
          price: i.item.price
        })),
        tableNumber: Math.floor(Math.random() * 20) + 1,
        totalAmount: cartTotal,
        customerName: addressData.name,
        phone: addressData.phone,
        address: addressData.deliveryAddress
      }).unwrap();

      Swal.fire({
        title: 'Order Placed!',
        text: 'Thank you for choosing Sunflower. Your delicious meal is on its way!',
        icon: 'success',
        confirmButtonColor: '#f97316'
      });
      dispatch(clearCart());
      onClose();
      setCheckoutStep('CART');
      setAddressData(prev => ({ ...prev, phone: '', deliveryAddress: '' }));
    } catch (err: any) {
      const getFriendlyMessage = (errorObj: any) => {
        const data = errorObj?.data;
        const formatError = (e: any) => {
          const field = e.path?.[e.path.length - 1] || '';
          if (field === 'phone') return 'Mobile number must be 11 digits (e.g., 01XXXXXXXXX).';
          if (field === 'address' || field === 'deliveryAddress') return 'Please provide a valid delivery address.';
          return e.message?.replace(/Invalid string: must match pattern .*/, 'is not in the correct format.');
        };

        if (Array.isArray(data)) return data.map(formatError).join('\n');
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed.map(formatError).join('\n');
          } catch { return data; }
        }
        return errorObj?.data?.message || errorObj?.message || 'Failed to place order. Please try again.';
      };

      Swal.fire({
        title: 'Order Information',
        text: getFriendlyMessage(err),
        icon: 'info',
        confirmButtonColor: '#f97316',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-8 py-3 font-bold'
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-[-20px_0_100px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500 border-l border-slate-100">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                <ShoppingBasket className="w-6 h-6 text-slate-700" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                {checkoutStep === 'CART' ? 'All Carts' : 'Protocol'}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {checkoutStep === 'CART' ? (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <ShoppingBasket className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">System empty</p>
                    <button onClick={onClose} className="mt-4 text-kona-teal font-black uppercase text-[10px] tracking-widest hover:underline">
                      Explore Prototypes
                    </button>
                  </div>
                ) : (
                  cart.map((i) => {
                    const itemImage = i.item.image || '';

                    return (
                      <div key={i.item._id} className="flex gap-4 p-4 bg-white hover:bg-slate-50 transition-colors rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden relative">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={i.item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                              }}
                            />
                          ) : (
                            <UtensilsCrossed className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">{i.item.name}</h4>
                            <button onClick={() => handleRemove(i.item._id)} className="text-rose-500 hover:text-rose-600 transition-all active:scale-90 bg-rose-50 p-2 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1 border border-slate-200">
                              <button onClick={() => handleUpdateQuantity(i.item._id, i.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-sm transition-all active:scale-90 border border-slate-200">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-slate-900 w-4 text-center">{i.quantity}</span>
                              <button onClick={() => handleUpdateQuantity(i.item._id, i.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-sm transition-all active:scale-90 border border-slate-200">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-black text-kona-teal text-sm italic">${(i.item.price * i.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                  <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <span>Total Assets</span>
                    <span className="text-slate-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-slate-900 text-white py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
                  >
                    Initialize Checkout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <button
                onClick={() => setCheckoutStep('CART')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-[0.3em] mb-10"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Assets
              </button>

              <form onSubmit={handlePlaceOrder} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identity</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-slate-900 transition-all font-medium"
                        value={addressData.name}
                        onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Communication</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-slate-900 transition-all font-medium"
                        value={addressData.phone}
                        onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Coordinates</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-5 w-4 h-4 text-slate-400" />
                      <textarea
                        required
                        placeholder="Delivery Address"
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-slate-900 transition-all resize-none font-medium"
                        value={addressData.deliveryAddress}
                        onChange={(e) => setAddressData({ ...addressData, deliveryAddress: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Payable Assets</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isOrdering}
                    className="w-full bg-kona-teal text-white py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-lg shadow-kona-teal/20 disabled:opacity-50"
                  >
                    {isOrdering ? 'Processing...' : 'Confirm Order'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
