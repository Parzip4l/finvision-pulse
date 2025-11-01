import { DollarSign, TrendingUp, Wallet, ShoppingCart, Target } from "lucide-react";
import { CompactKPICard } from "@/components/dashboard/CompactKPICard";
import { CompactProcurementChart } from "@/components/dashboard/CompactProcurementChart";
import { CompactDonutCharts } from "@/components/dashboard/CompactDonutCharts";
import { CompactOngoingTable } from "@/components/dashboard/CompactOngoingTable";
import { CompactBudgetTable } from "@/components/dashboard/CompactBudgetTable";
import { AutoCarousel } from "@/components/dashboard/AutoCarousel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const Index = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Header with LRT Style */}
      <DashboardHeader />

      {/* Main Content - Fixed Height, No Scroll */}
      <main className="flex-1 px-4 py-3 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-3">
          {/* Left Column - KPIs & Summary */}
          <div className="col-span-3 flex flex-col gap-3">
            {/* KPI Cards */}
            <div className="space-y-2">
              <CompactKPICard
                title="Total Budget"
                value="214.9B"
                icon={DollarSign}
                color="primary"
              />
              <CompactKPICard
                title="Absorption"
                value="68.3%"
                subtitle="146.8B absorbed"
                icon={TrendingUp}
                color="success"
              />
              <CompactKPICard
                title="Remaining"
                value="68.1B"
                icon={Wallet}
                color="warning"
              />
              <CompactKPICard
                title="PO Value"
                value="128.4B"
                icon={ShoppingCart}
                color="primary"
              />
              <CompactKPICard
                title="Efficiency"
                value="12.8%"
                subtitle="HPS vs PO"
                icon={Target}
                color="success"
              />
            </div>

            {/* Budget Overview */}
            <div className="glass-card p-3 flex-1">
              <h3 className="text-xs font-bold mb-2">Budget Overview</h3>
              <CompactDonutCharts />
            </div>
          </div>

          {/* Middle Column - Charts & Procurement */}
          <div className="col-span-5 flex flex-col gap-3">
            {/* HPS vs PO Chart */}
            <div className="glass-card p-3 h-[calc(50%-6px)]">
              <h3 className="text-xs font-bold mb-1">HPS vs PO Trend (Monthly)</h3>
              <div className="h-[calc(100%-24px)]">
                <CompactProcurementChart />
              </div>
            </div>

            {/* Procurement Summary */}
            <div className="glass-card p-3 h-[calc(50%-6px)]">
              <h3 className="text-xs font-bold mb-2">Annual Procurement Summary</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <p className="text-[9px] text-muted-foreground mb-1">Total HPS</p>
                  <p className="text-xl font-bold text-primary">147.2B</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
                  <p className="text-[9px] text-muted-foreground mb-1">Total PO</p>
                  <p className="text-xl font-bold text-success">128.4B</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-3/5 border border-chart-3/20">
                <p className="text-[9px] text-muted-foreground mb-1">Savings Achieved</p>
                <p className="text-2xl font-bold" style={{ color: "hsl(var(--chart-3))" }}>18.8B</p>
                <p className="text-[9px] text-muted-foreground">12.8% efficiency gain</p>
              </div>
            </div>
          </div>

          {/* Right Column - Tables with Auto Carousel */}
          <div className="col-span-4 glass-card p-3">
            <h3 className="text-xs font-bold mb-2">Project & Budget Analysis</h3>
            <div className="h-[calc(100%-32px)]">
              <AutoCarousel intervalMs={6000}>
                {/* Slide 1: Ongoing Projects */}
                <div className="w-full h-full flex flex-col">
                  <h4 className="text-[10px] font-semibold text-primary mb-2">Ongoing Projects</h4>
                  <CompactOngoingTable />
                </div>

                {/* Slide 2: Budget Analysis */}
                <div className="w-full h-full flex flex-col">
                  <h4 className="text-[10px] font-semibold text-success mb-2">Budget by Division</h4>
                  <CompactBudgetTable />
                </div>

                {/* Slide 3: Key Metrics Summary */}
                <div className="w-full h-full flex flex-col justify-center space-y-3 px-4">
                  <h4 className="text-[10px] font-semibold text-center mb-2">Key Highlights</h4>
                  
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <p className="text-[9px] text-muted-foreground mb-1">Highest Absorption</p>
                    <p className="text-lg font-bold text-primary">Technology</p>
                    <p className="text-[10px] text-muted-foreground">71.9% • 41B absorbed</p>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-br from-warning/10 to-transparent border border-warning/20">
                    <p className="text-[9px] text-muted-foreground mb-1">Needs Attention</p>
                    <p className="text-lg font-bold text-warning">Marketing</p>
                    <p className="text-[10px] text-muted-foreground">8 projects delayed</p>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-br from-success/10 to-transparent border border-success/20">
                    <p className="text-[9px] text-muted-foreground mb-1">Total Active Projects</p>
                    <p className="text-2xl font-bold text-success">52</p>
                    <p className="text-[10px] text-muted-foreground">Across all divisions</p>
                  </div>
                </div>
              </AutoCarousel>
            </div>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="border-t border-border px-4 py-1">
        <p className="text-[8px] text-center text-muted-foreground">
          © 2025 Financial Analytics Platform • Real-time Data Dashboard
        </p>
      </footer>
    </div>
  );
};

export default Index;
