import React from 'react';
import { Calendar, Phone, Users, Clock, Plus, Check, X as XIcon } from 'lucide-react';
import { useGetAllReservationsQuery, useUpdateReservationStatusMutation } from '../redux/features/reservation/reservationApi';

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

export function ReservationsView() {
  const { data: reservationData, isLoading } = useGetAllReservationsQuery(undefined);
  const [updateStatus] = useUpdateReservationStatusMutation();

  const reservations: Reservation[] = reservationData?.data || [];

  const handleStatusUpdate = async (id: string, status: ReservationStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update status');
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
        <h2 className="text-2xl font-bold text-slate-800">Reservations</h2>
        <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
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
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((res) => (
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {res.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(res._id, 'confirmed')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(res._id, 'cancelled')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <XIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button className="text-slate-400 hover:text-orange-500 font-medium text-sm transition-colors ml-2">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}