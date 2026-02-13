import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, ChefHat } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../redux/features/order/orderApi';

type OrderStatus = 'new' | 'preparing' | 'ready' | 'served' | 'completed';
interface Order {
  _id: string;
  id?: string; // fallback
  tableNumber: number;
  items: {
    menuItem: {
      name: string;
    } | string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}
export function OrdersView() {
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const { data: orderData, isLoading } = useGetAllOrdersQuery(undefined);
  const [updateStatus] = useUpdateOrderStatusMutation();

  const orders: Order[] = orderData?.data || [];

  const handleStatusUpdate = async (id: string, currentStatus: OrderStatus) => {
    const statuses: OrderStatus[] = ['new', 'preparing', 'ready', 'served', 'completed'];
    const nextIdx = statuses.indexOf(currentStatus) + 1;
    if (nextIdx < statuses.length) {
      const nextStatus = statuses[nextIdx];
      try {
        await updateStatus({ id, status: nextStatus }).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to update status');
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
        return <AlertCircle className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'served':
      case 'completed':
        return <Clock className="w-4 h-4" />;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(['All', 'new', 'preparing', 'ready', 'served', 'completed'] as const).map(
            (status) =>
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap capitalize
                ${filter === status ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
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
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">

              <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-slate-800 uppercase">
                      {order._id.slice(-6)}
                    </span>
                    <span className="text-sm text-slate-500">
                      • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Table {order.tableNumber}
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              <div className="p-5">
                <ul className="space-y-3 mb-5">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <div className="flex gap-2">
                        <span className="font-bold text-slate-700">{item.quantity}x</span>
                        <span className="text-slate-600">
                          {typeof item.menuItem === 'object' ? item.menuItem.name : 'Unknown Item'}
                        </span>
                      </div>
                      <span className="text-slate-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-slate-500 text-sm font-medium">Total Amount</span>
                  <span className="text-xl font-bold text-slate-800">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Details
                </button>
                <button
                  onClick={() => handleStatusUpdate(order._id, order.status)}
                  disabled={order.status === 'completed'}
                  className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {order.status === 'completed' ? 'Completed' : 'Next Status'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>);

}