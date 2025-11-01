import { DollarSign, TrendingUp, Wallet, ShoppingCart, Target } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ProcurementChart } from "@/components/dashboard/ProcurementChart";
import { BudgetDonutCharts } from "@/components/dashboard/BudgetDonutCharts";
import { OngoingProjectsTable } from "@/components/dashboard/OngoingProjectsTable";
import { BudgetAnalysisTable } from "@/components/dashboard/BudgetAnalysisTable";
import { HPSAnalysisTable } from "@/components/dashboard/HPSAnalysisTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Executive Financial Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Budget & Procurement Analytics Platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold">Nov 1, 2025 14:30</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Section A: Filters & KPIs */}
        <section className="mb-8">
          <FilterBar />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard
              title="Total Budget (YTD)"
              value="IDR 214.9B"
              icon={DollarSign}
              color="primary"
            />
            <KPICard
              title="Total Absorption (YTD)"
              value="IDR 146.8B"
              subtitle="68.3% absorbed"
              percentage={12.5}
              trend="up"
              icon={TrendingUp}
              color="success"
            />
            <KPICard
              title="Remaining Budget"
              value="IDR 68.1B"
              subtitle="31.7% remaining"
              icon={Wallet}
              color="warning"
            />
            <KPICard
              title="Total PO Value (YTD)"
              value="IDR 128.4B"
              percentage={8.3}
              trend="up"
              icon={ShoppingCart}
              color="primary"
            />
            <KPICard
              title="Procurement Efficiency"
              value="12.8%"
              subtitle="HPS vs PO savings"
              percentage={2.1}
              trend="up"
              icon={Target}
              color="success"
            />
          </div>
        </section>

        {/* Section B: Procurement Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Procurement Analysis</h2>
          <div className="space-y-6">
            <ProcurementChart />
            <HPSAnalysisTable />
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Annual Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total HPS (Annual)</p>
                  <p className="text-3xl font-bold text-primary">IDR 147.2B</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total PO (Annual)</p>
                  <p className="text-3xl font-bold text-success">IDR 128.4B</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section C: Ongoing Projects */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Ongoing Project Monitoring</h2>
          <OngoingProjectsTable />
        </section>

        {/* Section D: Budget Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Detailed Budget Analysis</h2>
          <div className="space-y-6">
            <BudgetDonutCharts />
            <BudgetAnalysisTable />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-[1600px] mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Financial Analytics Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
