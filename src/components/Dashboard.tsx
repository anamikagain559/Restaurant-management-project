import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  TrendingUp,
  Clock } from
'lucide-react';
export function Dashboard() {
  const stats = [
  {
    label: "Today's Revenue",
    value: '$4,280',
    icon: DollarSign,
    trend: '+12%',
    color: 'bg-green-500'
  },
  {
    label: 'Active Orders',
    value: '23',
    icon: ShoppingBag,
    trend: '+5%',
    color: 'bg-orange-500'
  },
  {
    label: 'Occupied Tables',
    value: '12/20',
    icon: Users,
    trend: '60%',
    color: 'bg-blue-500'
  },
  {
    label: 'Reservations',
    value: '8',
    icon: Calendar,
    trend: 'Today',
    color: 'bg-purple-500'
  }];

  const recentOrders = [
  {
    id: '#ORD-001',
    table: 'Table 4',
    items: 'Grilled Salmon, Caesar Salad',
    total: '$45.00',
    status: 'Ready',
    time: '2 min ago'
  },
  {
    id: '#ORD-002',
    table: 'Table 12',
    items: 'Beef Burger, Fries, Coke',
    total: '$28.50',
    status: 'Preparing',
    time: '5 min ago'
  },
  {
    id: '#ORD-003',
    table: 'Table 8',
    items: 'Pasta Carbonara, Wine',
    total: '$32.00',
    status: 'Served',
    time: '12 min ago'
  },
  {
    id: '#ORD-004',
    table: 'Table 2',
    items: 'Mushroom Risotto',
    total: '$18.00',
    status: 'New',
    time: '15 min ago'
  },
  {
    id: '#ORD-005',
    table: 'Table 6',
    items: 'Chicken Wings, Beer',
    total: '$24.00',
    status: 'Served',
    time: '20 min ago'
  }];

  const popularItems = [
  {
    name: 'Signature Burger',
    orders: 145,
    price: '$16.00'
  },
  {
    name: 'Caesar Salad',
    orders: 120,
    price: '$12.00'
  },
  {
    name: 'Grilled Salmon',
    orders: 98,
    price: '$24.00'
  },
  {
    name: 'Pasta Carbonara',
    orders: 85,
    price: '$18.00'
  },
  {
    name: 'Chocolate Cake',
    orders: 76,
    price: '$9.00'
  }];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Preparing':
        return 'bg-amber-100 text-amber-700';
      case 'Ready':
        return 'bg-green-100 text-green-700';
      case 'Served':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard Overview
        </h2>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) =>
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">

            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon
                className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />

              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
            <button className="text-sm text-orange-500 font-medium hover:text-orange-600">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) =>
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {order.table}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>

                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">
                      {order.total}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Popular Dishes</h3>
          </div>
          <div className="p-6 space-y-6">
            {popularItems.map((item, index) =>
            <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {item.orders} orders today
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {item.price}
                </span>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
            <button className="w-full py-2 text-sm text-slate-600 font-medium hover:text-orange-500 transition-colors">
              View Menu Analytics
            </button>
          </div>
        </div>
      </div>
    </div>);

}