// -- Data Finansial dari Dashboard Sebelumnya (TOTAL) --
export const dashboardData = {
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
