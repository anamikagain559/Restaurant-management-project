import { useSelector, useDispatch } from 'react-redux';
import { useCurrentUser, logout } from '../../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Shield,
    LogOut,
    ChefHat,
    ShoppingBag,
    Settings,
    Bell,
    CalendarDays
} from 'lucide-react';
import { useGetMyReservationsQuery } from '../../../redux/features/reservation/reservationApi';
import { useGetMyOrdersQuery } from '../../../redux/features/order/orderApi';

export function UserHome() {
    const user = useSelector(useCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    const { data: reservationsData, isLoading: isReservationsLoading, error: resError } = useGetMyReservationsQuery(undefined);
    const { data: ordersData, isLoading: isOrdersLoading, error: orderError } = useGetMyOrdersQuery(undefined);

    const reservations = Array.isArray(reservationsData) ? reservationsData : (reservationsData?.data || []);
    const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.data || []);

    if (resError || orderError) {
        console.error('Dashboard Error:', resError || orderError);
    }

    const activities = [
        ...reservations.map((res: any) => ({
            id: `res-${res._id}`,
            type: 'Reservation',
            detail: `Table for ${res.guests} - ${res.date} ${res.time}`,
            status: res.status,
            icon: CalendarDays,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            rawDate: new Date(res.createdAt)
        })),
        ...orders.map((order: any) => ({
            id: `ord-${order._id}`,
            type: 'Order',
            detail: `Order #${order._id.slice(-6).toUpperCase()} - $${(order.totalAmount || 0).toFixed(2)}`,
            status: order.status,
            icon: ShoppingBag,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
            rawDate: new Date(order.createdAt)
        }))
    ].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime()).slice(0, 5);

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'new':
                return 'bg-blue-100 text-blue-700';
            case 'confirmed':
            case 'ready':
                return 'bg-green-100 text-green-700';
            case 'preparing':
                return 'bg-amber-100 text-amber-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                        <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black text-slate-900 hidden sm:block uppercase tracking-tighter">My Account</span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-xl bg-orange-500 flex items-center justify-center text-white text-3xl font-black">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 p-6">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {user.email.split('@')[0]}
                                </h2>
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">
                                    <Shield className="w-4 h-4" />
                                    Role: <span className="text-orange-500">{user.role}</span>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <button 
                                        onClick={() => navigate('/dashboard/profile')}
                                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors border border-slate-100"
                                    >
                                        <User className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button 
                                        onClick={() => navigate('/dashboard/profile')}
                                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors border border-slate-100"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Account Settings
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all"></div>
                            <h3 className="text-lg font-black mb-2 relative z-10 uppercase tracking-tight">Premium Member</h3>
                            <p className="text-slate-400 text-xs mb-4 relative z-10 font-medium italic">You've unlocked exclusive rewards and early access to reservations.</p>
                            <button className="px-4 py-2 bg-orange-500 hover:bg-white hover:text-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative z-10">
                                View Rewards
                            </button>
                        </div>
                    </div>

                    {/* Activity/Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Recent Activity</h3>
                            <div className="space-y-4">
                                {activities.length === 0 ? (
                                    <div className="py-10 text-center text-slate-500 text-sm font-medium">No activity yet.</div>
                                ) : activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-slate-100 group">
                                        <div className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 ${activity.color} group-hover:scale-110 transition-transform`}>
                                            <activity.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-slate-900">{activity.type}</h4>
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusStyle(activity.status)}`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wider">{activity.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/dashboard/orders')}
                                className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-50 rounded-xl transition-colors border border-transparent hover:border-orange-100"
                            >
                                View All Activity
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div 
                                onClick={() => navigate('/dashboard/orders')}
                                className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all group"
                            >
                                <div className="bg-orange-50 p-3 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 tracking-tighter">
                                        {isOrdersLoading ? '...' : orders.length}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Orders</div>
                                </div>
                            </div>
                            <div 
                                onClick={() => navigate('/dashboard/reservations')}
                                className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
                            >
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 tracking-tighter">
                                        {isReservationsLoading ? '...' : reservations.length}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Reservations</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
