import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  Save, 
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';

import { useCurrentUser } from '../../../redux/features/auth/authSlice';
import { useGetMeQuery, useUpdateProfileMutation } from '../../../redux/features/auth/authApi';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export function Profile() {
  const currentUser = useSelector(useCurrentUser);
  const { data: userData, isLoading: isFetching, refetch } = useGetMeQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  useEffect(() => {
    if (userData?.data) {
      setFormData({
        name: userData.data.name || userData.data.email.split('@')[0],
        phone: userData.data.phone || '',
        address: userData.data.address || '',
        email: userData.data.email || ''
      });
    }
  }, [userData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Front-end validation for Bangladeshi Phone Number
    const phoneRegex = /^(?:\+8801\d{9}|01\d{9})$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      Swal.fire({
        title: 'Invalid Phone Number',
        text: 'Please enter a valid Bangladeshi phone number (e.g., 017XXXXXXXX or +88017XXXXXXXX)',
        icon: 'warning',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      }).unwrap();

      Toast.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your profile has been updated.'
      });
      setIsEditing(false);
      refetch();
    } catch (err: any) {
      const getFriendlyMessage = (errorObj: any) => {
        const data = errorObj?.data;
        
        const formatError = (e: any) => {
          const field = e.path?.[e.path.length - 1] || '';
          const message = e.message || '';
          
          if (field === 'phone') {
            return 'Mobile Number: Must be exactly 11 digits starting with 01.';
          }
          if (field === 'name') {
            if (e.code === 'too_small') return 'Name: Please enter your full name (min 2 characters).';
          }
          if (field === 'address') {
            if (e.code === 'too_small') return 'Address: Please provide a detailed delivery address.';
          }
          
          // Technical error fallback
          if (message.includes('Cast to ObjectId')) {
            return 'System Error: We encountered an issue updating your account. Our team is looking into it.';
          }

          return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message.replace(/Invalid string: must match pattern .*/, 'format is incorrect.')}`;
        };

        if (Array.isArray(data)) {
          return data.map(formatError).join('\n');
        }

        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed.map(formatError).join('\n');
          } catch {
            return data;
          }
        }

        return errorObj?.data?.message || 'We could not update your profile right now. Please check your internet and try again.';
      };

      Swal.fire({
        title: 'Heads Up!',
        text: getFriendlyMessage(err),
        icon: 'warning',
        confirmButtonColor: '#f97316',
        confirmButtonText: 'Fix Now',
        background: '#fff',
        customClass: {
          popup: 'rounded-[1.5rem] shadow-2xl border border-slate-100',
          confirmButton: 'rounded-xl px-10 py-4 font-black uppercase tracking-widest text-xs',
          title: 'text-2xl font-black text-slate-900',
          htmlContainer: 'text-slate-500 font-medium'
        }
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Polishing your details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage your personal information and preferences.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-orange-400 to-rose-500"></div>
            <div className="px-6 pb-8 text-center">
              <div className="relative inline-block -mt-12 mb-4">
                <div className="w-24 h-24 bg-white p-1.5 rounded-[2rem] shadow-xl">
                  <div className="w-full h-full rounded-[1.7rem] bg-orange-100 flex items-center justify-center text-orange-600 text-4xl font-black">
                    {formData.name[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-2xl border-4 border-white hover:bg-orange-500 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight line-clamp-1">{formData.name}</h3>
              <p className="text-slate-400 text-sm font-medium mt-1 truncate">{formData.email}</p>
              
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                <CheckCircle2 className="w-3 h-3" />
                {currentUser?.role} Account
              </div>
            </div>

            <div className="border-t border-slate-50 p-6 space-y-4">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</p>
                  <p className="text-sm font-bold text-slate-700">{formData.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h4 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
              {isEditing ? 'Update Personal Info' : 'Account Overview'}
            </h4>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      required
                      placeholder="Your name"
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-slate-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="email" 
                      disabled
                      placeholder="Email cannot be changed"
                      className="w-full bg-slate-100 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-slate-400 cursor-not-allowed transition-all"
                      value={formData.email}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex justify-between">
                    <span>Phone Number</span>
                    {isEditing && <span className="text-[9px] text-orange-500">BD Format Required</span>}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="tel" 
                      disabled={!isEditing}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-slate-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Account Role</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      disabled
                      className="w-full bg-slate-100 border-none rounded-2xl pl-12 pr-4 py-4 outline-none font-bold text-slate-400 uppercase tracking-widest cursor-not-allowed"
                      value={currentUser?.role}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Shipping Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-5 w-5 h-5 text-slate-300" />
                  <textarea 
                    disabled={!isEditing}
                    placeholder="Where should we deliver your gourmet meals?"
                    rows={4}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-slate-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 flex items-center justify-end gap-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-8 py-3 bg-slate-900 hover:bg-orange-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
