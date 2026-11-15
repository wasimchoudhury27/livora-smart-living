import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek, FoodMenuItem } from '../../types';
import { 
  UtensilsCrossed, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie, 
  Star, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const FoodView: React.FC = () => {
  const { foodMenus, foodRatings, currentProperty, showToast } = useApp();

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Current day of week
  const todayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const todayDayName = days[todayIndex === 0 ? 6 : todayIndex - 1];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);

  const activeMenu = foodMenus.find(m => m.day === selectedDay) || foodMenus[0];

  const handleRateFoodPrompt = () => {
    showToast('Mess Feedback Recorded', 'Thank you for rating today’s dinner meal!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-orange-600 font-bold">Dining & Mess Operations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Weekly Mess Menu & Ratings
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Balanced 4-meal daily nutritional calendar with resident taste and quantity feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>Dining Score: 4.1 / 5.0</span>
          </span>
        </div>
      </div>

      {/* Ratings & AI Dining Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Dining</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">4.1</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-amber-500">
            {'★★★★☆'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taste Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600">4.2</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">High ratings for Tuesday Idli/Vada</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kitchen Hygiene</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-indigo-600">4.0</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">FSSAI food safety audit passed</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portion / Quantity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-600">3.1</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Shortage reported post 9:30 PM</p>
        </div>
      </div>

      {/* AI Kitchen Co-Pilot Advisory */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950 via-slate-900 to-indigo-950 text-white border border-orange-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="text-orange-300 uppercase tracking-wider font-bold">
            AI Kitchen Operations Notice for Chef Rajesh:
          </strong>
          <p className="text-slate-300 mt-1 leading-relaxed">
            Over the past 14 days, 64% of 3-star reviews occurred during Sunday & Wednesday dinner services between 9:15 PM and 10:00 PM due to paneer and non-veg gravy depletion. We recommend increasing evening prep batch volume by +15% on non-veg feast days.
          </p>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200">
        {days.map(d => {
          const isSelected = selectedDay === d;
          const isToday = d === todayDayName;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>{d}</span>
              {isToday && (
                <span className={`text-[10px] font-extrabold uppercase ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4 Meal Cards Grid for Selected Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Breakfast */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Breakfast</h4>
                  <span className="text-[10px] text-slate-400 font-mono">07:30 AM - 09:30 AM</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {activeMenu.breakfast.items.map((itemName: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/70">
                  <span className="font-semibold text-slate-800">{itemName}</span>
                  <span className={`w-2 h-2 rounded-full ${itemName.toLowerCase().includes('egg') || itemName.toLowerCase().includes('chicken') ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Served hot with filter coffee & tea
          </div>
        </div>

        {/* Lunch */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Lunch</h4>
                  <span className="text-[10px] text-slate-400 font-mono">12:30 PM - 02:30 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {activeMenu.lunch.items.map((itemName: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/70">
                  <span className="font-semibold text-slate-800">{itemName}</span>
                  <span className={`w-2 h-2 rounded-full ${itemName.toLowerCase().includes('egg') || itemName.toLowerCase().includes('chicken') ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Accompanied by curd, pickle & papad
          </div>
        </div>

        {/* Snacks */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Cookie className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Evening Snacks</h4>
                  <span className="text-[10px] text-slate-400 font-mono">05:00 PM - 06:15 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {(activeMenu.snacks?.items || []).map((itemName: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/70">
                  <span className="font-semibold text-slate-800">{itemName}</span>
                  <span className={`w-2 h-2 rounded-full ${itemName.toLowerCase().includes('egg') || itemName.toLowerCase().includes('chicken') ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Evening masala chai & lemon tea
          </div>
        </div>

        {/* Dinner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Dinner</h4>
                  <span className="text-[10px] text-slate-400 font-mono">07:45 PM - 10:00 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {activeMenu.dinner.items.map((itemName: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/70">
                  <span className="font-semibold text-slate-800">{itemName}</span>
                  <span className={`w-2 h-2 rounded-full ${itemName.toLowerCase().includes('egg') || itemName.toLowerCase().includes('chicken') ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Fresh phulkas, dal & dessert on weekends
          </div>
        </div>
      </div>
    </div>
  );
};
