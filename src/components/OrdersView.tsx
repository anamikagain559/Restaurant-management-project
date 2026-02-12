import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, ChefHat } from 'lucide-react';
type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Served';
interface Order {
  id: string;
  table: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  timestamp: string;
}
export function OrdersView() {
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const orders: Order[] = [
  {
    id: 'ORD-101',
    table: 'Table 5',
    items: [
    {
      name: 'Grilled Salmon',
      quantity: 2,
      price: 24.0
    },
    {
      name: 'White Wine',
      quantity: 2,
      price: 9.0
    }],

    total: 66.0,
    status: 'New',
    timestamp: '12:30 PM'
  },
  {
    id: 'ORD-102',
    table: 'Table 3',
    items: [
    {
      name: 'Caesar Salad',
      quantity: 1,
      price: 12.0
    },
    {
      name: 'Tomato Soup',
      quantity: 1,
      price: 8.0
    }],

    total: 20.0,
    status: 'Preparing',
    timestamp: '12:25 PM'
  },
  {
    id: 'ORD-103',
    table: 'Table 8',
    items: [
    {
      name: 'Beef Burger',
      quantity: 3,
      price: 16.0
    },
    {
      name: 'Fries',
      quantity: 3,
      price: 5.0
    },
    {
      name: 'Coke',
      quantity: 3,
      price: 3.0
    }],

    total: 72.0,
    status: 'Ready',
    timestamp: '12:15 PM'
  },
  {
    id: 'ORD-104',
    table: 'Table 1',
    items: [
    {
      name: 'Pasta Carbonara',
      quantity: 2,
      price: 18.0
    }],

    total: 36.0,
    status: 'Served',
    timestamp: '12:00 PM'
  },
  {
    id: 'ORD-105',
    table: 'Table 10',
    items: [
    {
      name: 'Mushroom Risotto',
      quantity: 1,
      price: 19.0
    },
    {
      name: 'Tiramisu',
      quantity: 1,
      price: 10.0
    }],

    total: 29.0,
    status: 'New',
    timestamp: '12:35 PM'
  },
  {
    id: 'ORD-106',
    table: 'Table 7',
    items: [
    {
      name: 'Steak Frites',
      quantity: 2,
      price: 32.0
    },
    {
      name: 'Red Wine Bottle',
      quantity: 1,
      price: 45.0
    }],

    total: 109.0,
    status: 'Preparing',
    timestamp: '12:20 PM'
  }];

  const filteredOrders =
  filter === 'All' ?
  orders :
  orders.filter((order) => order.status === filter);
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Preparing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ready':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Served':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return <AlertCircle className="w-4 h-4" />;
      case 'Preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'Ready':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Served':
        return <Clock className="w-4 h-4" />;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(['All', 'New', 'Preparing', 'Ready', 'Served'] as const).map(
            (status) =>
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${filter === status ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
              `}>

                {status}
              </button>

          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) =>
        <div
          key={order.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">

            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-slate-800">
                    {order.id}
                  </span>
                  <span className="text-sm text-slate-500">
                    • {order.timestamp}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-600">
                  {order.table}
                </div>
              </div>
              <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>

                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </div>

            <div className="p-5">
              <ul className="space-y-3 mb-5">
                {order.items.map((item, idx) =>
              <li key={idx} className="flex justify-between text-sm">
                    <div className="flex gap-2">
                      <span className="font-bold text-slate-700">
                        {item.quantity}x
                      </span>
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-slate-500">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
              )}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-slate-500 text-sm font-medium">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-slate-800">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Details
              </button>
              <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
                Update Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>);

}