import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    DollarSign, TrendingUp, Wallet, ShoppingCart, Target, Sun, Moon,
    ArrowUp, ArrowDown, PieChart as PieChartIcon, BrainCircuit, Instagram,
    Facebook, Twitter, Youtube, Linkedin, Hash, Users, CheckCircle,
    Building, AlertTriangle, Package,
    // --- Icon Tambahan untuk Judul Card ---
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

// --- SVG Icons ---
const Loader2 = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>);


// --- Utility & Constants ---
const AUTO_SLIDE_INTERVAL = 15000; // 15 detik (dari user)
const DEPARTMENTS_PER_SLIDE = 5; // 7 departemen (dari user)

// Helper function to format a Date object into 'YYYY-MM-DD' string format.
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

// -- Data Finansial dari Dashboard Sebelumnya (TOTAL) --
const dashboardData = {
  data_per_bulan: [
    { bulan: "Jan", HPS: 5.67e9, Komitmen_PO: 5.57e9, PR: 5 },
    { bulan: "Feb", HPS: 4.61e9, Komitmen_PO: 4.11e9, PR: 11 },
    { bulan: "Mar", HPS: 8.10e9, Komitmen_PO: 6.61e9, PR: 17 },
    { bulan: "Apr", HPS: 12.68e9, Komitmen_PO: 12.45e9, PR: 19 },
    { bulan: "Mei", HPS: 7.30e9, Komitmen_PO: 7.01e9, PR: 25 },
    { bulan: "Jun", HPS: 12.56e9, Komitmen_PO: 11.64e9, PR: 23 },
    { bulan: "Jul", HPS: 36.10e9, Komitmen_PO: 33.89e9, PR: 37 },
    { bulan: "Ags", HPS: 38.68e9, Komitmen_PO: 36.63e9, PR: 31 },
    { bulan: "Sep", HPS: 36.61e9, Komitmen_PO: 28.80e9, PR: 63 },
    { bulan: "Okt", HPS: 25.07e9, Komitmen_PO: 20.91e9, PR: 46 },
    // Data Nov & Des tidak ada di total asli, tambahkan agar konsisten 12 bulan
    { bulan: "Nov", HPS: 0, Komitmen_PO: 0, PR: 0 },
    { bulan: "Des", HPS: 0, Komitmen_PO: 0, PR: 0 },
  ],
  total: {
    HPS: 199211853807,
    Komitmen_PO: 177076141739,
  },
  selisih_HPS_dan_Komitmen: 22135712068,
  static_kpis: {
    totalBudget: 214.9e9,
    absorption: 0.683, // 68.3%
    absorbed: 146.8e9,
    remaining: 68.1e9,
  }
};

// --- DATA BARU PER DIVISI (DARI USER) ---
const divisionalProcurementData = {
  "data": [
    {
      "divisi": "Sekretaris Perusahaan (SPR)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 534835000, "komitmen_po": 521189622, "pr": 2},
        {"nama": "FEBRUARI", "hps": 481218450, "komitmen_po": 432489300, "pr": 3},
        {"nama": "MARET", "hps": 379119392, "komitmen_po": 358869392, "pr": 2},
        {"nama": "APRIL", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MEI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JUNI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JULI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "AGUSTUS", "hps": 217346000, "komitmen_po": 216228000, "pr": 2},
        {"nama": "SEPTEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "OKTOBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Quality, Safety, Security, Health & Environtment (MSL)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 866605207, "komitmen_po": 819037921, "pr": 3},
        {"nama": "MARET", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "APRIL", "hps": 452500810, "komitmen_po": 443150810, "pr": 2},
        {"nama": "MEI", "hps": 2256855707, "komitmen_po": 2256472513, "pr": 2},
        {"nama": "JUNI", "hps": 3636978673, "komitmen_po": 3531749049, "pr": 5},
        {"nama": "JULI", "hps": 17757432756, "komitmen_po": 17004295180, "pr": 8},
        {"nama": "AGUSTUS", "hps": 11034793550, "komitmen_po": 10710252017, "pr": 4},
        {"nama": "SEPTEMBER", "hps": 929382225, "komitmen_po": 652275181, "pr": 10},
        {"nama": "OKTOBER", "hps": 438664434, "komitmen_po": 370292231, "pr": 7},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Internal Audit (AIT)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MARET", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "APRIL", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MEI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JUNI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JULI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "AGUSTUS", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "SEPTEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "OKTOBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Divisi Strategi Perusahaan dan Manajemen Risiko (SMR)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MARET", "hps": 261782400, "komitmen_po": 165834000, "pr": 1},
        {"nama": "APRIL", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MEI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JUNI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JULI", "hps": 291721736, "komitmen_po": 277500000, "pr": 1},
        {"nama": "AGUSTUS", "hps": 1044212210, "komitmen_po": 740744625, "pr": 1},
        {"nama": "SEPTEMBER", "hps": 102197700, "komitmen_po": 90109800, "pr": 1},
        {"nama": "OKTOBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "SDM dan Bagian Umum (SDM)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 14707500, "komitmen_po": 14707500, "pr": 1},
        {"nama": "MARET", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "APRIL", "hps": 36408000, "komitmen_po": 35316426, "pr": 1},
        {"nama": "MEI", "hps": 1040655874, "komitmen_po": 948757708, "pr": 5},
        {"nama": "JUNI", "hps": 33855000, "komitmen_po": 33855000, "pr": 1},
        {"nama": "JULI", "hps": 868262510, "komitmen_po": 768636960, "pr": 7},
        {"nama": "AGUSTUS", "hps": 8235321606, "komitmen_po": 7713218428, "pr": 11},
        {"nama": "SEPTEMBER", "hps": 2022259100, "komitmen_po": 1779521995, "pr": 17},
        {"nama": "OKTOBER", "hps": 10354199919, "komitmen_po": 9663337389, "pr": 13},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Keuangan dan Akuntansi (KAD)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MARET", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "APRIL", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MEI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JUNI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JULI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "AGUSTUS", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "SEPTEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "OKTOBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Manajemen Rantai Pasok (SCM)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MARET", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "APRIL", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MEI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JUNI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "JULI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "AGUSTUS", "hps": 65880000, "komitmen_po": 65329050, "pr": 1},
        {"nama": "SEPTEMBER", "hps": 327000000, "komitmen_po": 315539700, "pr": 1},
        {"nama": "OKTOBER", "hps": 638176982, "komitmen_po": 632213292, "pr": 3},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Teknologi dan Informasi (MIT)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 187108538, "komitmen_po": 148813260, "pr": 2},
        {"nama": "FEBRUARI", "hps": 1465855328, "komitmen_po": 1110555000, "pr": 1},
        {"nama": "MARET", "hps": 360639000, "komitmen_po": 333999000, "pr": 4},
        {"nama": "APRIL", "hps": 109446000, "komitmen_po": 85581000, "pr": 3},
        {"nama": "MEI", "hps": 630928210, "komitmen_po": 522489210, "pr": 5},
        {"nama": "JUNI", "hps": 280719000, "komitmen_po": 267820800, "pr": 3},
        {"nama": "JULI", "hps": 4762124220, "komitmen_po": 4320657240, "pr": 3},
        {"nama": "AGUSTUS", "hps": 156463380, "komitmen_po": 146753100, "pr": 1},
        {"nama": "SEPTEMBER", "hps": 1302679522, "komitmen_po": 1124966824, "pr": 4},
        {"nama": "OKTOBER", "hps": 4535154003, "komitmen_po": 4189793844, "pr": 7},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Pengembangan Bisnis (BDV)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 527723362, "komitmen_po": 478790765, "pr": 1},
        {"nama": "MARET", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "APRIL", "hps": 10694595387, "komitmen_po": 10273684849, "pr": 2},
        {"nama": "MEI", "hps": 489345467, "komitmen_po": 380319138, "pr": 3},
        {"nama": "JUNI", "hps": 52415366, "komitmen_po": 48648184, "pr": 1},
        {"nama": "JULI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "AGUSTUS", "hps": 22795682, "komitmen_po": 20536650, "pr": 1},
        {"nama": "SEPTEMBER", "hps": 33744000, "komitmen_po": 30005520, "pr": 1},
        {"nama": "OKTOBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Operasi dan Pelayanan (OPL)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 4952937903, "komitmen_po": 4908715256, "pr": 1},
        {"nama": "FEBRUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "MARET", "hps": 138039626, "komitmen_po": 138039626, "pr": 3},
        {"nama": "APRIL", "hps": 8474022664, "komitmen_po": 8454842260, "pr": 1},
        {"nama": "MEI", "hps": 32190000, "komitmen_po": 31857000, "pr": 1},
        {"nama": "JUNI", "hps": 224625000, "komitmen_po": 211246140, "pr": 3},
        {"nama": "JULI", "hps": 27500000, "komitmen_po": 27500000, "pr": 1},
        {"nama": "AGUSTUS", "hps": 1451653863, "komitmen_po": 1421015159, "pr": 3},
        {"nama": "SEPTEMBER", "hps": 37540200, "komitmen_po": 37540200, "pr": 1},
        {"nama": "OKTOBER", "hps": 14985000, "komitmen_po": 10378500, "pr": 1},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Prasarana (PRS)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 0, "komitmen_po": 0, "pr": 1},
        {"nama": "MARET", "hps": 6876871112, "komitmen_po": 5569082223, "pr": 6},
        {"nama": "APRIL", "hps": 1573817241, "komitmen_po": 1562727786, "pr": 7},
        {"nama": "MEI", "hps": 1291379270, "komitmen_po": 1271084474, "pr": 6},
        {"nama": "JUNI", "hps": 3877502919, "komitmen_po": 3644235450, "pr": 5},
        {"nama": "JULI", "hps": 9867009994, "komitmen_po": 9366431052, "pr": 13},
        {"nama": "AGUSTUS", "hps": 16117847849, "komitmen_po": 15407433695, "pr": 8},
        {"nama": "SEPTEMBER", "hps": 19534222421, "komitmen_po": 18133723485, "pr": 17},
        {"nama": "OKTOBER", "hps": 5264340370, "komitmen_po": 4918139156, "pr": 11},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    },
    {
      "divisi": "Sarana (SAR)",
      "kode_dept": "Total",
      "bulan": [
        {"nama": "JANUARI", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "FEBRUARI", "hps": 1783055456, "komitmen_po": 1739237306, "pr": 2},
        {"nama": "MARET", "hps": 91020000, "komitmen_po": 52725000, "pr": 1},
        {"nama": "APRIL", "hps": 2037695578, "komitmen_po": 1870589439, "pr": 5},
        {"nama": "MEI", "hps": 2053304110, "komitmen_po": 1988820950, "pr": 6},
        {"nama": "JUNI", "hps": 4509472370, "komitmen_po": 3960477105, "pr": 6},
        {"nama": "JULI", "hps": 2529125145, "komitmen_po": 2126425720, "pr": 4},
        {"nama": "AGUSTUS", "hps": 573955870, "komitmen_po": 430980560, "pr": 2},
        {"nama": "SEPTEMBER", "hps": 12142059820, "komitmen_po": 6454994049, "pr": 10},
        {"nama": "OKTOBER", "hps": 3828004084, "komitmen_po": 1133652780, "pr": 4},
        {"nama": "NOVEMBER", "hps": 0, "komitmen_po": 0, "pr": 0},
        {"nama": "DESEMBER", "hps": 0, "komitmen_po": 0, "pr": 0}
      ]
    }
  ]
};


// --- DATA BARU UNTUK PROCUREMENT STATUS ---
const procurementStatusData = {
  "periode": 2025,
// ... (data procurementStatusData disembunyikan untuk keringkasan)
  "pengadaan_status": {
    "divisi": [
      {
        "nama": "Sekretaris Perusahaan (SPR)",
        "kode": "SPR",
        "ongoing_request": 0,
        "on_proses_pengadaan": 0
      },
      {
        "nama": "Quality, Safety, Security, Health & Environtment (MSL)",
        "kode": "MSL",
        "ongoing_request": 5,
        "on_proses_pengadaan": 1.5
      },
      {
        "nama": "Internal Audit (AIT)",
        "kode": "AIT",
        "ongoing_request": 0,
        "on_proses_pengadaan": 0
      },
      {
        "nama": "Divisi Strategi Perusahaan dan Manajemen Risiko (SMR)",
        "kode": "SMR",
        "ongoing_request": 0,
        "on_proses_pengadaan": 0
      },
      {
        "nama": "SDM dan Bagian Umum (SDM)",
        "kode": "SDM",
        "ongoing_request": 4,
        "on_proses_pengadaan": 2.73
      },
      {
        "nama": "Keuangan dan Akuntansi (KAD)",
        "kode": "KAD",
        "ongoing_request": 0,
        "on_proses_pengadaan": 0
      },
      {
        "nama": "Manajemen Rantai Pasok (SCM)",
        "kode": "SCM",
        "ongoing_request": 0,
        "on_proses_pengadaan": 0
      },
      {
        "nama": "Teknologi dan Informasi (MIT)",
        "kode": "MIT",
        "ongoing_request": 9,
        "on_proses_pengadaan": 3.62
      },
      {
        "nama": "Operasi dan Pelayanan (OPL)",
        "kode": "OPL",
        "ongoing_request": 6,
        "on_proses_pengadaan": 0.75
      },
      {
        "nama": "Prasarana (PRS)",
        "kode": "PRS",
        "ongoing_request": 6,
        "on_proses_pengadaan": 4.79
      },
      {
        "nama": "Sarana (SAR)",
        "kode": "SAR",
        "ongoing_request": 6,
        "on_proses_pengadaan": 20.53
      }
    ],
    "total": {
      "ongoing_request": 36,
      "on_proses_pengadaan": 33.92
    }
  }
};

// --- DATA BARU UNTUK PENGHEMATAN (DARI USER) ---
const procurementSavingsData = {
  "data": [
    {
      "no": 1,
      "bulan": "Januari",
      "hps": 5674881441,
      "aktual": 5578718138,
      "selisih_hps": 96163303,
      "persen_saving_hps_vs_aktual": 2,
      "selisih_nego_bakn": 38295000,
      "persen_saving_penawaran": 0.69
    },
    {
      "no": 2,
      "bulan": "Februari",
      "hps": 4611441941,
      "aktual": 4116027027,
      "selisih_hps": 495414914,
      "persen_saving_hps_vs_aktual": 11,
      "selisih_nego_bakn": 0,
      "persen_saving_penawaran": 0.0
    },
    {
      "no": 3,
      "bulan": "Maret",
      "hps": 8107471530,
      "aktual": 6618549241,
      "selisih_hps": 1488922289,
      "persen_saving_hps_vs_aktual": 18,
      "selisih_nego_bakn": 19980000,
      "persen_saving_penawaran": 0.3
    },
    {
      "no": "#",
      "bulan": "Q1 Total",
      "hps": 18393794912,
      "aktual": 16313294406,
      "selisih_hps": 2080500506,
      "persen_saving_hps_vs_aktual": 11,
      "selisih_nego_bakn": 58275000,
      "persen_saving_penawaran": 0.36
    },
    {
      "no": 4,
      "bulan": "April",
      "hps": 12683890293,
      "aktual": 12452207721,
      "selisih_hps": 231682572,
      "persen_saving_hps_vs_aktual": 2,
      "selisih_nego_bakn": 0,
      "persen_saving_penawaran": 0.0
    },
    {
      "no": 5,
      "bulan": "Mei",
      "hps": 7305313171,
      "aktual": 7019481856,
      "selisih_hps": 285831315,
      "persen_saving_hps_vs_aktual": 4,
      "selisih_nego_bakn": 2500000,
      "persen_saving_penawaran": 0.04
    },
    {
      "no": 6,
      "bulan": "Juni",
      "hps": 12563152962,
      "aktual": 11649383544,
      "selisih_hps": 913769418,
      "persen_saving_hps_vs_aktual": 7,
      "selisih_nego_bakn": 1332000,
      "persen_saving_penawaran": 0.01
    },
    {
      "no": "#",
      "bulan": "Q2 Total",
      "hps": 32552356426,
      "aktual": 31121073121,
      "selisih_hps": 1431283305,
      "persen_saving_hps_vs_aktual": null,
      "selisih_nego_bakn": 3832000,
      "persen_saving_penawaran": 0.01
    },
    {
      "no": 7,
      "bulan": "Juli",
      "hps": 36103176361,
      "aktual": 33891446152,
      "selisih_hps": 2211730209,
      "persen_saving_hps_vs_aktual": 6,
      "selisih_nego_bakn": 8078580,
      "persen_saving_penawaran": 0.02
    },
    {
      "no": 8,
      "bulan": "Agustus",
      "hps": 38680128328,
      "aktual": 36635726634,
      "selisih_hps": 2044401694,
      "persen_saving_hps_vs_aktual": 5,
      "selisih_nego_bakn": 78230098,
      "persen_saving_penawaran": 0.21
    },
    {
      "no": 9,
      "bulan": "September",
      "hps": 36614686988,
      "aktual": 28804899234,
      "selisih_hps": 7809787754,
      "persen_saving_hps_vs_aktual": 21,
      "selisih_nego_bakn": 0,
      "persen_saving_penawaran": null
    },
    {
      "no": "#",
      "bulan": "Q3 Total",
      "hps": 111397991677,
      "aktual": 99332072021,
      "selisih_hps": 12065919656,
      "persen_saving_hps_vs_aktual": null,
      "selisih_nego_bakn": 86308678,
      "persen_saving_penawaran": 0.09
    },
    {
      "no": 10,
      "bulan": "Oktober",
      "hps": 25073524792,
      "aktual": 20917807192,
      "selisih_hps": 4155771601,
      "persen_saving_hps_vs_aktual": 17,
      "selisih_nego_bakn": 2711158,
      "persen_saving_penawaran": 0.01
    },
    {
      "no": 11,
      "bulan": "November",
      "hps": 0,
      "aktual": 0,
      "selisih_hps": 0,
      "persen_saving_hps_vs_aktual": null,
      "selisih_nego_bakn": 0,
      "persen_saving_penawaran": null
    },
    {
      "no": 12,
      "bulan": "Desember",
      "hps": 0,
      "aktual": 0,
      "selisih_hps": 0,
      "persen_saving_hps_vs_aktual": null,
      "selisih_nego_bakn": 0,
      "persen_saving_penawaran": null
    },
    {
      "no": "#",
      "bulan": "Q4 Total",
      "hps": 25073524792,
      "aktual": 20917807192,
      "selisih_hps": 4155771601,
      "persen_saving_hps_vs_aktual": null,
      "selisih_nego_bakn": 2711158,
      "persen_saving_penawaran": 0.01
    },
    {
      "no": "#",
      "bulan": "Yearly Total",
      "hps": 187420000000,
      "aktual": 167680000000,
      "selisih_hps": 20000000000,
      "persen_saving_hps_vs_aktual": null,
      "selisih_nego_bakn": 151126836,
      "persen_saving_penawaran": -765841949.11
    }
  ]
};


// --- DATA BARU UNTUK ANGGARAN DEPARTEMEN ---
// (Data lengkap departmentBudgetData ada di sini, disembunyikan untuk keringkasan)
const departmentBudgetData = {
  "departments": [
    {
      "kode": "01",
      "departemen": "Departemen Pelayanan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 16305633742,
        "total": 16305633742
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 16374774565,
        "total": 16374774565
      },
      "penyerapan": {
        "total": 11251092906,
        "persentase": 69.0
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 5123681659,
        "total": 5123681659
      }
    },
    {
      "kode": "02",
      "departemen": "Departemen Awak Sarana Perkeretapian",
      "anggaran_2025": {
        "capex": 305805000,
        "opex": 103896000,
        "total": 409701000
      },
      "realokasi_2025": {
        "capex": 304693975,
        "opex": 177797000,
        "total": 482490975
      },
      "penyerapan": {
        "total": 89105943,
        "persentase": 21.75
      },
      "sisa_anggaran": {
        "capex": 305805000,
        "opex": 88691057,
        "total": 394496057
      }
    },
    {
      "kode": "03",
      "departemen": "Departemen Pengendali Operasi",
      "anggaran_2025": {
        "capex": 0,
        "opex": 92844840,
        "total": 92844840
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 92844840,
        "total": 92844840
      },
      "penyerapan": {
        "total": 5945100,
        "persentase": 6.4
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 86899740,
        "total": 86899740
      }
    },
    {
      "kode": "04",
      "departemen": "Departemen Perawatan Sarana",
      "anggaran_2025": {
        "capex": 0,
        "opex": 26081596565,
        "total": 26081596565
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 22300171838,
        "total": 22300171838
      },
      "penyerapan": {
        "total": 8329238749,
        "persentase": 31.94
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 13970933089,
        "total": 13970933089
      }
    },
    {
      "kode": "05",
      "departemen": "Departemen Fasilitas Perawatan Sarana",
      "anggaran_2025": {
        "capex": 0,
        "opex": 7362900023,
        "total": 7362900023
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 6297161431,
        "total": 6297161431
      },
      "penyerapan": {
        "total": 1981947765,
        "persentase": 26.92
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 4315213666,
        "total": 4315213666
      }
    },
    {
      "kode": "06",
      "departemen": "Departemen Fasilitas Operasi Prasarana",
      "anggaran_2025": {
        "capex": 0,
        "opex": 39994814509,
        "total": 39994814509
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 36176008391,
        "total": 36176008391
      },
      "penyerapan": {
        "total": 16270425687,
        "persentase": 40.68
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 19905582704,
        "total": 19905582704
      }
    },
    {
      "kode": "07",
      "departemen": "Departemen Rekayasa dan Mutu Prasarana",
      "anggaran_2025": {
        "capex": 2328460158,
        "opex": 1621614035,
        "total": 3950074194
      },
      "realokasi_2025": {
        "capex": 2085039635,
        "opex": 1602239351,
        "total": 3687278987
      },
      "penyerapan": {
        "total": 991937502,
        "persentase": 25.11
      },
      "sisa_anggaran": {
        "capex": 2009597540,
        "opex": 929164467,
        "total": 2938762008
      }
    },
    {
      "kode": "08",
      "departemen": "Departemen Jalur & Bangunan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 25020207426,
        "total": 25020207426
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 24429661238,
        "total": 24429661238
      },
      "penyerapan": {
        "total": 10677772721,
        "persentase": 42.68
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 13751888517,
        "total": 13751888517
      }
    },
    {
      "kode": "09",
      "departemen": "Departemen Keamanan",
      "anggaran_2025": {
        "capex": 2394270189,
        "opex": 28160257790,
        "total": 30554527979
      },
      "realokasi_2025": {
        "capex": 2394270189,
        "opex": 26138294736,
        "total": 28532564925
      },
      "penyerapan": {
        "total": 20240599598,
        "persentase": 66.24
      },
      "sisa_anggaran": {
        "capex": 1,
        "opex": 8123856576,
        "total": 8291965327
      }
    },
    {
      "kode": "10",
      "departemen": "Departemen Keselamatan, Kesehatan & Lingkungan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 6054644197,
        "total": 6054644197
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 5438512708,
        "total": 5438512708
      },
      "penyerapan": {
        "total": 2365185142,
        "persentase": 39.06
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 3073327566,
        "total": 3073327566
      }
    },
    {
      "kode": "11",
      "departemen": "Departemen Pengembangan SDM",
      "anggaran_2025": {
        "capex": 0,
        "opex": 4615992586,
        "total": 4615992586
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 5166179189,
        "total": 5166179189
      },
      "penyerapan": {
        "total": 1510468010,
        "persentase": 32.72
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 3655711179,
        "total": 3655711179
      }
    },
    {
      "kode": "12",
      "departemen": "Departemen Layanan SDM",
      "anggaran_2025": {
        "capex": 0,
        "opex": 115661739398,
        "total": 115661739398
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 113490397712,
        "total": 113490397712
      },
      "penyerapan": {
        "total": 89873292302,
        "persentase": 77.7
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 23617105410,
        "total": 23617105410
      }
    },
    {
      "kode": "13",
      "departemen": "Departemen Bagian Umum",
      "anggaran_2025": {
        "capex": 0,
        "opex": 13615874632,
        "total": 13615874632
      },
      "realokasi_2025": {
        "capex": 682650000,
        "opex": 16323256159,
        "total": 17005906159
      },
      "penyerapan": {
        "total": 7695752888,
        "persentase": 56.52
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 8627503272,
        "total": 8627503272
      }
    },
    {
      "kode": "14",
      "departemen": "Departemen Subsidi & Anggaran",
      "anggaran_2025": {
        "capex": 0,
        "opex": 993707028,
        "total": 993707028
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 1588337454,
        "total": 1588337454
      },
      "penyerapan": {
        "total": 1034799917,
        "persentase": 104.14
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 309896054,
        "total": 553537537
      }
    },
    {
      "kode": "16",
      "departemen": "Departemen Keuangan & Pendapatan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 307476000,
        "total": 307476000
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 442476000,
        "total": 442476000
      },
      "penyerapan": {
        "total": 182396163,
        "persentase": 59.32
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 260079837,
        "total": 260079837
      }
    },
    {
      "kode": "17",
      "departemen": "Departemen Manajemen Risiko & Kepatuhan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 1161559500,
        "total": 1161559500
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 813151313,
        "total": 813151313
      },
      "penyerapan": {
        "total": 402427725,
        "persentase": 34.65
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 410723588,
        "total": 410723588
      }
    },
    {
      "kode": "18",
      "departemen": "Departemen Komunikasi Perusahaan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 2849018959,
        "total": 2849018959
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 3617945574,
        "total": 3617945574
      },
      "penyerapan": {
        "total": 2235488337,
        "persentase": 78.47
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 1382457237,
        "total": 1382457237
      }
    },
    {
      "kode": "19",
      "departemen": "Departemen Hukum",
      "anggaran_2025": {
        "capex": 0,
        "opex": 267502775,
        "total": 267502775
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 822502775,
        "total": 822502775
      },
      "penyerapan": {
        "total": 57895385,
        "persentase": 21.64
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 764607390,
        "total": 764607390
      }
    },
    {
      "kode": "20",
      "departemen": "Departemen Kesekretarian & Administrasi",
      "anggaran_2025": {
        "capex": 0,
        "opex": 216450000,
        "total": 216450000
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 216450000,
        "total": 216450000
      },
      "penyerapan": {
        "total": 216450000,
        "persentase": 100.0
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 0,
        "total": 0
      }
    },
    {
      "kode": "21",
      "departemen": "Departemen Perencanaan Perusahaan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 283449700,
        "total": 283449700
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 433449700,
        "total": 433449700
      },
      "penyerapan": {
        "total": 331002400,
        "persentase": 116.78
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 102447300,
        "total": 102447300
      }
    },
    {
      "kode": "22",
      "departemen": "Departemen Pengadaan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 366855000,
        "total": 366855000
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 366855000,
        "total": 366855000
      },
      "penyerapan": {
        "total": 208990854,
        "persentase": 56.97
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 157864146,
        "total": 157864146
      }
    },
    {
      "kode": "23",
      "departemen": "Divisi Internal Audit",
      "anggaran_2025": {
        "capex": 0,
        "opex": 179313750,
        "total": 179313750
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 179313750,
        "total": 179313750
      },
      "penyerapan": {
        "total": 158070937,
        "persentase": 88.15
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 21242813,
        "total": 21242813
      }
    },
    {
      "kode": "25",
      "departemen": "Departemen Pergudangan",
      "anggaran_2025": {
        "capex": 0,
        "opex": 847280000,
        "total": 847280000
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 727280000,
        "total": 727280000
      },
      "penyerapan": {
        "total": 0,
        "persentase": 0.0
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 727280000,
        "total": 727280000
      }
    },
    {
      "kode": "26",
      "departemen": "Departemen Operasi Sistem & Layanan Teknologi Informasi",
      "anggaran_2025": {
        "capex": 0,
        "opex": 8089012082,
        "total": 8089012082
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 7711450182,
        "total": 7711450182
      },
      "penyerapan": {
        "total": 4234919561,
        "persentase": 52.35
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 3476530621,
        "total": 3476530621
      }
    },
    {
      "kode": "27",
      "departemen": "Departemen Pengembangan Sistem Teknologi Informasi",
      "anggaran_2025": {
        "capex": 0,
        "opex": 3583912000,
        "total": 3583912000
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 3119235300,
        "total": 3119235300
      },
      "penyerapan": {
        "total": 821067000,
        "persentase": 22.91
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 2298168300,
        "total": 2298168300
      }
    },
    {
      "kode": "30",
      "departemen": "Departemen Jaminan Mutu",
      "anggaran_2025": {
        "capex": 0,
        "opex": 323650950,
        "total": 323650950
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 300663041,
        "total": 300663041
      },
      "penyerapan": {
        "total": 222470294,
        "persentase": 68.74
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 78192747,
        "total": 78192747
      }
    },
    {
      "kode": "32",
      "departemen": "Departemen Infrastruktur & Keamanan IT",
      "anggaran_2025": {
        "capex": 0,
        "opex": 3992792829,
        "total": 3992792829
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 3988592506,
        "total": 3988592506
      },
      "penyerapan": {
        "total": 1286286064,
        "persentase": 32.22
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 2702306442,
        "total": 2702306442
      }
    },
    {
      "kode": "31",
      "departemen": "Departemen Manajemen Proses Bisnis dan Inovasi",
      "anggaran_2025": {
        "capex": 0,
        "opex": 114511000,
        "total": 114511000
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 114511000,
        "total": 114511000
      },
      "penyerapan": {
        "total": 0,
        "persentase": 0
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 114511000,
        "total": 114511000
      }
    },
    {
      "kode": "33",
      "departemen": "Departemen Customer Engangement",
      "anggaran_2025": {
        "capex": 0,
        "opex": 585930000,
        "total": 585930000
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 839071072,
        "total": 839071072
      },
      "penyerapan": {
        "total": 212971723,
        "persentase": 36.35
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 626099349,
        "total": 626099349
      }
    },
    {
      "kode": "28",
      "departemen": "Departemen Ekspansi Bisnis",
      "anggaran_2025": {
        "capex": 0,
        "opex": 41014639567,
        "total": 41014639567
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 41014639567,
        "total": 41014639567
      },
      "penyerapan": {
        "total": 15232214182,
        "persentase": 37.14
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 25782425385,
        "total": 25782425385
      }
    },
    {
      "kode": "29",
      "departemen": "Departemen Komersial",
      "anggaran_2025": {
        "capex": 0,
        "opex": 5079264785,
        "total": 5079264785
      },
      "realokasi_2025": {
        "capex": 0,
        "opex": 5079264785,
        "total": 5079264785
      },
      "penyerapan": {
        "total": 155150500,
        "persentase": 3.05
      },
      "sisa_anggaran": {
        "capex": 0,
        "opex": 4924114285,
        "total": 4924114285
      }
    }
  ],
  "total": {
    "anggaran_2025": {
      "capex": 5028535347,
      "opex": 354948341668,
      "total": 359976877015
    },
    "realokasi_2025": {
      "capex": 5466653799,
      "opex": 345382488176,
      "total": 350849141975
    },
    "penyerapan": {
      "total": 198275365353,
      "persentase": 55.08
    },
    "sisa_anggaran": {
      "capex": 2315402541,
      "opex": 149408505396,
      "total": 152135658170
    }
  }
};


// -- Helper Function untuk Format Mata Uang --
const formatCurrency = (value) => {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + "B";
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + "K";
  }
  return value.toString();
};

// --- Komponen Finansial Asli (di-restyle) ---

// --- KOMPONEN BARU: TOP 5 DEPARTEMEN BERDASARKAN ANGGARAN ---
// DIHAPUS (diganti chart slider baru)
// const TopDepartmentsChart = ({ isLight, data }) => { ... };

// --- KOMPONEN BARU: PERFORMA PENYERAPAN (TOP/BOTTOM 5) ---
// DIHAPUS (diganti chart slider baru)
// const AbsorptionPerformanceCard = ({ isLight, data }) => { ... };


// --- DIPERBARUI: Menggunakan data dinamis untuk kedua chart ---
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
    const total = budgetTotals.realokasi_2025.total;
    const capexPercent = total > 0 ? (capex / total) * 100 : 0;
    const opexPercent = total > 0 ? (opex / total) * 100 : 0;
    
    const data2 = [
      { name: 'CAPEX', value: capex },
      { name: 'OPEX', value: opex },
    ];
    const COLORS2 = ['#3b82f6', '#14b8a6']; // Biru untuk CAPEX, Teal untuk OPEX
  
    return (
      // REFACTOR: Hapus flex-1, beri tinggi tetap
      <div className={`rounded-lg p-3 flex flex-col h-56 transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
        <h2 className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${isLight ? 'text-[#D3242B] border-slate-200' : 'text-[#F6821F] border-slate-800'}`}>
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Rasio Penyerapan & Tipe Anggaran</span>
        </h2>
        <div className="h-full w-full flex flex-col justify-around">
            <div className="flex items-center">
                <div className="w-1/2 h-24">
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
                <p className={`font-bold text-lg text-[#D3242B]`}>{absorptionPercent.toFixed(1)}%</p>
                <p className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sisa: {remainingPercent.toFixed(1)}%</p>
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
                {/* REFACTOR: Perbarui legenda agar sesuai dengan data dan warna baru */}
                <div className="w-1/2 text-xs space-y-0.5">
                    <p className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Tipe Anggaran (Realokasi)</p>
                    <p className={`flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span className="w-2 h-2 rounded-full bg-[#14b8a6]"></span>
                        <span>{opexPercent.toFixed(1)}% OPEX</span>
                    </p>
                    <p className={`flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                        <span>{capexPercent.toFixed(1)}% CAPEX</span>
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
};

// --- DULU: CompactProcurementChart ---
// --- SEKARANG: InteractiveProcurementChart (dengan slider AUTO) ---
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
                bulan: month.bulan, // "Jan", "Feb", ...
                hps: month.HPS,
                komitmen_po: month.Komitmen_PO,
                pr: month.PR
            }))
        };

        // 2. Format data Divisi (Slide 1 ... N)
        const divisionalViews = divisionalData.data.map(div => ({
            divisi: div.divisi,
            data: div.bulan.map(month => ({
                bulan: shortenMonth(month.nama), // "JANUARI" -> "Jan"
                hps: month.hps,
                komitmen_po: month.komitmen_po,
                pr: month.pr
            }))
        }));

        // 3. Gabungkan
        return [totalView, ...divisionalViews];
    }, [totalData, divisionalData]);

    // Navigasi slider (dibungkus useCallback)
    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % allChartData.length);
    }, [allChartData.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + allChartData.length) % allChartData.length);
    }, [allChartData.length]);
    
    // --- EFEK AUTO-SLIDE ---
    useEffect(() => {
        // Set interval untuk memanggil handleNext
        const sliderInterval = setInterval(() => {
            handleNext();
        }, AUTO_SLIDE_INTERVAL); // 12 detik

        // Cleanup function untuk membersihkan interval
        return () => {
            clearInterval(sliderInterval);
        };
    }, [currentIndex, handleNext]); // Dependensi pada currentIndex agar timer reset (jika user klik manual)

    const currentView = allChartData[currentIndex];

    return (
        <div className={`rounded-lg p-3 h-full flex flex-col transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            {/* Header dengan Judul Dinamis dan Slider */}
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
                    <LineChart data={currentView.data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
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
                                // Ganti key "komitmen_po" menjadi label "PO"
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
                        {/* Ganti dataKey ke lowercase */}
                        <Line yAxisId="left" type="monotone" dataKey="hps" name="hps" stroke="#D3242B" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line yAxisId="left" type="monotone" dataKey="komitmen_po" name="komitmen_po" stroke="#F6821F" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="pr" 
                            name="pr" 
                            stroke="#22c55e" // Green color for PR
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

// --- CHART BARU: Analisis Sisa Anggaran per Departemen (Top 10) ---
// DIHAPUS (diganti chart slider baru)
// const RemainingBudgetChart = ({ isLight, departmentsData }) => { ... };


// --- KPI BARU: On Progress ---
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


// --- CHART BARU ---
// --- DIPERBARUI: Diubah menjadi Horizontal Grouped Bar Chart ---
const ProcurementStatusChart = ({ isLight, data }) => {
    // Filter data untuk hanya menampilkan divisi dengan aktivitas
    const chartData = data.divisi.filter(
        d => d.ongoing_request > 0 || d.on_proses_pengadaan > 0
    ).map(d => ({ // Buat label baru
        ...d,
        label: `${d.kode} - ${d.nama}`
    }));

    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const textColor = isLight ? '#475569' : '#94a3b8';

    return (
        // Tambahkan flex-1 agar seimbang dengan card di atasnya
        <div className={`rounded-lg p-3 flex flex-col flex-1 h-full transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            <h2 className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${isLight ? 'text-[#D3242B] border-slate-200' : 'text-[#F6821F] border-slate-800'}`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Laporan Pengadaan 2025 - On Process</span>
            </h2>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        // layout="vertical" // DIHAPUS: Menjadi horizontal
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -20, bottom: 50 }} // Beri ruang bawah untuk label
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis 
                            dataKey="kode" // Sumbu X adalah kode divisi
                            fontSize={9} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }} 
                            tickLine={{ stroke: gridColor }} 
                            interval={0}
                            angle={-35} // Putar label
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
                                // Ambil nama lengkap dari payload
                                const { payload } = props;
                                if (name === 'on_proses_pengadaan') {
                                    return [`${value}B`, `On Proses (Miliar)`]; 
                                }
                                return [value, `Ongoing (Count)`];
                            }}
                             labelFormatter={(label) => {
                                 // Cari nama lengkap berdasarkan kode
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


// --- CHART BARU: Procurement Savings (Bar) ---
// --- PERBAIKAN: Terima `chartData` prop, bukan `data` ---
const ProcurementSavingsBarChart = ({ isLight, chartData }) => {
    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const textColor = isLight ? '#475569' : '#94a3b8';

    // Filter data bulanan saja
    // --- HAPUS useMemo, gunakan prop ---
    // const chartData = useMemo(() => { ... }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={`p-2 rounded-md shadow-lg ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                    <p className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{data.bulan}</p>
                    <p className={`text-xs text-blue-500`}>
                        <span className="font-semibold">Saving HPS:</span> {formatCurrency(data.selisih_hps)}
                    </p>
                    <p className="text-xs text-teal-500">
                        <span className="font-semibold">Saving Nego:</span> {formatCurrency(data.selisih_nego_bakn)}
                    </p>
                    <p className={`text-xs mt-1 pt-1 border-t ${isLight ? 'text-slate-700 border-slate-200' : 'text-slate-300 border-slate-700'}`}>
                        <span className="font-semibold">Total Saving:</span> {formatCurrency(data.selisih_hps + data.selisih_nego_bakn)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`rounded-lg p-3 flex flex-col flex-1 h-full transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            <h2 className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${isLight ? 'text-[#D3242B] border-slate-200' : 'text-[#F6821F] border-slate-800'}`}>
                <Award className="w-3.5 h-3.5" />
                <span>Analisis Penghematan (Nilai)</span>
            </h2>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData} // <-- Gunakan prop chartData
                        margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis 
                            dataKey="bulan_short" 
                            fontSize={10} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }}
                        />
                        <YAxis 
                            fontSize={10} 
                            tickFormatter={formatCurrency} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }}
                        />
                        <Tooltip content={CustomTooltip} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        <Bar dataKey="selisih_hps" name="Saving HPS" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="selisih_nego_bakn" name="Saving Nego" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- CHART BARU: Procurement Savings (Line) ---
// --- PERBAIKAN: Terima `chartData` prop, bukan `data` ---
const ProcurementSavingsLineChart = ({ isLight, chartData }) => {
    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const textColor = isLight ? '#475569' : '#94a3b8';

    // Filter data bulanan saja
    // --- HAPUS useMemo, gunakan prop ---
    // const chartData = useMemo(() => { ... }, [data]);

    return (
        <div className={`rounded-lg p-3 flex flex-col flex-1 h-full transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
            <h2 className={`text-xs font-bold mb-2 uppercase border-b pb-1 flex-shrink-0 flex items-center gap-1.5 ${isLight ? 'text-[#D3242B] border-slate-200' : 'text-[#F6821F] border-slate-800'}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Analisis Penghematan (%)</span>
            </h2>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData} // <-- Gunakan prop chartData
                        margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis 
                            dataKey="bulan_short" 
                            fontSize={10} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }}
                        />
                        <YAxis 
                            fontSize={10} 
                            tickFormatter={(value) => `${value}%`} 
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }}
                        />
                        <Tooltip 
                            formatter={(value, name) => [`${value}%`, "Saving HPS vs Aktual"]}
                            contentStyle={{ backgroundColor: isLight ? 'white' : '#0f172a', border: `1px solid ${gridColor}`, borderRadius: '6px', fontSize: '12px' }}
                            labelStyle={{ color: textColor }}
                        />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        <Line dataKey="persen_saving_hps_vs_aktual" name="% Saving HPS vs Aktual" type="monotone" stroke="#D3242B" strokeWidth={2} activeDot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


// --- KOMPONEN SLIDER BARU ---
// Chart baru yang menggabungkan semua data departemen dengan slider otomatis
// --- MODIFIKASI: Diubah menjadi Grouped Bar Chart ---
const DepartmentBudgetPerformanceChart = ({ isLight, data }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const textColor = isLight ? '#475569' : '#94a3b8';

    // 1. Siapkan semua data departemen
    const allChartData = useMemo(() => {
        return data
            .map(item => ({
                ...item,
                label: `${item.kode} - ${item.departemen}`,
                penyerapan_total: item.penyerapan.total,
                // --- DATA BARU ---
                anggaran_awal: item.anggaran_2025.total,
                anggaran_realokasi: item.realokasi_2025.total,
                // --- DATA LAMA (diganti) ---
                // sisa_total: item.sisa_anggaran.total,
                // anggaran_total: item.realokasi_2025.total
            }))
            // --- Urutkan berdasarkan Anggaran Realokasi ---
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

    // --- MODIFIKASI: Tooltip Baru ---
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Cari data asli berdasarkan label, karena payload mungkin tidak lengkap
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
            {/* Header dengan Judul Dinamis dan Slider */}
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
                        margin={{ top: 5, right: 20, left: 30, bottom: 20 }} // Beri ruang kiri
                        // --- MODIFIKASI: barGap untuk grouped chart ---
                        barGap={4}
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
                            dataKey="label" // Gunakan label baru
                            fontSize={9}
                            width={180} // Perlebar area YAxis
                            tick={{ fill: textColor }} 
                            axisLine={{ stroke: gridColor }}
                            interval={0}
                            tickFormatter={(value) => value.length > 30 ? value.substring(0, 30) + '...' : value} // Truncate
                        />
                        <Tooltip content={CustomTooltip} />
                        {/* --- MODIFIKASI: Legend Baru --- */}
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        {/* --- MODIFIKASI: Bar Baru (Grouped) --- */}
                        <Bar dataKey="anggaran_awal" name="Anggaran Awal" fill={isLight ? '#cbd5e1' : '#475569'} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="anggaran_realokasi" name="Anggaran Realokasi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="penyerapan_total" name="Penyerapan" fill="#D3242B" radius={[4, 4, 0, 0]} />
                        {/* <Bar stackId="a" dataKey="sisa_total" name="Sisa Anggaran" fill={isLight ? '#cbd5e1' : '#475569'} radius={[0, 4, 4, 0]} /> */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


// --- KOMPONEN SLIDER BARU UNTUK KOLOM KIRI ---
// --- DIHAPUS KARENA PINDAH KE KANAN ---
/*
const LeftColumnSlider = ({ isLight }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
...
};
*/

// --- KPI BARU: Savings ---
const SavingsKpis = ({ isLight, savingsData }) => {
    const yearlyData = savingsData.data.find(d => d.bulan === "Yearly Total");
    const q4Data = savingsData.data.find(d => d.bulan === "Q4 Total"); // Fallback untuk % tahunan yg aneh

    if (!yearlyData || !q4Data) return null;

    const kpis = [
        { title: "Total Saving Nego (YTD)", value: formatCurrency(yearlyData.selisih_nego_bakn), icon: Award, color: 'text-emerald-500' },
        // Menggunakan Q4 % karena data % tahunan tidak valid
        { title: "% Saving Penawaran (Q4)", value: `${q4Data.persen_saving_penawaran.toFixed(2)}%`, icon: TrendingUp, color: 'text-emerald-500' }, 
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

// --- KOMPONEN SLIDER BARU UNTUK KOLOM KANAN ---
const SavingsSlider = ({ isLight, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        'savings_value',
        'savings_percent'
    ];
    const totalSlides = slides.length;

    // --- PERBAIKAN DATA: Buat data chart di sini ---
    const chartDataValue = useMemo(() => {
        if (!data || !data.data) return [];
        return data.data
            .filter(item => typeof item.no === 'number')
            .map(item => ({
                ...item,
                bulan_short: item.bulan.substring(0, 3)
            }));
    }, [data]);

    const chartDataPercent = useMemo(() => {
        if (!data || !data.data) return [];
        return data.data
            .filter(item => typeof item.no === 'number')
            .map(item => ({
                ...item,
                bulan_short: item.bulan.substring(0, 3)
            }));
    }, [data]);


    const handleNext = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, [totalSlides]);

    // Efek auto-slide
    useEffect(() => {
        const sliderInterval = setInterval(handleNext, AUTO_SLIDE_INTERVAL);
        return () => clearInterval(sliderInterval);
    }, [currentSlide, handleNext]);

    let content;
    switch (slides[currentSlide]) {
        case 'savings_value':
            // PERBAIKAN 2: Kirim data yang sudah diproses
            content = <ProcurementSavingsBarChart isLight={isLight} chartData={chartDataValue} />;
            break;
        // --- PERBAIKAN TYPO: Menghapus karakter 't' yang tersesat ---
        case 'savings_percent':
            // PERBAIKAN 2: Kirim data yang sudah diproses
            content = <ProcurementSavingsLineChart isLight={isLight} chartData={chartDataPercent} />;
            break;
        default:
            content = null;
    }
    // --- PERBAIKAN TYPO: Menghapus karakter '.' yang tersesat ---

    return (
        <div className="flex-1 min-h-[300px] lg:min-h-0">
            {content}
        </div>
    );
};

// --- Main Dashboard Component ---
const FinanceDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [theme, setTheme] = useState('light');
    
    // --- STATE BARU UNTUK BUDGET SLIDER ---
    // DIHAPUS (dipindahkan ke dalam komponen chart baru)
    // const [budgetSlideIndex, setBudgetSlideIndex] = useState(0);

    // --- MEMPERBARUI LOGIKA KPI ---
    // Mengambil data total dari sumber yang relevan
    const { total: procurementTotals, selisih_HPS_dan_Komitmen } = dashboardData;
    // Data JSON baru menggantikan data lama
    const { total: budgetTotals } = departmentBudgetData;
    const { total: onProgressTotals } = procurementStatusData.pengadaan_status;

    // Menghitung KPI
    const totalPO = procurementTotals.Komitmen_PO;
    // Gunakan data savings baru untuk efficiency
    const yearlySavingsData = procurementSavingsData.data.find(d => d.bulan === "Yearly Total");
    // Gunakan HPS > 0 untuk menghindari bagi dengan nol
    const efficiency = (yearlySavingsData && yearlySavingsData.hps > 0) 
        ? (yearlySavingsData.selisih_hps / yearlySavingsData.hps) * 100 
        : (procurementTotals.HPS > 0 ? (selisih_HPS_dan_Komitmen / procurementTotals.HPS) * 100 : 0);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    // HAPUS EFEK SLIDER LAMA
    // useEffect(() => { ... }, []);

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    const isLight = theme === 'light';

    // Data KPI untuk bilah atas (sekarang dinamis dari data yang benar)
    const topKpis = [
        { title: "Total Budget", value: formatCurrency(budgetTotals.realokasi_2025.total), icon: DollarSign, color: isLight ? 'text-slate-900' : 'text-white' },
        { title: "Absorption", value: `${budgetTotals.penyerapan.persentase.toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-500' },
        { title: "PO Value (YTD)", value: formatCurrency(totalPO), icon: ShoppingCart, color: isLight ? 'text-slate-900' : 'text-white' },
        { title: "Efficiency (HPS vs PO)", value: `${efficiency.toFixed(1)}%`, icon: Target, color: 'text-emerald-500' },
        { title: "Remaining Budget", value: formatCurrency(budgetTotals.sisa_anggaran.total), icon: Wallet, color: 'text-[#F6821F]' },
    ];

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap'); .font-jakarta-sans { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>
            <div className={`min-h-screen lg:h-screen lg:overflow-hidden p-3 flex flex-col font-jakarta-sans transition-colors duration-300 ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-200'}`}>
                
                {/* Header */}
                <header className="mb-2 flex flex-col md:flex-row justify-between items-center p-3 rounded-lg bg-gradient-to-r from-[#D3242B] to-[#F6821F] flex-shrink-0 shadow-lg">
                    <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-2 md:gap-4">
                        <img src="https://e-ptw.lrtjakarta.co.id/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-lrtj-white.847caf54.png&w=640&q=75" alt="LRT Jakarta Logo" className="h-10" />
                        <div>
                            <h1 className="text-xl font-bold tracking-wide text-white">FINANCIAL DASHBOARD</h1>
                            <p className="text-xs font-semibold text-white/80">Real-Time Monitoring System</p>
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
                <section className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 mb-2 flex-shrink-0 rounded-lg p-1 transition-colors ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-900 border border-slate-800'}`}>
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
                            {/* Chart Donut yang sudah diperbaiki */}
                            <BudgetSummaryCharts isLight={isLight} budgetTotals={budgetTotals} />
                            {/* KPI On Progress Baru */}
                            <OnProgressKpis isLight={isLight} onProgressTotals={onProgressTotals} />
                            
                            {/* --- KPI SAVINGS BARU --- */}
                            <SavingsKpis isLight={isLight} savingsData={procurementSavingsData} />

                            {/* --- SLIDER OTOMATIS BARU UNTUK KOLOM KIRI --- */}
                            {/* <LeftColumnSlider isLight={isLight} /> */}
                            {/* GANTI SLIDER DENGAN CHART STATUS LANGSUNG */}
                            <div className="flex-1 min-h-[300px] lg:min-h-0">
                                <ProcurementStatusChart isLight={isLight} data={procurementStatusData.pengadaan_status} />
                            </div>
                        </div>

                        {/* Right Column (lg:col-span-9) - (Kolom Slider) */}
                        <div className="lg:col-span-9 flex flex-col gap-2 min-h-0">
                            {/* Row 1 di Kolom Kanan (Slider Procurement) */}
                            <div className="flex-1 min-h-0">
                                <InteractiveProcurementChart 
                                    isLight={isLight} 
                                    totalData={dashboardData.data_per_bulan}
                                    divisionalData={divisionalProcurementData}
                                />
                            </div>
                            
                            {/* Row 2 di Kolom Kanan (Slider Budget Departemen BARU) */}
                            {/* <div className="flex-1 h-full min-h-[300px] lg:min-h-0"> */}
                            {/* UBAH JADI GRID 12 KOLOM */}
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0">
                                {/* Kolom 1: Slider Budget (7 cols) - PERUBAHAN LAYOUT */}
                                <div className="h-full min-h-[300px] lg:min-h-0 lg:col-span-7">
                                   <DepartmentBudgetPerformanceChart 
                                     isLight={isLight} 
                                     data={departmentBudgetData.departments} 
                                   />
                                </div>
                                {/* Kolom 2: Slider Savings (5 cols) - PERUBAHAN LAYOUT */}
                                <div className="h-full min-h-[300px] lg:min-h-0 lg:col-span-5">
                                    {/* PERBAIKAN 1: Kirim 'procurementSavingsData' ke slider */}
                                    <SavingsSlider isLight={isLight} data={procurementSavingsData} />
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