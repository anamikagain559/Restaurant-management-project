import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  useGetAllTablesQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation
} from '../redux/features/table/tableApi';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
type TableStatus = 'Available' | 'Occupied' | 'Reserved';
interface Table {
  _id: string; // Changed from id to _id
  tableNumber: number;
  capacity: number;
  status: TableStatus;
}

export function TablesView() {
  const { data: tableData, isLoading } = useGetAllTablesQuery(undefined);
  const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
  const [updateTable] = useUpdateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [filterStatus, setFilterStatus] = useState<TableStatus | 'All'>('All');
  const [tableFormData, setTableFormData] = useState({
    tableNumber: '',
    capacity: '',
    status: 'Available' as TableStatus
  });

  const allTables: Table[] = tableData?.data || [];
  const tables = filterStatus === 'All'
    ? allTables
    : allTables.filter(t => t.status === filterStatus);
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
  const handleOpenCreate = () => {
    setEditingTable(null);
    setTableFormData({ tableNumber: '', capacity: '', status: 'Available' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (table: Table) => {
    setEditingTable(table);
    setTableFormData({
      tableNumber: table.tableNumber.toString(),
      capacity: table.capacity.toString(),
      status: table.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        tableNumber: Number(tableFormData.tableNumber),
        capacity: Number(tableFormData.capacity),
        status: tableFormData.status
      };

      if (editingTable) {
        await updateTable({ id: editingTable._id, data: payload }).unwrap();
        Toast.fire({ icon: 'success', title: 'Table updated successfully' });
      } else {
        await createTable(payload).unwrap();
        Toast.fire({ icon: 'success', title: 'Table created successfully' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to save table',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the table from the system!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteTable(id).unwrap();
        Toast.fire({ icon: 'success', title: 'Table removed' });
      } catch (err: any) {
        Swal.fire({
          title: 'Error!',
          text: err?.data?.message || 'Failed to delete table',
          icon: 'error',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  const handleStatusToggle = async (table: Table, newStatus: TableStatus) => {
    try {
      await updateTable({ id: table._id, data: { status: newStatus } }).unwrap();
      Toast.fire({ icon: 'success', title: `Table marked as ${newStatus}` });
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to update status',
        icon: 'error',
        confirmButtonColor: '#f97316'
      });
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Table Management</h2>
          <p className="text-slate-500 text-sm">Monitor and manage seating availability</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setFilterStatus('All')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${filterStatus === 'All'
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-50'
                }`}
            >
              <span className="text-xs font-semibold">All ({allTables.length})</span>
            </button>
            <button
              onClick={() => setFilterStatus('Available')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border-l border-slate-100 transition-all ${filterStatus === 'Available'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-slate-50'
                }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs font-semibold">Available ({allTables.filter(t => t.status === 'Available').length})</span>
            </button>
            <button
              onClick={() => setFilterStatus('Occupied')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border-l border-slate-100 transition-all ${filterStatus === 'Occupied'
                  ? 'bg-red-500 text-white'
                  : 'hover:bg-slate-50'
                }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-semibold">Occupied ({allTables.filter(t => t.status === 'Occupied').length})</span>
            </button>
            <button
              onClick={() => setFilterStatus('Reserved')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border-l border-slate-100 transition-all ${filterStatus === 'Reserved'
                  ? 'bg-amber-500 text-white'
                  : 'hover:bg-slate-50'
                }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold">Reserved ({allTables.filter(t => t.status === 'Reserved').length})</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`
                group relative p-6 rounded-2xl border-2 transition-all duration-300
                ${getStatusBg(table.status)}
              `}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(table)}
                  className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-400 hover:text-orange-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(table._id)}
                  className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    T-{table.tableNumber}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {table.capacity} Guests
                    </span>
                  </div>
                </div>
                <div className={`
                  px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-sm
                  ${getStatusColor(table.status)}
                `}>
                  {table.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                {(['Available', 'Occupied', 'Reserved'] as TableStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(table, status)}
                    className={`
                      py-2 rounded-lg text-[10px] font-bold transition-all border
                      ${table.status === status
                        ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600'
                      }
                    `}
                  >
                    {status === 'Available' ? 'Free' : status.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Table Number
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="E.g. 5"
                    value={tableFormData.tableNumber}
                    onChange={(e) => setTableFormData({ ...tableFormData, tableNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Seating Capacity
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="E.g. 4"
                    value={tableFormData.capacity}
                    onChange={(e) => setTableFormData({ ...tableFormData, capacity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all cursor-pointer font-medium text-slate-700"
                    value={tableFormData.status}
                    onChange={(e) => setTableFormData({ ...tableFormData, status: e.target.value as TableStatus })}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {editingTable ? 'Update' : 'Add Table'}
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