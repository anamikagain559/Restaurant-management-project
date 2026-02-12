import React from 'react';
import { Calendar, Phone, Users, Clock, Plus } from 'lucide-react';
type ReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled';
interface Reservation {
  id: string;
  name: string;
  partySize: number;
  date: string;
  time: string;
  phone: string;
  table?: string;
  status: ReservationStatus;
  notes?: string;
}
export function ReservationsView() {
  const reservations: Reservation[] = [
  {
    id: 'RES-001',
    name: 'Sarah Johnson',
    partySize: 4,
    date: 'Today',
    time: '7:00 PM',
    phone: '(555) 123-4567',
    table: 'Table 4',
    status: 'Confirmed',
    notes: 'Anniversary celebration'
  },
  {
    id: 'RES-002',
    name: 'Michael Chen',
    partySize: 2,
    date: 'Today',
    time: '7:30 PM',
    phone: '(555) 987-6543',
    table: 'Table 12',
    status: 'Confirmed'
  },
  {
    id: 'RES-003',
    name: 'Emily Davis',
    partySize: 6,
    date: 'Today',
    time: '8:00 PM',
    phone: '(555) 456-7890',
    status: 'Pending',
    notes: 'Needs high chair'
  },
  {
    id: 'RES-004',
    name: 'Robert Wilson',
    partySize: 8,
    date: 'Tomorrow',
    time: '6:30 PM',
    phone: '(555) 234-5678',
    status: 'Confirmed'
  },
  {
    id: 'RES-005',
    name: 'Jessica Brown',
    partySize: 3,
    date: 'Tomorrow',
    time: '7:15 PM',
    phone: '(555) 876-5432',
    status: 'Cancelled',
    notes: 'Rescheduled to next week'
  },
  {
    id: 'RES-006',
    name: 'David Miller',
    partySize: 5,
    date: 'Oct 24',
    time: '8:00 PM',
    phone: '(555) 345-6789',
    status: 'Confirmed'
  },
  {
    id: 'RES-007',
    name: 'Jennifer Taylor',
    partySize: 2,
    date: 'Oct 24',
    time: '6:00 PM',
    phone: '(555) 654-3210',
    status: 'Pending'
  },
  {
    id: 'RES-008',
    name: 'Thomas Anderson',
    partySize: 12,
    date: 'Oct 25',
    time: '7:00 PM',
    phone: '(555) 789-0123',
    status: 'Confirmed',
    notes: 'Private room required'
  }];

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
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
                  Table
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
              {reservations.map((res) =>
              <tr
                key={res.id}
                className="hover:bg-slate-50 transition-colors">

                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-3">
                        {res.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {res.name}
                        </div>
                        <div className="flex items-center text-xs text-slate-500 mt-0.5">
                          <Phone className="w-3 h-3 mr-1" />
                          {res.phone}
                        </div>
                      </div>
                    </div>
                    {res.notes &&
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">
                        Note: {res.notes}
                      </div>
                  }
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
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-slate-900 font-medium">
                        {res.table || 'Unassigned'}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Users className="w-3 h-3 mr-1" />
                        {res.partySize} Guests
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(res.status)}`}>

                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-orange-500 font-medium text-sm transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}