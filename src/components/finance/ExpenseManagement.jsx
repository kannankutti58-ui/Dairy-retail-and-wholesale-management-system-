import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Receipt,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const ExpenseManagement = () => {
  const { todayTotalRevenue, showNotification } = useShop();

  const [expenses, setExpenses] = useState([
    { id: 'e1', category: 'Staff Salary', amount: 500, note: 'Daily delivery helper & assistant wages' },
    { id: 'e2', category: 'Electricity', amount: 150, note: 'Deep freezer & commercial milk cooler run' },
    { id: 'e3', category: 'Transport', amount: 200, note: 'Tirunelveli feeder supply delivery freight' },
    { id: 'e4', category: 'Packaging', amount: 80, note: 'Milk carry bags & plastic crate tags' },
  ]);

  const [newCategory, setNewCategory] = useState('Staff Salary');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = todayTotalRevenue - totalExpenses;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newAmount || isNaN(newAmount) || Number(newAmount) <= 0) return;

    const exp = {
      id: `e-${Date.now()}`,
      category: newCategory,
      amount: Number(newAmount),
      note: newNote || 'General operational expense'
    };

    setExpenses(prev => [...prev, exp]);
    setNewAmount('');
    setNewNote('');
    showNotification(`Recorded ₹${newAmount} expense for ${newCategory}`);
  };

  const handleRemoveExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showNotification("Expense entry removed.");
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-red-600 to-amber-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-rose-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Cash Flow & Overhead
            </span>
            <span className="text-xs text-rose-100 font-medium">
              Daily Operating Expenditures
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Daily Expense & Profit Tracker</h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
            Record counter helper wages, deep freezer electricity, transport freight, and view real-time net take-home profit.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-rose-100 uppercase font-black tracking-wider block">Net Take-Home Profit</span>
          <div className="text-3xl font-black text-white font-mono mt-0.5">
            ₹{netProfit}
          </div>
          <span className="text-[10px] text-rose-100 font-bold block mt-0.5">
            After ₹{totalExpenses} Overhead Deductions
          </span>
        </div>
      </div>

      {/* 2. Three Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border-2 border-emerald-200 p-5 rounded-3xl space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
            <span>Today's Gross Turnover</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono pt-1">₹{todayTotalRevenue}</div>
          <p className="text-[11px] text-slate-500">Total collections from POS & Attai Cards</p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-red-50/60 border-2 border-rose-200 p-5 rounded-3xl space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-rose-800">
            <span>Operational Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-700 font-mono pt-1">₹{totalExpenses}</div>
          <p className="text-[11px] text-slate-500">{expenses.length} expense items recorded</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border-2 border-blue-200 p-5 rounded-3xl space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-sky-800">
            <span>Net Agency Earnings</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-indigo-950 font-mono pt-1">₹{netProfit}</div>
          <p className="text-[11px] text-slate-500">Real-time audited take-home margin</p>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Left: Add Expense Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" />
              <span>Record New Expense</span>
            </h3>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Expense Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-rose-500 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
              >
                <option value="Staff Salary">Staff / Helper Daily Wages</option>
                <option value="Electricity">Electricity & Commercial Cooler</option>
                <option value="Transport">Delivery Vehicle & Freight</option>
                <option value="Packaging">Plastic Covers, Crates & Tags</option>
                <option value="Store Maintenance">Shop Cleaning & Supplies</option>
                <option value="Miscellaneous">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Expense Amount (₹)</label>
              <input
                type="number"
                min="1"
                required
                placeholder="Enter amount in ₹"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-rose-500 rounded-xl p-2.5 font-mono font-black text-base text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Notes / Purpose</label>
              <input
                type="text"
                placeholder="e.g. Delivery boy diesel / daily morning helper"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-rose-500 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-rose-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense Entry</span>
            </button>
          </form>
        </div>

        {/* Right: Expense Journal List (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-600" />
                <span>Today's Expense Journal</span>
              </h3>
              <p className="text-xs text-slate-500">Live breakdown of operational disbursements</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-xl">
              ₹{totalExpenses} Total
            </span>
          </div>

          <div className="space-y-3">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-rose-300 transition flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-black text-slate-900 text-sm">{exp.category}</div>
                  <p className="text-slate-500 font-medium mt-0.5">{exp.note}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono font-black text-rose-700 text-base">
                    -₹{exp.amount}
                  </span>

                  <button
                    onClick={() => handleRemoveExpense(exp.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
