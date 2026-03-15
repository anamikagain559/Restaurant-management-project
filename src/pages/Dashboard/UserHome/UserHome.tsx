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
            date: res.status,
            icon: CalendarDays,
            color: 'text-blue-500',
            rawDate: new Date(res.createdAt)
        })),
        ...orders.map((order: any) => ({
            id: `ord-${order._id}`,
            type: 'Order',
            detail: `Order #${order._id.slice(-6).toUpperCase()} - $${order.totalAmount.toFixed(2)}`,
            date: order.status,
            icon: ShoppingBag,
            color: 'text-orange-500',
            rawDate: new Date(order.createdAt)
        }))
    ].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime()).slice(0, 5);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-kona-teal rounded-lg">
                        <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 hidden sm:block uppercase tracking-tighter">My Account</span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
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
                            <div className="h-32 bg-gradient-to-r from-kona-maroon to-kona-teal relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-xl bg-kona-light flex items-center justify-center text-kona-teal text-3xl font-bold">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 p-6">
                                <h2 className="text-xl font-bold text-slate-900 uppercase">
                                    {user.email.split('@')[0]}
                                </h2>
                                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                    <Shield className="w-4 h-4" />
                                    Role: <span className="text-kona-teal font-semibold uppercase text-xs">{user.role}</span>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <button 
                                        onClick={() => navigate('/dashboard/profile')}
                                        className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button 
                                        onClick={() => navigate('/dashboard/profile')}
                                        className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Account Settings
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-kona-teal/20 rounded-full blur-3xl group-hover:bg-kona-teal/30 transition-all"></div>
                            <h3 className="text-lg font-bold mb-2 relative z-10 text-glow">Premium Member</h3>
                            <p className="text-slate-400 text-sm mb-4 relative z-10 font-light italic">You've unlocked exclusive rewards and early access to reservations.</p>
                            <button className="px-4 py-2 bg-kona-teal hover:bg-white hover:text-kona-teal text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all relative z-10">
                                View Rewards
                            </button>
                        </div>
                    </div>

                    {/* Activity/Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                        <div className={`p-3 rounded-lg bg-white shadow-sm border border-slate-100 ${activity.color}`}>
                                            <activity.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900">{activity.type}</h4>
                                                <span className="text-xs text-slate-400 font-medium">{activity.date}</span>
                                            </div>
                                            <p className="text-slate-600 text-sm mt-1">{activity.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/dashboard/orders')}
                                className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-kona-teal hover:bg-kona-light rounded-xl transition-colors border border-transparent hover:border-kona-teal/10"
                            >
                                View All Activity
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div 
                                onClick={() => navigate('/dashboard/orders')}
                                className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all"
                            >
                                <div className="bg-white p-3 rounded-xl shadow-sm text-orange-500">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">
                                        {isOrdersLoading ? '...' : orders.length}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Orders</div>
                                </div>
                            </div>
                            <div 
                                onClick={() => navigate('/dashboard/reservations')}
                                className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all"
                            >
                                <div className="bg-white p-3 rounded-xl shadow-sm text-blue-500">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">
                                        {isReservationsLoading ? '...' : reservations.length}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Reservations</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
