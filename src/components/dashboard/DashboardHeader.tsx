import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import lrtLogo from "@/assets/lrt-logo.png";

export const DashboardHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    return hour >= 18 || hour < 6 ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />;
  };

  return (
    <header className="relative px-6 py-4 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500"></div>
      
      {/* Content */}
      <div className="relative flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2 shadow-lg">
            <img src={lrtLogo} alt="LRT Jakarta" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
              LRT JAKARTA DASHBOARD
            </h1>
            <p className="text-white/90 text-[10px] font-medium">
              Pegangsan Dua - Velodrome Line | Real-Time Monitoring System
            </p>
          </div>
        </div>

        {/* Right: Time & Date */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-white text-2xl font-bold tracking-wider">
              {formatTime(currentTime)}
            </div>
            <div className="text-white/90 text-[10px] font-medium">
              {formatDate(currentTime)}
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {getTimeIcon()}
          </div>
        </div>
      </div>
    </header>
  );
};
