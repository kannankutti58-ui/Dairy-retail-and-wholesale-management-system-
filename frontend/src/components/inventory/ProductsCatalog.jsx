import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import {
  Search,
  Plus,
  Package,
  Calendar,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Flame,
  Droplets,
  DollarSign,
  Tag
} from 'lucide-react';
import { ExpiryWatch } from './ExpiryWatch';

// Product visual graphics helper
const getProductVisual = (id, category, name) => {
  if (id === 'aavin-blue' || name.toLowerCase().includes('blue')) {
    return {
      bgColor: 'from-blue-600 to-sky-700',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      icon: '🥛',
      tag: '3.0% Fat • Toned',
      badge: 'Blue Pouch'
    };
  }
  if (id === 'aavin-purple' || name.toLowerCase().includes('purple') || name.toLowerCase().includes('delight')) {
    return {
      bgColor: 'from-purple-600 to-indigo-700',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      icon: '🥛',
      tag: '3.5% Fat • Std',
      badge: 'Purple Pouch'
    };
  }
  if (id === 'aavin-orange' || name.toLowerCase().includes('orange') || name.toLowerCase().includes('full cream')) {
    return {
      bgColor: 'from-orange-600 to-amber-700',
      badgeColor: 'bg-orange-100 text-orange-950 border-orange-200',
      icon: '🥛',
      tag: '4.5%+ Fat • FCM',
      badge: 'Orange Pouch'
    };
  }
  if (name.toLowerCase().includes('ghee')) {
    return {
      bgColor: 'from-amber-500 to-yellow-600',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-200',
      icon: '🏺',
      tag: '100% Pure Cow Ghee',
      badge: 'Aavin Ghee Jar'
    };
  }
  if (name.toLowerCase().includes('curd') || name.toLowerCase().includes('buttermilk')) {
    return {
      bgColor: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-200',
      icon: '🥣',
      tag: 'Probiotic Fresh Curd',
      badge: 'Fresh Curd'
    };
  }
  if (name.toLowerCase().includes('butter') || name.toLowerCase().includes('paneer')) {
    return {
      bgColor: 'from-yellow-600 to-amber-700',
      badgeColor: 'bg-yellow-100 text-yellow-950 border-yellow-200',
      icon: '🧈',
      tag: 'Dairy Fresh Solid',
      badge: 'Butter & Paneer'
    };
  }
  if (category === 'sweets' || name.toLowerCase().includes('jamun') || name.toLowerCase().includes('mysore') || name.toLowerCase().includes('peda')) {
    return {
      bgColor: 'from-pink-600 to-rose-700',
      badgeColor: 'bg-pink-100 text-pink-950 border-pink-200',
      icon: '🍬',
      tag: 'Pure Ghee Sweets',
      badge: 'Festival Sweet'
    };
  }
  return {
    bgColor: 'from-sky-600 to-blue-700',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-200',
    icon: '📦',
    tag: 'Aavin Dairy SKU',
    badge: 'Aavin Pack'
  };
};

export const ProductsCatalog = () => {
  const {
    dairyProducts,
    festivalSweets,
    milkProducts,
    curdProducts,
    stockInwardLogs,
    addStockToProduct,
    showNotification
  } = useShop();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Stock Add Modal State
  const [selectedProductForAdd, setSelectedProductForAdd] = useState(null);
  const [quantityInput, setQuantityInput] = useState(24);
  const [selectedUnit, setSelectedUnit] = useState('packets');
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [inwardNote, setInwardNote] = useState('Tirunelveli Central Dairy Delivery');
  const [recentInwardSuccess, setRecentInwardSuccess] = useState(null);

  // Stock Log Pagination
  const [logPage, setLogPage] = useState(1);
  const logsPerPage = 4;

  const allItems = [
    ...milkProducts.map(m => ({
      ...m,
      category: 'milk',
      typeLabel: 'Fresh Milk (Tirunelveli)',
      stockValue: m.currentStock,
      defaultUnit: 'packets',
      unitType: '500ml packet',
      wholesalePrice: (m.mrp || 24) - 2
    })),
    ...curdProducts.map(c => ({
      ...c,
      category: 'curd',
      typeLabel: 'Curd Product',
      stockValue: c.currentStock,
      defaultUnit: c.id.includes('kg') ? 'kg' : 'packets',
      unitType: c.unit || 'packets',
      wholesalePrice: (c.mrp || 35) - 3
    })),
    ...dairyProducts.map(d => ({
      ...d,
      typeLabel: 'Aavin Value-Added Dairy',
      stockValue: d.stock || 20,
      defaultUnit: d.name.toLowerCase().includes('ghee') ? 'jars' : 'units',
      unitType: d.unit || 'unit',
      wholesalePrice: Math.round((d.mrp || 100) * 0.92)
    })),
    ...festivalSweets.map(s => ({
      ...s,
      category: 'sweets',
      typeLabel: 'Festival Sweets',
      stockValue: s.stock || 15,
      defaultUnit: 'boxes',
      unitType: s.unit || 'box',
      wholesalePrice: Math.round((s.mrp || 150) * 0.9)
    }))
  ];

  const filteredItems = allItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.tamilName && item.tamilName.includes(searchFilter));
    return matchesCategory && matchesSearch;
  });

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedLogs = stockInwardLogs.slice(
    (logPage - 1) * logsPerPage,
    logPage * logsPerPage
  );

  const openAddModal = (item) => {
    setSelectedProductForAdd(item);
    setQuantityInput(item.category === 'milk' ? 24 : 10);
    setSelectedUnit(item.defaultUnit || 'packets');
    setEntryDate(new Date().toISOString().split('T')[0]);
  };

  const handleConfirmAddStock = (e) => {
    e.preventDefault();
    if (!selectedProductForAdd || !quantityInput || Number(quantityInput) <= 0) return;

    const result = addStockToProduct({
      productId: selectedProductForAdd.id,
      quantityToAdd: Number(quantityInput),
      entryDate,
      unit: selectedUnit
    });

    if (result.success) {
      setRecentInwardSuccess({
        productName: result.productName,
        previousStock: result.previousStock,
        addedQty: result.addedQty,
        newStock: result.newStock,
        unit: selectedUnit,
        date: entryDate
      });
      showNotification(`Added +${quantityInput} ${selectedUnit} to ${selectedProductForAdd.name}!`);
      setSelectedProductForAdd(null);
    }
  };

  const totalStockSKUs = allItems.length;
  const totalPhysicalStockPackets = milkProducts.reduce((sum, m) => sum + (m.currentStock || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-orange-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Inventory Master Catalog
            </span>
            <span className="text-xs text-orange-100 font-medium">
              Live Stock Inward & Refills
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Stock Management & Product Catalog</h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
            Real-time physical inventory monitoring for Aavin fresh milk varieties, pure ghee, homemade curd, paneer, and festival sweets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] text-orange-100 uppercase font-black tracking-wider block">Physical Milk Stock</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {totalPhysicalStockPackets} <span className="text-xs font-bold font-sans">pkts</span>
            </div>
            <span className="text-[10px] text-orange-100 font-bold block mt-0.5">
              {(totalPhysicalStockPackets / 24).toFixed(1)} Crates ({totalPhysicalStockPackets * 0.5}L)
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {recentInwardSuccess && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
              ✓
            </div>
            <div className="text-xs">
              <span className="font-black text-emerald-950 text-sm block">
                Stock Refilled Successfully!
              </span>
              <p className="text-slate-700 mt-0.5 font-medium">
                <strong>{recentInwardSuccess.productName}</strong> was <strong>{recentInwardSuccess.previousStock}</strong>, added <strong className="text-emerald-700">+{recentInwardSuccess.addedQty} {recentInwardSuccess.unit}</strong> on <strong>{recentInwardSuccess.date}</strong>.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-emerald-400 rounded-2xl px-5 py-2.5 text-right shadow-xs shrink-0">
            <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider block">
              Updated Stock Balance
            </span>
            <span className="text-xl font-black text-emerald-950 font-mono">
              {recentInwardSuccess.newStock} {recentInwardSuccess.unit}
            </span>
          </div>
        </div>
      )}

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All SKUs', color: 'bg-slate-900' },
            { id: 'milk', label: 'Fresh Milk', color: 'bg-blue-600' },
            { id: 'curd', label: 'Curd & Buttermilk', color: 'bg-emerald-600' },
            { id: 'ghee', label: 'Pure Ghee', color: 'bg-amber-600' },
            { id: 'paneer', label: 'Paneer & Butter', color: 'bg-yellow-600' },
            { id: 'sweets', label: 'Festival Sweets', color: 'bg-rose-600' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition shadow-2xs ${
                activeCategory === cat.id
                  ? `${cat.color} text-white shadow-md scale-[1.02]`
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product, Tamil name..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border-2 border-slate-200 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 font-medium focus:outline-none transition shadow-2xs"
          />
        </div>
      </div>

      {/* Product Grid with Images / Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedItems.map((item) => {
          const visual = getProductVisual(item.id, item.category, item.name);
          const stockNum = item.stockValue || 0;
          const isLowStock = stockNum < 15;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-300 transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-md space-y-4 group relative overflow-hidden"
            >
              {/* Product Visual Header Card */}
              <div className={`w-full h-24 rounded-2xl bg-gradient-to-r ${visual.bgColor} p-3 text-white flex items-center justify-between shadow-xs relative overflow-hidden`}>
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full block w-fit">
                    {visual.badge}
                  </span>
                  <div className="text-xs font-bold text-white/90 mt-1 font-mono">{visual.tag}</div>
                </div>
                <div className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                  {visual.icon}
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-amber-700 transition">
                    {item.name}
                  </h4>
                  {item.fastSelling && (
                    <span className="text-[9px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                      <Flame className="w-3 h-3 text-amber-600" /> Fast
                    </span>
                  )}
                </div>

                {item.tamilName && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{item.tamilName}</p>
                )}
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.unit || item.tag || item.unitType}</p>

                {/* Stock Level Meter */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Stock Availability</span>
                    <span className={isLowStock ? 'text-rose-600 font-black' : 'text-emerald-700'}>
                      {isLowStock ? 'Low Stock ⚠️' : 'In Stock ✅'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLowStock ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min((stockNum / 60) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Retail MRP</span>
                    <span className="text-lg font-black text-slate-900 font-mono">₹{item.mrp}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Physical Stock</span>
                    <span className="text-sm font-black text-amber-950 font-mono bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 inline-block">
                      {stockNum} {item.defaultUnit}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openAddModal(item)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Refill / Add Inward Stock</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Stock Inward History Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs space-y-4 mt-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              <span>Dairy Stock Refill & Inward Journal</span>
            </h3>
            <p className="text-xs text-slate-500">Official log of deliveries received from Tirunelveli Central Dairy</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-black text-[10px]">
                <th className="py-2.5 px-3">Entry ID</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Previous</th>
                <th className="py-2.5 px-3 text-emerald-700">Added Qty</th>
                <th className="py-2.5 px-3">New Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 font-medium">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{log.id}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{log.date} ({log.time || '04:30 AM'})</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{log.productName}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{log.previousStock}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">+{log.addedQty} {log.unit}</td>
                  <td className="py-3 px-3 font-mono font-black text-slate-900">{log.newStock} {log.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={logPage}
          totalItems={stockInwardLogs.length}
          itemsPerPage={logsPerPage}
          onPageChange={setLogPage}
        />
      </div>

      {/* Stock Refill Inward Modal */}
      {selectedProductForAdd && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                Refill Dairy Stock Inward
              </h3>
              <button
                onClick={() => setSelectedProductForAdd(null)}
                className="text-slate-400 hover:text-slate-600 font-black"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div className="font-black text-slate-900 text-sm">{selectedProductForAdd.name}</div>
              <div className="text-slate-600">
                Current In-Store Stock: <strong className="text-slate-900 font-mono">{selectedProductForAdd.stockValue} {selectedProductForAdd.defaultUnit}</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmAddStock} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Quantity to Add</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-mono font-black text-base text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Unit</label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="packets">Packets (500ml)</option>
                    <option value="crates">Crates (24 pkts)</option>
                    <option value="jars">Jars / Bottles</option>
                    <option value="boxes">Boxes / Tins</option>
                    <option value="kg">Kilograms (Kg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Inward Date</label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Delivery Notes</label>
                <input
                  type="text"
                  value={inwardNote}
                  onChange={(e) => setInwardNote(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-2xl transition shadow-xs"
                >
                  Save Inward Refill
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProductForAdd(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-2xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
