import React, { useState } from 'react';
import {
  Boxes,
  Layers,
  AlertTriangle,
  TrendingUp,
  Search,
  Plus,
  ArrowUpDown,
  Tag,
  Scale,
  PackageCheck,
  ShoppingCart
} from 'lucide-react';
import { ProductGroup, ProductSubGroup, CatalogItem } from '../types';
import { formatBDT } from '../utils/financial';

interface ProductCatalogProps {
  groups: ProductGroup[];
  subGroups: ProductSubGroup[];
  items: CatalogItem[];
  onCreateRequisition?: (item: CatalogItem) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  groups,
  subGroups,
  items,
  onCreateRequisition
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [prTriggered, setPrTriggered] = useState<string | null>(null);

  const filteredItems = items.filter((it) => {
    const matchesGroup = selectedGroup === 'ALL' || it.groupId === selectedGroup;
    const matchesSearch =
      it.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.brand_grade_spec.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleQuickPR = (item: CatalogItem) => {
    if (onCreateRequisition) onCreateRequisition(item);
    setPrTriggered(`Automated Site Purchase Requisition (PR) created for ${item.item_name}. Transferred to Procurement Officer.`);
    setTimeout(() => setPrTriggered(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 07
              </span>
              <h1 className="text-xl font-bold text-slate-900">Product Catalog & Grouping Hierarchy</h1>
            </div>
            <p className="text-xs text-slate-500">
              Multi-tier categorization (Group → Sub-Group → Item), SKU specifications, safety stock reorder thresholds, and regional Dhaka/Chittagong market matrices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
              {items.filter(i => i.current_stock <= i.reorder_point).length} Reorder Threshold Alerts
            </span>
          </div>
        </div>

        {/* Group Selector Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedGroup('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                selectedGroup === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Materials ({items.length})
            </button>
            {groups.map((grp) => (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                  selectedGroup === grp.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grp.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU, brand, grade..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-60 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {prTriggered && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-lg border border-emerald-500/50 text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{prTriggered}</span>
          <span className="text-[10px] font-mono text-emerald-300">PR Dispatched</span>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold tracking-wide uppercase">Material Master Specifications & Price Matrix</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Real-time Regional Pricing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">SKU & Item Name</th>
                <th className="px-3 py-3">Brand & Specification</th>
                <th className="px-3 py-3 text-center">UOM</th>
                <th className="px-3 py-3 text-right">Standard Rate</th>
                <th className="px-3 py-3 text-right">Avg Dhaka Market</th>
                <th className="px-3 py-3 text-right">Avg CTG Market</th>
                <th className="px-3 py-3 text-center">Safety / Reorder Point</th>
                <th className="px-3 py-3 text-right">Current Stock</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLowStock = item.current_stock <= item.reorder_point;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mr-2">
                        {item.sku}
                      </span>
                      <strong className="text-slate-900">{item.item_name}</strong>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 font-medium">{item.brand_grade_spec}</td>
                    <td className="px-3 py-3.5 text-center font-bold text-slate-800">{item.primary_uom}</td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-900">
                      {formatBDT(item.standard_purchase_rate_bdt)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-slate-600">
                      ৳ {item.avg_market_price_dhaka_bdt.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-slate-600">
                      ৳ {item.avg_market_price_ctg_bdt.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-[11px]">
                      {item.safety_stock_level} / <strong className="text-amber-700">{item.reorder_point}</strong>
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        isLowStock ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-slate-900'
                      }`}>
                        {item.current_stock.toLocaleString()} {item.primary_uom}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {isLowStock ? (
                        <button
                          onClick={() => handleQuickPR(item)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1 rounded flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>1-Click PR</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">Stock Normal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
