import { useSelector, useDispatch } from 'react-redux';
import { useCurrentUser, logout } from '../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Shield,
    LogOut,
    ChefHat,
    ShoppingBag,
    Heart,
    Settings,
    Bell
} from 'lucide-react';

export function UserDashboard() {
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

    const activities = [
        { id: 1, type: 'Order', detail: 'Signature Burger #ORD-224', date: 'Yesterday', icon: ShoppingBag, color: 'text-orange-500' },
        { id: 2, type: 'Reservation', detail: 'Table for 2 - Friday 7:00 PM', date: '2 days ago', icon: ChefHat, color: 'text-blue-500' },
        { id: 3, type: 'Favorite', detail: 'Added Grilled Salmon to favorites', date: '5 days ago', icon: Heart, color: 'text-red-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                        <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 hidden sm:block">My Account</span>
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
                            <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-3xl font-bold">
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
                                    Role: <span className="text-orange-600 font-semibold">{user.role}</span>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <button className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors">
                                        <User className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        Account Settings
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all"></div>
                            <h3 className="text-lg font-bold mb-2 relative z-10">Premium Member</h3>
                            <p className="text-slate-400 text-sm mb-4 relative z-10">You've unlocked exclusive rewards and early access to reservations.</p>
                            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all relative z-10">
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
                            <button className="w-full mt-6 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-xl transition-colors">
                                View All Activity
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-orange-500">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">12</div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Orders</div>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-blue-500">
                                    <ChefHat className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">4</div>
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
