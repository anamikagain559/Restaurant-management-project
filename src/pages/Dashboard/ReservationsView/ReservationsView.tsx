import React, { useState } from 'react';
import { Calendar, Phone, Users, Clock, Plus, Check, X as XIcon, Edit2, Mail, MessageSquare } from 'lucide-react';
import { 
  useGetAllReservationsQuery, 
  useUpdateReservationStatusMutation, 
  useGetMyReservationsQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation
} from '../../../redux/features/reservation/reservationApi';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useCurrentUser } from '../../../redux/features/auth/authSlice';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

interface Reservation {
  _id: string;
  name: string;
  guests: number;
  date: string;
  time: string;
  phone: string;
  email: string;
  status: ReservationStatus;
  requests?: string;
  createdAt: string;
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export function ReservationsView() {
  const user = useSelector(useCurrentUser);
  const isAdmin = user?.role === 'admin';

  const { data: adminReservations, isLoading: adminLoading } = useGetAllReservationsQuery(undefined, {
    skip: !isAdmin
  });
  const { data: userReservations, isLoading: userLoading } = useGetMyReservationsQuery(undefined, {
    skip: isAdmin
  });

  const [updateStatus] = useUpdateReservationStatusMutation();
  const [createReservation, { isLoading: isCreating }] = useCreateReservationMutation();
  const [updateReservation, { isLoading: isUpdating }] = useUpdateReservationMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    requests: ''
  });

  const isLoading = isAdmin ? adminLoading : userLoading;
  const reservationData = isAdmin ? adminReservations : userReservations;
  const reservations: Reservation[] = Array.isArray(reservationData) ? reservationData : (reservationData?.data || []);

  const handleStatusUpdate = async (id: string, status: ReservationStatus) => {
    if (!isAdmin) return;

    const action = status === 'confirmed' ? 'confirm' : 'cancel';
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this reservation?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'confirmed' ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      try {
        await updateStatus({ id, status }).unwrap();
        Toast.fire({
          icon: 'success',
          title: `Reservation ${status} successfully`
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
  };

  const handleOpenCreate = () => {
    setEditingRes(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: '2',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      requests: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res: Reservation) => {
    setEditingRes(res);
    setFormData({
      name: res.name,
      email: res.email,
      phone: res.phone,
      guests: res.guests.toString(),
      date: res.date,
      time: res.time,
      requests: res.requests || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        guests: Number(formData.guests)
      };

      if (editingRes) {
        await updateReservation({ id: editingRes._id, data: payload }).unwrap();
        Toast.fire({ icon: 'success', title: 'Reservation updated' });
      } else {
        await createReservation(payload).unwrap();
        Toast.fire({ icon: 'success', title: 'Reservation created' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to save reservation',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isAdmin ? 'Reservations' : 'My Reservations'}
          </h2>
          <p className="text-slate-500 text-sm">
            {isAdmin ? 'Manage guest bookings and table assignments' : 'Track your upcoming dining experiences'}
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>New Reservation</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Guest Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Party Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="px-6 py-10 text-center text-slate-500 font-medium">
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-3">
                            {res.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{res.name}</div>
                            <div className="flex items-center text-xs text-slate-500 mt-0.5">
                              <Phone className="w-3 h-3 mr-1" />
                              {res.phone}
                            </div>
                          </div>
                        </div>
                        {res.requests && (
                          <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">
                            Request: {res.requests}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm font-medium text-slate-900">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            {res.date}
                          </div>
                          <div className="flex items-center text-sm text-slate-500">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            {res.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-slate-900 font-medium">
                          <Users className="w-4 h-4 mr-2 text-slate-400" />
                          {res.guests} Guests
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(res.status)}`}
                        >
                          {res.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1">
                            {res.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(res._id, 'confirmed')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Confirm"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(res._id, 'cancelled')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <XIcon className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleOpenEdit(res)}
                              className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {editingRes ? 'Edit Reservation' : 'New Reservation'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Fill in the guest details below</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all group"
              >
                <XIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Guest Name
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Party Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium appearance-none"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                        <option key={num} value={num}>{num} Guests</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="date"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="time"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                    Special Requests
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium resize-none"
                      placeholder="Any allergies or milestones?"
                      value={formData.requests}
                      onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-4 py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isCreating || isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {editingRes ? 'Apply Changes' : 'Confirm Booking'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}