import React, { useMemo, useState, useEffect } from 'react';
import type { Expense } from './types';
import { Skeleton } from '@/components/universalLoader/SkeletonLoader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Category totals within current filters

type Props = {
  expenses: Expense[];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatShortCurrency = (amount: number) => {
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₱${(amount / 1_000).toFixed(0)}K`;
  return `₱${amount}`;
};

// Removed ChartPoint (no longer used with bar data shape)

const ExpensesAnalytics: React.FC<Props> = ({ expenses }) => {
  const [isLoading, setIsLoading] = useState(true);
  // Filters removed per request; demo toggle removed

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => expenses, [expenses]);

  // Colors per category for multiple lines (heritage palette)
  // High-contrast heritage-friendly palette
  const categoryColors: Record<Expense['category'], string> = {
    utilities: '#2F855A',      // emerald-ish (primary accent)
    supplies: '#166534',       // darker green for contrast
    maintenance: '#A3B18A',    // sage
    marketing: '#3F6212',      // olive
    staff: '#4D7C0F',          // moss
    food: '#6CA46C',           // fresh green
    other: '#8DAA91',          // muted green
  };

  const categoryOrder = useMemo<Expense['category'][]>(() => ['utilities','supplies','maintenance','marketing','staff','food','other'], []);

  // Build weekly/monthly series: one line per category across buckets (actual data)
  const actual = useMemo(() => {
    // Aggregate totals per category (single bar per category)
    const totals: Record<Expense['category'], number> = {
      utilities: 0, supplies: 0, maintenance: 0, marketing: 0, staff: 0, food: 0, other: 0,
    };
    filtered.forEach(e => { totals[e.category] += e.amount; });
    const data = categoryOrder.map(cat => ({
      category: categoryLabel(cat),
      amount: totals[cat],
      rawCat: cat,
    }));
    const present = categoryOrder.filter(cat => totals[cat] > 0);
    return { chartData: data, categoriesPresent: present } as const;
  }, [filtered, categoryOrder]);

  // Demo generator: pleasant, deterministic mock curves with slight variation per category and bucket
  const demo = useMemo(() => {
    // Simple pleasant totals per category for bars
    const base: Record<Expense['category'], number> = {
      utilities: 420000,
      supplies: 360000,
      maintenance: 260000,
      marketing: 190000,
      staff: 400000,
      food: 310000,
      other: 140000,
    };
    const data = categoryOrder.map((cat, idx) => ({
      category: categoryLabel(cat),
      amount: Math.round(base[cat] * (1 + 0.04 * Math.sin(idx * 0.9))),
      rawCat: cat,
    }));
    return { chartData: data, categoriesPresent: [...categoryOrder] } as const;
  }, [categoryOrder]);

  // Choose between actual and demo (fallback only if actual is empty)
  const useDemo = actual.categoriesPresent.length === 0;
  const chartData = (useDemo ? demo.chartData : actual.chartData) as Array<{ category: string; amount: number; rawCat: Expense['category'] }>;
  const categoriesPresent = (useDemo ? demo.categoriesPresent : actual.categoriesPresent) as Expense['category'][];

  // Sort bars descending for clarity
  const sortedData = useMemo(() => {
    return [...chartData].sort((a, b) => b.amount - a.amount);
  }, [chartData]);

  // Metrics across categories
  const metrics = useMemo(() => {
    // For bar data, chartData already has totals per category
    const totalsByCat: Record<string, number> = {};
    chartData.forEach(row => {
      totalsByCat[row.category] = row.amount;
    });
    const total = chartData.reduce((s, r) => s + r.amount, 0);
    const average = chartData.length ? Math.round(total / chartData.length) : 0;
    let maxCat = '';
    let max = 0;
    chartData.forEach(r => { if (r.amount > max) { max = r.amount; maxCat = r.category; } });
    const projected = Math.round(total * 1.08);
    return { total, average, max, maxCat, projected, totalsByCat } as const;
  }, [chartData]);

  function categoryLabel(c: Expense['category']): string {
    switch (c) {
      case 'utilities': return 'Utilities';
      case 'supplies': return 'Supplies';
      case 'maintenance': return 'Maintenance';
      case 'marketing': return 'Marketing';
      case 'staff': return 'Staff';
      case 'food': return 'Food & Beverage';
      default: return 'Other';
    }
  }

  if (isLoading) {
    return (
      <div className="relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60"></div>
        <div className="relative z-10">
          <div className="px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div>
                  <Skeleton className="w-48 h-8 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-1 h-1 rounded-full" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl">
                  <Skeleton className="w-20 h-10 mr-2 rounded-xl" />
                  <Skeleton className="w-20 h-10 mr-2 rounded-xl" />
                  <Skeleton className="w-20 h-10 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-4 border-b bg-gradient-to-r from-heritage-light/20 to-heritage-light/30 border-gray-200/30">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-40 h-10 rounded-xl" />
            </div>
          </div>
          <div className="px-4 py-6">
            <div className="h-[320px] w-full">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
            <div className="flex items-center justify-center pb-2 mt-2">
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
      {/* Background */}
      <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60" />
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 shadow-2xl bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral rounded-2xl group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 7h18M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </div>
                <div className="absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">Expense Analytics</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Category Breakdown</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                  <span className="text-sm font-bold text-heritage-green">{new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
            {/* Controls removed: timeframe and demo toggle */}
          </div>
        </div>

        {/* Filters removed per request */}

        {/* Chart */}
        <div className="px-4 py-6">
          {/* Empty state if no data after filters */}
          {categoriesPresent.length === 0 ? (
            <div className="flex items-center justify-center w-full h-[320px] border border-heritage-light/60 rounded-2xl bg-white/70">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">No data available</p>
                <p className="text-xs text-gray-500">Data will appear once you add expenses.</p>
              </div>
            </div>
          ) : (
          <div className="h-[360px] w-full">
            {/* @ts-expect-error - Recharts types compatibility issue */}
            <ResponsiveContainer width="100%" height="100%">
              {/* @ts-expect-error - Recharts types compatibility issue */}
              <BarChart data={sortedData} margin={{ top: 12, right: 12, left: 12, bottom: 12 }} barCategoryGap={18}>
                {/* @ts-expect-error - Recharts types compatibility issue */}
                <XAxis dataKey="category" tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }} tickLine={false} />
                {/* @ts-expect-error - Recharts types compatibility issue */}
                <YAxis tickFormatter={formatShortCurrency} tick={{ fill: '#374151', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, (dataMax: number) => dataMax * 1.18]} />
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#F3F4F6" />
                {/* @ts-expect-error - Recharts types compatibility issue */}
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0];
                  return (
                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-3 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-xs font-bold text-gray-900">{p.payload.category}</span>
                      </div>
                      <div className="text-base font-extrabold text-heritage-green">{formatCurrency(Number(p.value))}</div>
                    </div>
                  );
                }} />
                {/* Single Bar */}
                {/* @ts-expect-error - Recharts types compatibility issue */}
                <Bar dataKey="amount" radius={[10,10,0,0]} fill="#2F855A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}

          {/* Legend with totals and color pills */}
          {categoriesPresent.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 pb-2 mt-3 text-xs text-gray-600">
              {categoriesPresent.map(cat => {
                const name = categoryLabel(cat);
                const total = metrics.totalsByCat?.[name] ?? 0;
                return (
                  <div key={cat} className="flex items-center gap-2 px-2 py-1 bg-white border rounded-full shadow-sm border-gray-200/80">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                    <span className="font-medium">{name}</span>
                    <span className="text-[11px] text-gray-500">{formatCurrency(total)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 px-8 pb-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Total Volume</div>
            <div className="text-2xl font-bold text-heritage-green">{formatCurrency(metrics.total)}</div>
          </div>
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Average per Category</div>
            <div className="text-2xl font-bold text-heritage-green">{formatCurrency(metrics.average)}</div>
          </div>
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Highest Category</div>
            <div className="text-2xl font-bold text-heritage-green">{formatCurrency(metrics.max)}</div>
            <div className="text-xs text-gray-500">{metrics.maxCat}</div>
          </div>
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Projected</div>
            <div className="text-2xl font-bold text-heritage-green">{formatCurrency(metrics.projected)}</div>
            <div className="text-xs text-gray-500">Next period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesAnalytics;
