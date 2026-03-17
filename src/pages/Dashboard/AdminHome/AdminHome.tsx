import {
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  TrendingUp } from
'lucide-react';
import { useGetAllOrdersQuery } from '../../../redux/features/order/orderApi';
import { useGetAllReservationsQuery } from '../../../redux/features/reservation/reservationApi';
import { useGetAllTablesQuery } from '../../../redux/features/table/tableApi';
import { useGetAllMenuQuery } from '../../../redux/features/menu/menuApi';
import { Link } from 'react-router-dom';

export function AdminHome() {
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(undefined);
  const { data: reservationsData, isLoading: resLoading } = useGetAllReservationsQuery(undefined);
  const { data: tablesData, isLoading: tablesLoading } = useGetAllTablesQuery(undefined);
  const { data: menuData } = useGetAllMenuQuery(undefined);

  const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.data || []);
  const reservations = Array.isArray(reservationsData) ? reservationsData : (reservationsData?.data || []);
  const tables = Array.isArray(tablesData) ? tablesData : (tablesData?.data || []);
  const menu = Array.isArray(menuData) ? menuData : (menuData?.data || []);

  // Today's Date start
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Revenue calculation
  const todayRevenue = orders
    .filter((order: any) => new Date(order.createdAt) >= today)
    .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

  // Active Orders (Not completed/served)
  const activeOrders = orders.filter((order: any) => 
    ['new', 'preparing', 'ready'].includes(order.status)
  ).length;

  // Occupied Tables
  const occupiedTables = tables.filter((table: any) => table.status === 'Occupied').length;
  const totalTables = tables.length;

  // Today's Reservations
  const todayReservations = reservations.filter((res: any) => {
    const resDate = new Date(res.date);
    resDate.setHours(0, 0, 0, 0);
    return resDate.getTime() === today.getTime();
  }).length;

  const stats = [
    {
      label: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      trend: '+12%',
      color: 'bg-green-500'
    },
    {
      label: 'Active Orders',
      value: activeOrders.toString(),
      icon: ShoppingBag,
      trend: '+5%',
      color: 'bg-orange-500'
    },
    {
      label: 'Occupied Tables',
      value: `${occupiedTables}/${totalTables}`,
      icon: Users,
      trend: `${Math.round((occupiedTables / (totalTables || 1)) * 100)}%`,
      color: 'bg-blue-500'
    },
    {
      label: 'Reservations',
      value: todayReservations.toString(),
      icon: Calendar,
      trend: 'Today',
      color: 'bg-purple-500'
    }
  ];

  const recentOrders = [...orders]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const popularItems = (menu || []).slice(0, 5).map((item: any) => ({
    name: item.name,
    orders: Math.floor(Math.random() * 100) + 50, // Placeholder for analytics
    price: `$${item.price.toFixed(2)}`
  }));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'preparing':
        return 'bg-amber-100 text-amber-700';
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'served':
      case 'completed':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (ordersLoading || resLoading || tablesLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
          System Overview
        </h2>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) =>
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">

            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                <stat.icon
                  className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />

              </div>
              <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-1 tracking-tighter">
              {stat.value}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recent Activity</h3>
            <Link to="/dashboard/orders" className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors">
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Table
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm font-medium">No recent orders.</td>
                  </tr>
                ) : recentOrders.map((order: any) =>
                  <tr
                    key={order._id}
                    className="hover:bg-slate-50 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      Table {order.tableNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {order.items.map((i: any) => typeof i.menuItem === 'object' ? i.menuItem.name : 'Item').join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>

                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900 text-right">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Best Sellers</h3>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {popularItems.length === 0 ? (
              <p className="text-center py-10 text-slate-500 text-sm">No analytics available yet.</p>
            ) : popularItems.map((item: any, index: number) =>
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {item.orders} orders
                    </p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-700">
                  {item.price}
                </span>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors bg-white rounded-xl border border-slate-200">
              View Full Insights
            </button>
          </div>
        </div>
      </div>
    </div>);

}