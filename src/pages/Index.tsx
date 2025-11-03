import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
    DollarSign, TrendingUp, Wallet, ShoppingCart, Target, Sun, Moon,
    ArrowUp, ArrowDown, PieChart as PieChartIcon, BrainCircuit, Instagram,
    Facebook, Twitter, Youtube, Linkedin, Hash, Users, CheckCircle,
    Building, AlertTriangle, Package,
    Briefcase,
    Smile,
    Newspaper,
    Share2,
    Award,
    
    LineChart as LineChartIconLucide, // Rename agar tidak bentrok
    ChevronLeft, ChevronRight // Icon untuk slider
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

import {
 dashboardData,
 divisionalProcurementData,
 procurementStatusData,
 savingsData,
 departmentBudgetData
} from '../data';

// --- SVG Icons ---
const Loader2 = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>);

// --- Utility & Constants ---
const AUTO_SLIDE_INTERVAL = 15000;
const DEPARTMENTS_PER_SLIDE = 5;

// Helper function to format a Date object
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Helper function to calculate time ago
const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " thn lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bln lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hr lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mnt lalu";
    return "Baru saja";
};


// -- Helper Function untuk Format Mata Uang --
const formatCurrency = (value) => {
  if (typeof value !== 'number') return value;

  // Format angka dengan koma ribuan & 2 desimal
  const format = (num) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (value >= 1e9) {
    // Miliar (M)
    return format(value / 1e9) + "M";
  }
  if (value >= 1e6) {
    // Juta (Jt)
    return format(value / 1e6) + "Jt";
  }
  if (value >= 1e3) {
    // Ribu (K)
    return format(value / 1e3) + "K";
  }

  return format(value);
};




const BudgetSummaryCharts = ({ isLight, budgetTotals }) => {
    
    // Data 1: Penyerapan Total
    const absorptionPercent = budgetTotals.penyerapan.persentase; 
    const remainingPercent = 100 - absorptionPercent;
    const data1 = [
        { name: 'Absorbed', value: absorptionPercent },
        { name: 'Remaining', value: remainingPercent },
    ];
    const COLORS1 = ['#D3242B', isLight ? '#e5e7eb' : '#374151'];

    // Data 2: Komposisi Anggaran (CAPEX vs OPEX)
    const capex = budgetTotals.realokasi_2025.capex;
    const opex = budgetTotals.realokasi_2025.opex;
    const total = capex + opex; 
    const capexPercent = total > 0 ? (capex / total) * 100 : 0;
    const opexPercent = total > 0 ? (opex / total) * 100 : 0;
    
    const data2 = [
      { name: 'CAPEX', value: capex },
      { name: 'OPEX', value: opex },
    ];
    const COLORS2 = ['#3b82f6', '#14b8a6']; 
 
    return (
      <div className={`rounded-lg p-3 flex flex-col h-56 transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
        <h2 className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${isLight ? 'text-[#D3242B] border-slate-200' : 'text-[#F6821F] border-slate-800'}`}>
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Rasio Penyerapan & Tipe Anggaran</span>
        </h2>
        <div className="h-full w-full flex flex-col justify-around">
            <div className="flex items-center">
                <div className="w-1/2 h-20">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={data1} dataKey="value" innerRadius={20} outerRadius={30} paddingAngle={5}>
                        {data1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
                </div>
                <div className="w-1/2 text-xs">
                <p className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Total Penyerapan</p>
                <p className={`font-bold text-lg text-[#D3242B]`}>{absorptionPercent.toFixed(2)}%</p>
                <p className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sisa: {remainingPercent.toFixed(2)}%</p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="w-1/2 h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={data2} dataKey="value" innerRadius={20} outerRadius={30} paddingAngle={5}>
                        {data2.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
                </div>
                <div className="w-1/2 text-xs space-y-0.5">
                    <p className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Tipe Anggaran (Realokasi)</p>
                    <p className={`flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span className="w-4 h-4 rounded-full bg-[#14b8a6]"></span>
                        <p className={`font-bold text-lg text-[#14b8a6]`}>{opexPercent.toFixed(1)}% OPEX</p>
                    </p>
                    <p className={`flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span className="w-4 h-4 rounded-full bg-[#3b82f6]"></span>
                        <p className={`font-bold text-lg text-[#3b82f6]`}>{capexPercent.toFixed(1)}% CAPEX</p>
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
};

const InteractiveProcurementChart = ({ isLight, totalData, divisionalData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const textColor = isLight ? '#475569' : '#94a3b8';

    // Helper untuk memformat nama bulan
    const shortenMonth = (nama) => nama.substring(0, 3).charAt(0).toUpperCase() + nama.substring(1, 3).toLowerCase();

    // Gabungkan semua data (Total + Divisi) untuk slider
    const allChartData = useMemo(() => {
        // 1. Format data Total (Slide 0)
        const totalView = {
            divisi: "Total Keseluruhan",
            data: totalData.map(month => ({
                bulan: month.bulan, 
                hps: month.HPS,
                komitmen_po: month.Komitmen_PO,
                pr: month.PR
            }))
        };

        // 2. Format data Divisi (Slide 1 ... N)
        const divisionalViews = divisionalData.data.map(div => ({
            divisi: div.divisi,
            data: div.bulan.map(month => ({
                bulan: shortenMonth(month.nama), 
                hps: month.hps,
                komitmen_po: month.komitmen_po,
                pr: month.pr
            }))
        }));

        return [totalView, ...divisionalViews];
    }, [totalData, divisionalData]);

    
    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % allChartData.length);
    }, [allChartData.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + allChartData.length) % allChartData.length);
    }, [allChartData.length]);
    
    useEffect(() => {
        
        const sliderInterval = setInterval(() => {
            handleNext();
        }, AUTO_SLIDE_INTERVAL); 

        return () => {
            clearInterval(sliderInterval);
        };
    }, [currentIndex, handleNext]);

    const currentView = allChartData[currentIndex];

    return (
        <div className={`rounded-lg p-3 h-full flex flex-col transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            
            <header className={`flex justify-between items-center text-xs font-bold uppercase border-b pb-1 mb-2 flex-shrink-0 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className={`flex items-center gap-1.5 ${isLight ? 'text-[#D3242B]' : 'text-[#F6821F]'}`}>
                    <LineChartIconLucide className="w-3.5 h-3.5" />
                    <span>Procurement Bulanan</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handlePrev} 
                        className={`p-1 rounded-md ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
                        aria-label="Previous Division"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className={`text-center font-bold px-2 ${isLight ? 'text-slate-700' : 'text-slate-200'}`} style={{minWidth: '200px'}}>
                        {currentView.divisi}
                    </span>
                    <button 
                        onClick={handleNext} 
                        className={`p-1 rounded-md ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
                        aria-label="Next Division"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Chart Area */}
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentView.data} margin={{ top: 5, right: -30, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="bulan" fontSize={10} tick={{ fill: textColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
                        <YAxis 
                            yAxisId="left" 
                            fontSize={10} 
                            tickFormatter={formatCurrency} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }} 
                            tickLine={{ stroke: gridColor }} 
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            fontSize={10} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }} 
                            tickLine={{ stroke: gridColor }} 
                        />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'PR') {
                                    return [value, 'PR (Count)'];
                                }
                                const label = name === 'komitmen_po' ? 'PO' : name;
                                return [formatCurrency(value), label];
                            }}
                            contentStyle={{ backgroundColor: isLight ? 'white' : '#0f172a', border: `1px solid ${gridColor}`, borderRadius: '6px', fontSize: '12px' }}
                            labelStyle={{ color: textColor }}
                        />
                        <Legend 
                            iconType="circle" 
                            iconSize={8} 
                            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} 
                            formatter={(value, entry) => {
                                if (value === 'komitmen_po') return 'PO';
                                if (value === 'hps') return 'HPS';
                                if (value === 'pr') return 'PR';
                                return value;
                            }}
                        />
                        <Line yAxisId="left" type="monotone" dataKey="hps" name="HPS" stroke="#D3242B" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line yAxisId="left" type="monotone" dataKey="komitmen_po" name="komitmen_po" stroke="#F6821F" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="pr" 
                            name="PR" 
                            stroke="#22c55e"
                            strokeWidth={2} 
                            dot={false} 
                            activeDot={{ r: 4 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const SavingsValueChart = ({ isLight, chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <NoDataCard
        isLight={isLight}
        title="Analisis Penghematan (Nilai)"
        icon={Award}
        message="Data bulanan tidak tersedia"
      />
    );
  }

  const gridColor = isLight ? "#e2e8f0" : "#334155";
  const textColor = isLight ? "#475569" : "#94a3b8";

  const monthMap = {
    Januari: "Jan",
    Februari: "Feb",
    Maret: "Mar",
    April: "Apr",
    Mei: "Mei",
    Juni: "Jun",
    Juli: "Jul",
    Agustus: "Ags",
    September: "Sep",
    Oktober: "Okt",
    November: "Nov",
    Desember: "Des",
  };

  const formattedData = chartData.map((item) => ({
    ...item,
    Bulan: monthMap[item.Bulan] || item.Bulan,
  }));

  return (
    <div
      className={`rounded-lg p-3 h-full flex flex-col ${
        isLight
          ? "bg-white border border-slate-200 shadow-sm"
          : "bg-slate-900 border border-slate-800"
      }`}
    >
      <h2
        className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${
          isLight
            ? "text-[#D3242B] border-slate-200"
            : "text-[#F6821F] border-slate-800"
        }`}
      >
        <Award className="w-3.5 h-3.5" />
        Analisis Penghematan (Nilai)
      </h2>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="Bulan"
              fontSize={10}
              tick={{ fill: textColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              fontSize={10}
              tick={{ fill: textColor }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => formatCurrency(v)}
              contentStyle={{
                backgroundColor: isLight ? "white" : "#0f172a",
                border: `1px solid ${gridColor}`,
                borderRadius: "6px",
                fontSize: "12px",
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
            />
            <Bar dataKey="HPS" fill="#3b82f6" name="HPS" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Aktual" fill="#14b8a6" name="Aktual" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="Selisih_HPS"
              fill="#f97316"
              name="Selisih HPS"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const SavingsPercentageChart = ({ isLight, chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <NoDataCard
        isLight={isLight}
        title="Analisis Penghematan (%)"
        icon={TrendingUp}
        message="Data bulanan tidak tersedia"
      />
    );
  }

  const gridColor = isLight ? '#e2e8f0' : '#334155';
  const textColor = isLight ? '#475569' : '#94a3b8';

  const monthMap = {
    Januari: "Jan",
    Februari: "Feb",
    Maret: "Mar",
    April: "Apr",
    Mei: "Mei",
    Juni: "Jun",
    Juli: "Jul",
    Agustus: "Ags",
    September: "Sep",
    Oktober: "Okt",
    November: "Nov",
    Desember: "Des",
  };

  const formattedData = chartData.map((item) => ({
    ...item,
    Bulan: monthMap[item.Bulan] || item.Bulan,
  }));

  return (
    <div
      className={`rounded-lg p-3 h-full flex flex-col ${
        isLight
          ? 'bg-white border border-slate-200 shadow-sm'
          : 'bg-slate-900 border border-slate-800'
      }`}
    >
      <h2
        className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${
          isLight
            ? 'text-[#D3242B] border-slate-200'
            : 'text-[#F6821F] border-slate-800'
        }`}
      >
        <TrendingUp className="w-3.5 h-3.5" />
        Analisis Penghematan (%)
      </h2>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="Bulan"
              fontSize={10}
              tick={{ fill: textColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              unit="%"
              fontSize={10}
              tick={{ fill: textColor }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => `${v}%`}
              contentStyle={{
                backgroundColor: isLight ? 'white' : '#0f172a',
                border: `1px solid ${gridColor}`,
                borderRadius: '6px',
                fontSize: '12px',
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
            />
            <Line
              type="monotone"
              dataKey="Persen_Saving_HPS_vs_Aktual"
              stroke="#ef4444"
              name="% HPS vs Aktual"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Persen_Saving_Penawaran"
              stroke="#10b981"
              name="% Saving Penawaran"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export const SavingsSlider = ({ isLight, data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['savings_value_chart', 'savings_percent_chart'];
  const totalSlides = slides.length;
  const AUTO_SLIDE_INTERVAL = 15000;

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .filter(item => item.Bulan && item.No && !item.Bulan.includes('Total'))
      .map(item => ({
        ...item,
        Persen_Saving_HPS_vs_Aktual: parseFloat(item.Persen_Saving_HPS_vs_Aktual) || 0,
        Persen_Saving_Penawaran: parseFloat(item.Persen_Saving_Penawaran) || 0,
      }));
  }, [data]);

  const handleNext = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const sliderInterval = setInterval(handleNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(sliderInterval);
  }, [handleNext]);

  let content;
  switch (slides[currentSlide]) {
    case 'savings_value_chart':
      content = <SavingsValueChart isLight={isLight} chartData={chartData} />;
      break;
    case 'savings_percent_chart':
      content = <SavingsPercentageChart isLight={isLight} chartData={chartData} />;
      break;
    default:
      content = null;
  }

  return (
    <div className="h-full min-h-[350px] lg:min-h-0 transition-all duration-300">
      {content}
    </div>
  );
};


const OnProgressKpis = ({ isLight, onProgressTotals }) => {
    const { ongoing_request, on_proses_pengadaan } = onProgressTotals;
    const kpis = [
        { title: "PR On Progress", value: ongoing_request, icon: Briefcase, color: isLight ? 'text-slate-900' : 'text-white' },
        { title: "Nilai On Progress", value: formatCurrency(on_proses_pengadaan * 1_000_000_000), icon: Package, color: isLight ? 'text-slate-900' : 'text-white' },
    ];

    return (
        <div className={`grid grid-cols-2 gap-2 mb-2 flex-shrink-0 rounded-lg p-2 transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            {kpis.map((kpi, index) => (
                <div 
                    key={kpi.title} 
                    className={`text-center p-1.5 ${index > 0 ? 'border-l' : ''}`} 
                    style={{ borderColor: isLight ? '#e2e8f0' : '#334155' }}
                >
                    <div className={`text-[11px] font-bold uppercase mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{kpi.title}</div>
                    <div className={`text-lg font-bold flex items-center justify-center gap-1.5 ${kpi.color}`}>
                        <kpi.icon className="h-4 w-4" />
                        {kpi.value}
                    </div>
                </div>
            ))}
        </div>
    );
};

const OnProgressPO = ({ isLight, onProgressTotals }) => {
    const { ongoing_request, on_proses_pengadaan } = onProgressTotals;
    const kpis = [
        { title: "Total PO", value: 277, icon: Briefcase, color: isLight ? 'text-slate-900' : 'text-white' },
        { 
            title: "Nilai Komitmen PO", 
            value: formatCurrency(167.68 * 1_000_000_000),
            icon: Package, 
            color: isLight ? 'text-slate-900' : 'text-white' 
        },
    ];

    return (
        <div className={`grid grid-cols-2 gap-2 mb-2 flex-shrink-0 rounded-lg p-2 transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            {kpis.map((kpi, index) => (
                <div 
                    key={kpi.title} 
                    className={`text-center p-1.5 ${index > 0 ? 'border-l' : ''}`} 
                    style={{ borderColor: isLight ? '#e2e8f0' : '#334155' }}
                >
                    <div className={`text-[11px] font-bold uppercase mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{kpi.title}</div>
                    <div className={`text-lg font-bold flex items-center justify-center gap-1.5 ${kpi.color}`}>
                        <kpi.icon className="h-4 w-4" />
                        {kpi.value}
                    </div>
                </div>
            ))}
        </div>
    );
};


const ProcurementStatusChart = ({ isLight, data }) => {
    const chartData = data.divisi.filter(
        d => d.ongoing_request > 0 || d.on_proses_pengadaan > 0
    ).map(d => ({ 
        ...d,
        label: `${d.kode} - ${d.nama}`
    }));

    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const textColor = isLight ? '#475569' : '#94a3b8';

    return (
        <div className={`rounded-lg p-3 flex flex-col flex-1 h-full transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            <h2 className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${isLight ? 'text-[#D3242B] border-slate-200' : 'text-[#F6821F] border-slate-800'}`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Laporan Pengadaan 2025 - On Process</span>
            </h2>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -20, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis 
                            dataKey="kode"
                            fontSize={9} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }} 
                            tickLine={{ stroke: gridColor }} 
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                        />
                        <YAxis 
                            yAxisId="left"
                            orientation="left"
                            fontSize={10} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }} 
                            tickLine={{ stroke: gridColor }} 
                            label={{ value: 'Count (Ongoing)', angle: -90, position: 'insideLeft', fill: textColor, fontSize: 10, dx: -10 }}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            fontSize={10} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }} 
                            tickLine={{ stroke: gridColor }} 
                            tickFormatter={(value) => `${value}B`}
                            label={{ value: 'Value (Miliar)', angle: 90, position: 'insideRight', fill: textColor, fontSize: 10, dx: 10 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: isLight ? 'white' : '#0f172a', border: `1px solid ${gridColor}`, borderRadius: '6px', fontSize: '12px' }}
                            labelStyle={{ color: textColor }}
                            formatter={(value, name, props) => {
                                const { payload } = props;
                                if (name === 'on_proses_pengadaan') {
                                    return [`${value}B`, `On Proses (Miliar)`]; 
                                }
                                return [value, `Ongoing (Count)`];
                            }}
                             labelFormatter={(label) => {
                                 const item = chartData.find(d => d.kode === label);
                                 return item ? item.label : label;
                            }}
                        />
                        <Legend 
                            iconType="circle" 
                            iconSize={8} 
                            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} 
                            formatter={(value) => {
                                if (value === 'ongoing_request') return 'Ongoing (Count)';
                                if (value === 'on_proses_pengadaan') return 'On Proses (Miliar)';
                                return value;
                            }}
                        />
                        <Bar yAxisId="left" dataKey="ongoing_request" name="ongoing_request" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="on_proses_pengadaan" name="on_proses_pengadaan" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
interface NoDataCardProps {
 isLight: boolean;
 title: string;
 icon?: React.ElementType;
 message: string;
}

const NoDataCard = memo(({ isLight, title, icon: Icon, message }: NoDataCardProps) => (
    <div className={`rounded-lg p-3 flex flex-col flex-1 h-full transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
        <h2 className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${isLight ? 'text-[#D3242B] border-slate-200' : 'text-[#F6821F] border-slate-800'}`}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{title}</span>
        </h2>
        <div className="flex-1 min-h-0 flex items-center justify-center">
            <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {message}
            </p>
        </div>
    </div>
));

const DepartmentBudgetPerformanceChart = ({ isLight, data }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const textColor = isLight ? '#475569' : '#94a3b8';

    // 1. Siapkan semua data departemen
    const allChartData = useMemo(() => {
        return data
            .map(item => ({
                ...item,
                label: `${item.departemen}`,
                penyerapan_total: item.penyerapan.total,
                anggaran_awal: item.anggaran_2025.total,
                anggaran_realokasi: item.realokasi_2025.total,
            }))
            .sort((a, b) => b.anggaran_realokasi - a.anggaran_realokasi); 
    }, [data]);

    // 2. Hitung jumlah halaman
    const totalPages = Math.ceil(allChartData.length / DEPARTMENTS_PER_SLIDE);

    // 3. Data untuk halaman saat ini
    const currentChartData = allChartData.slice(
        currentPage * DEPARTMENTS_PER_SLIDE,
        (currentPage + 1) * DEPARTMENTS_PER_SLIDE
    );
    
    // 4. Navigasi slider (dibungkus useCallback)
    const handleNext = useCallback(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    }, [totalPages]);

    const handlePrev = useCallback(() => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }, [totalPages]);

    // 5. Efek auto-slide
    useEffect(() => {
        const sliderInterval = setInterval(handleNext, AUTO_SLIDE_INTERVAL);
        return () => clearInterval(sliderInterval);
    }, [currentPage, handleNext]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = currentChartData.find(d => d.label === label);
            if (!data) return null;

            return (
                <div className={`p-2 rounded-md shadow-lg ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                    <p className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{data.label}</p>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span className="font-semibold">Anggaran Awal:</span> {formatCurrency(data.anggaran_awal)}
                    </p>
                    <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="font-semibold">Anggaran Realokasi:</span> {formatCurrency(data.anggaran_realokasi)}
                    </p>
                    <p className="text-xs text-[#D3242B]">
                        <span className="font-semibold">Penyerapan:</span> {formatCurrency(data.penyerapan_total)} ({data.penyerapan.persentase.toFixed(1)}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`rounded-lg p-3 h-full flex flex-col transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            
            <header className={`flex justify-between items-center text-xs font-bold uppercase border-b pb-1 mb-2 flex-shrink-0 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className={`flex items-center gap-1.5 ${isLight ? 'text-[#D3242B]' : 'text-[#F6821F]'}`}>
                    <Users className="w-3.5 h-3.5" />
                    <span>Kinerja Anggaran Departemen</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handlePrev} 
                        className={`p-1 rounded-md ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className={`text-center font-bold px-2 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                        Halaman {currentPage + 1} / {totalPages}
                    </span>
                    <button 
                        onClick={handleNext} 
                        className={`p-1 rounded-md ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
                        aria-label="Next Page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Chart Area */}
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={currentChartData}
                        margin={{ top: 1, right: 10, left: -40, bottom: 10 }}
                        barGap={5}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis 
                            type="number"
                            fontSize={10}
                            tickFormatter={formatCurrency}
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }}
                        />
                        <YAxis 
                            type="category"
                            dataKey="label"
                            fontSize={9}
                            width={180} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }}
                            interval={0}
                            tickFormatter={(value) => value.length > 30 ? value.substring(0, 30) + '...' : value}
                        />
                        <Tooltip content={CustomTooltip} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        
                        <Bar dataKey="anggaran_awal" name="Anggaran Awal" fill={isLight ? '#cbd5e1' : '#475569'} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="anggaran_realokasi" name="Anggaran Realokasi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="penyerapan_total" name="Penyerapan" fill="#D3242B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const SavingsKpis = ({ isLight, savingsData }) => {
    const yearlyData = savingsData.Yearly_Total;
    const q4DataObj = savingsData.data.find(d => d.Total_Q4);
    const q4Data = q4DataObj ? q4DataObj.Total_Q4 : null;

    if (!yearlyData || !q4Data) return null;

    const kpis = [
        { title: "Total Saving Nego (YTD)", value: formatCurrency(yearlyData.Selisih_Nego_BAKN), icon: Award, color: 'text-emerald-500' },
        { title: "% Saving Penawaran (Q4)", value: q4Data.Persen_Saving_Penawaran, icon: TrendingUp, color: 'text-emerald-500' }, 
    ];

    return (
        <div className={`grid grid-cols-2 gap-2 mb-2 flex-shrink-0 rounded-lg p-2 transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            {kpis.map((kpi, index) => (
                <div 
                    key={kpi.title} 
                    className={`text-center p-1.5 ${index > 0 ? 'border-l' : ''}`} 
                    style={{ borderColor: isLight ? '#e2e8f0' : '#334155' }}
                >
                    <div className={`text-[11px] font-bold uppercase mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{kpi.title}</div>
                    <div className={`text-lg font-bold flex items-center justify-center gap-1.5 ${kpi.color}`}>
                        <kpi.icon className="h-4 w-4" />
                        {kpi.value}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Main Dashboard Component ---
const FinanceDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [theme, setTheme] = useState('light');
    const { total: budgetTotals } = departmentBudgetData; 
    const { total: onProgressTotals } = procurementStatusData.pengadaan_status;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    const isLight = theme === 'light';
    const kpiProposal = 359976877015;
    const kpiRealokasi = 350849141975;
    const kpiRealisasi = 198275365353;
    const kpiPersenPenyerapan = 55.08;
    const kpiSisaAnggaran = 152135658170;
    const capexData = 2713132806;
    const OpexVerif = 133308067526;
    const OpexPPA = 62254165021; 

    const topKpis = [
        { title: "Proposal", value: formatCurrency(kpiProposal), icon: Briefcase, color: isLight ? 'text-slate-900' : 'text-white' },
        { title: "Realokasi", value: formatCurrency(kpiRealokasi), icon: Package, color: isLight ? 'text-slate-900' : 'text-white' },
        { title: "% Penyerapan", value: `${kpiPersenPenyerapan}%`, icon: Package, color: 'text-emerald-500' },
        { title: "Sisa Anggaran", value: formatCurrency(kpiSisaAnggaran), icon: Wallet, color: 'text-[#F6821F]' },
    ];

    const rightKPI = [
        { title: "Realisasi", value: formatCurrency(kpiRealisasi), icon: Wallet, color: 'text-slate-900' }, 
        { title: "Capex", value: formatCurrency(capexData), icon: Wallet, color: isLight ? 'text-slate-900' : 'text-white' },
        { title: "Verifikasi", value: formatCurrency(OpexVerif), icon: Wallet, color: isLight ? 'text-slate-900' : 'text-white' },
        { title: "PPA / SPUK / KK", value: formatCurrency(OpexPPA), icon: Wallet, color: isLight ? 'text-slate-900' : 'text-white' },     
    ]

    const { realokasi_2025: capexOpexData } = departmentBudgetData.total;
    
    const budgetTotalsForPieChart = {
        penyerapan: {
            total: kpiRealisasi,
            persentase: kpiPersenPenyerapan
        },
        sisa_anggaran: {
            total: kpiSisaAnggaran
        },
        realokasi_2025: {
            total: kpiRealokasi,
            capex: capexOpexData.capex, 
            opex: capexOpexData.opex
        }
    };

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap'); .font-jakarta-sans { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>
            <div className={`min-h-screen lg:h-screen lg:overflow-hidden p-3 flex flex-col font-jakarta-sans transition-colors duration-300 ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-200'}`}>
                
                {/* Header */}
                <header className="mb-2 flex flex-col md:flex-row justify-between items-center p-3 rounded-lg bg-gradient-to-r from-[#D3242B] to-[#F6821F] flex-shrink-0 shadow-lg">
                    <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-2 md:gap-4">
                        <img src="https://e-ptw.lrtjakarta.co.id/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-lrtj-white.847caf54.png&w=640&q=75" alt="LRT Jakarta Logo" className="h-10" />
                        <div>
                            <h1 className="text-xl font-bold tracking-wide text-white">Dashboard Penyerapan Anggaran</h1>
                            <p className="text-xs font-semibold text-white/80">Real-Time Dashboard | LRT Jakarta</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 md:mt-0">
                        <div className="text-right">
                            <div className="text-xl font-bold text-white">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="text-white/80 text-xs">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">{isLight ? <Moon size={20} /> : <Sun size={20} />}</button>
                    </div>
                </header>

                {/* Top KPI Bar */}
                <section className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mb-2 flex-shrink-0 rounded-lg p-1 transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
                    {topKpis.map((kpi, index) => (
                        <div 
                            key={kpi.title} 
                            className={`text-center p-1.5 ${index > 0 ? 'border-l' : ''}`} 
                            style={{ borderColor: isLight ? '#e2e8f0' : '#334155' }}
                        >
                            <div className={`text-[11px] font-bold uppercase mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{kpi.title}</div>
                            <div className={`text-xl font-bold flex items-center justify-center gap-1.5 ${kpi.color}`}>
                                <kpi.icon className="h-4 w-4" />
                                {kpi.value}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Main Content Area */}
                <main className="flex-1 min-h-0 flex flex-col gap-2">
                    {/* --- LAYOUT BARU --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 flex-1 min-h-0">
                        
                        {/* Left Column (lg:col-span-3) - (Kolom Status) */}
                        <div className="lg:col-span-3 flex flex-col gap-2 min-h-0">
                    
                            <BudgetSummaryCharts isLight={isLight} budgetTotals={budgetTotalsForPieChart} />
                        
                            <SavingsKpis isLight={isLight} savingsData={savingsData} />
                            <OnProgressKpis isLight={isLight} onProgressTotals={onProgressTotals} />
                            <OnProgressPO isLight={isLight} onProgressTotals={onProgressTotals} />
                            <div className="flex-1 min-h-[300px] lg:min-h-0">
                                <ProcurementStatusChart isLight={isLight} data={procurementStatusData.pengadaan_status} />
                            </div>
                        </div>

                        <div className="lg:col-span-9 flex flex-col gap-2 min-h-0">
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0">
                                <div className="h-full min-h-[300px] lg:min-h-0 lg:col-span-9">
                                    <InteractiveProcurementChart 
                                        isLight={isLight} 
                                        totalData={dashboardData.data_per_bulan}
                                        divisionalData={divisionalProcurementData}
                                    />
                                </div>
                                <div className="h-full min-h-[300px] lg:min-h-0 lg:col-span-3">
                                    <div className={`flex flex-col gap-3 rounded-2xl p-4 transition-all duration-300 ${
                                            isLight
                                            ? "bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-md"
                                            : "bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 hover:shadow-lg"
                                        }`}
                                        >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-1">
                                            <h2 className={`text-base font-semibold tracking-wide ${
                                                isLight ? "text-slate-700" : "text-slate-200"
                                            }`} >
                                            Realisasi
                                            </h2>
                                        </div>

                                        {/* KPI Cards */}
                                        <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                                            {rightKPI.map((kpi) => (
                                            <div
                                                key={kpi.title}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 border ${
                                                isLight
                                                    ? "bg-white border-slate-200 hover:bg-slate-100"
                                                    : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                                                }`}
                                            >
                                                <div
                                                className={`flex items-center justify-center p-2 rounded-full ${
                                                    isLight ? "bg-slate-200/80" : "bg-slate-700"
                                                }`}
                                                >
                                                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                                                </div>
                                                <div className="flex flex-col">
                                                <span
                                                    className={`text-[12px] uppercase font-semibold tracking-wide ${
                                                    isLight ? "text-slate-500" : "text-slate-400"
                                                    }`}
                                                >
                                                    {kpi.title}
                                                </span>
                                                <span
                                                    className={`text-base font-bold leading-tight ${kpi.color}`}
                                                >
                                                    {kpi.value}
                                                </span>
                                                </div>
                                            </div>
                                            ))}
                                        </section>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0">
                                <div className="h-full min-h-[300px] lg:min-h-0 lg:col-span-7">
                                   <DepartmentBudgetPerformanceChart 
                                     isLight={isLight} 
                                     data={departmentBudgetData.departments} 
                                   />
                                </div>
                                <div className="h-full min-h-[300px] lg:min-h-0 lg:col-span-5">
                                    <SavingsSlider isLight={isLight} data={savingsData.data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default FinanceDashboard;