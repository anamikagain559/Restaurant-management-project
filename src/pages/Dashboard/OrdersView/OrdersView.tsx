import { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, ChefHat, Eye, ArrowRight, ShoppingBag } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useGetMyOrdersQuery } from '../../../redux/features/order/orderApi';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useCurrentUser } from '../../../redux/features/auth/authSlice';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

type OrderStatus = 'new' | 'preparing' | 'ready' | 'served' | 'completed';
interface Order {
  _id: string;
  id?: string; // fallback
  tableNumber: number;
  items: {
    menuItem: {
      name: string;
      price: number;
      image?: string;
    } | string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export function OrdersView() {
  const user = useSelector(useCurrentUser);
  const isAdmin = user?.role === 'admin';
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: adminOrders, isLoading: adminLoading } = useGetAllOrdersQuery(undefined, {
    skip: !isAdmin
  });
  const { data: userOrders, isLoading: userLoading, error: userError } = useGetMyOrdersQuery(undefined, {
    skip: isAdmin
  });

  const [updateStatus] = useUpdateOrderStatusMutation();

  if (userError) {
    console.error('OrdersView Error:', userError);
  }

  const isLoading = isAdmin ? adminLoading : userLoading;
  const orderData = isAdmin ? adminOrders : userOrders;
  const orders: Order[] = Array.isArray(orderData) ? orderData : (orderData?.data || []);

  const handleStatusUpdate = async (id: string, currentStatus: OrderStatus) => {
    if (!isAdmin) return;
    const statuses: OrderStatus[] = ['new', 'preparing', 'ready', 'served', 'completed'];
    const nextIdx = statuses.indexOf(currentStatus) + 1;
    
    if (nextIdx < statuses.length) {
      const nextStatus = statuses[nextIdx];
      
      const result = await Swal.fire({
        title: 'Update Status?',
        text: `Move order to ${nextStatus.toUpperCase()}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, update it!'
      });

      if (result.isConfirmed) {
        try {
          await updateStatus({ id, status: nextStatus }).unwrap();
          Toast.fire({
            icon: 'success',
            title: `Order status updated to ${nextStatus}`
          });
        } catch (err: any) {
          Swal.fire({
             title: 'Error!',
             text: err?.data?.message || 'Failed to update status',
             icon: 'error',
             confirmButtonColor: '#f97316'
          });
        }
      }
    }
  };

  const filteredOrders =
    filter === 'All' ?
      orders :
      orders.filter((order) => order.status === filter);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ready':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'served':
      case 'completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'preparing':
        return <ChefHat className="w-3.5 h-3.5" />;
      case 'ready':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'served':
      case 'completed':
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {isAdmin ? 'Kitchen Display' : 'My Orders'}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            {isAdmin ? 'Manage active restaurant orders' : 'Track your delicious choices'}
          </p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {(['All', 'new', 'preparing', 'ready', 'served', 'completed'] as const).map(
            (status) =>
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${filter === status ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-50'}
              `}>
                {status}
              </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No orders found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">

                <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-lg text-slate-800 tracking-tighter uppercase">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-lg inline-block text-center flex items-center justify-center">
                      Table {order.tableNumber}
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border capitalize ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 transition-colors group-hover/item:bg-orange-100 group-hover/item:text-orange-600">
                            {item.quantity}
                          </div>
                          <span className="text-sm font-bold text-slate-600 transition-colors group-hover/item:text-slate-900">
                            {typeof item.menuItem === 'object' ? item.menuItem.name : 'Unknown Item'}
                          </span>
                        </div>
                        <span className="text-xs font-black text-slate-400 group-hover/item:text-slate-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-2">
                        + {order.items.length - 3} more items
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex gap-3">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, order.status)}
                      disabled={order.status === 'completed'}
                      className="flex-1 py-3 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {order.status === 'completed' ? (
                        'Completed'
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Order Details</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">#{selectedOrder._id.toUpperCase()}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <AlertCircle className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 font-black">
                        {item.quantity}x
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{typeof item.menuItem === 'object' ? item.menuItem.name : 'Unknown Item'}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">${item.price.toFixed(2)} per unit</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Tax (included)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Grand Total</span>
                  <span className="text-3xl font-black text-orange-500 tracking-tighter">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-4">
               <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}