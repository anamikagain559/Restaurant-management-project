import React from 'react';
import { Users, Clock } from 'lucide-react';
type TableStatus = 'Available' | 'Occupied' | 'Reserved';
interface Table {
  id: number;
  capacity: number;
  status: TableStatus;
  currentOrder?: {
    id: string;
    time: string;
    amount: number;
  };
}
export function TablesView() {
  const tables: Table[] = Array.from(
    {
      length: 20
    },
    (_, i) => {
      const id = i + 1;
      let status: TableStatus = 'Available';
      let currentOrder = undefined;
      if ([2, 5, 8, 12, 15].includes(id)) {
        status = 'Occupied';
        currentOrder = {
          id: `#ORD-${100 + id}`,
          time: '25m',
          amount: Math.floor(Math.random() * 100) + 20
        };
      } else if ([4, 10, 18].includes(id)) {
        status = 'Reserved';
      }
      return {
        id,
        capacity: id % 3 === 0 ? 6 : id % 2 === 0 ? 4 : 2,
        status,
        currentOrder
      };
    }
  );
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Occupied':
        return 'bg-red-500';
      case 'Reserved':
        return 'bg-amber-500';
    }
  };
  const getStatusBg = (status: TableStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-green-50 border-green-200';
      case 'Occupied':
        return 'bg-red-50 border-red-200';
      case 'Reserved':
        return 'bg-amber-50 border-amber-200';
    }
  };
  const stats = {
    available: tables.filter((t) => t.status === 'Available').length,
    occupied: tables.filter((t) => t.status === 'Occupied').length,
    reserved: tables.filter((t) => t.status === 'Reserved').length
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Table Management</h2>

        <div className="flex gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 px-3">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-slate-600">
              Available ({stats.available})
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 border-l border-slate-200">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-slate-600">
              Occupied ({stats.occupied})
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 border-l border-slate-200">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-slate-600">
              Reserved ({stats.reserved})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables.map((table) =>
        <div
          key={table.id}
          className={`
              relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md
              ${getStatusBg(table.status)}
            `}>

            <div className="flex justify-between items-start mb-4">
              <span className="text-xl font-bold text-slate-800">
                T-{table.id}
              </span>
              <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${getStatusColor(table.status)}`}>

                {table.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {table.capacity} Seats
                </span>
              </div>

              {table.status === 'Occupied' && table.currentOrder &&
            <div className="pt-3 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Order</span>
                    <span className="font-bold text-slate-700">
                      {table.currentOrder.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{table.currentOrder.time}</span>
                    </div>
                    <span className="font-bold text-green-600">
                      ${table.currentOrder.amount}
                    </span>
                  </div>
                </div>
            }

              {table.status === 'Reserved' &&
            <div className="pt-3 border-t border-slate-200/60">
                  <div className="text-xs text-slate-500 mb-1">
                    Reserved for
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    7:00 PM
                  </div>
                </div>
            }

              {table.status === 'Available' &&
            <div className="pt-3 border-t border-slate-200/60 flex justify-center">
                  <span className="text-xs font-medium text-slate-400">
                    Ready for guests
                  </span>
                </div>
            }
            </div>
          </div>
        )}
      </div>
    </div>);

}