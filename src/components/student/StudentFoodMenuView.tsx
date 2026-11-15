import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UtensilsCrossed, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon, 
  Clock, 
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentFoodMenuView: React.FC = () => {
  const { currentProperty } = useApp();
  const [selectedDay, setSelectedDay] = useState<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('monday');

  const daysOfWeek: { id: typeof selectedDay; label: string; short: string }[] = [
    { id: 'monday', label: 'Monday', short: 'Mon' },
    { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { id: 'thursday', label: 'Thursday', short: 'Thu' },
    { id: 'friday', label: 'Friday', short: 'Fri' },
    { id: 'saturday', label: 'Saturday', short: 'Sat' },
    { id: 'sunday', label: 'Sunday', short: 'Sun' },
  ];

  const menuData: Record<string, { breakfast: string; lunch: string; snacks: string; dinner: string }> = {
    monday: {
      breakfast: 'Masala Dosa, Sambar, Coconut Chutney, Fresh Fruits & Tea/Coffee',
      lunch: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Phulka, Fresh Salad, Curd',
      snacks: 'Vegetable Cutlet, Mint Chutney, Hot Masala Chai / Filter Coffee',
      dinner: 'Aloo Gobi Matar, Mix Veg Dal, Steamed Basmati Rice, Roti, Gulab Jamun'
    },
    tuesday: {
      breakfast: 'Poha with Peanuts, Sev, Boiled Eggs / Sprouts, Banana & Tea/Coffee',
      lunch: 'Rajma Masala, Steamed Rice, Mix Veg Sabzi, Roti, Boondi Raita, Papad',
      snacks: 'Samosa with Tamarind Chutney, Green Tea / Chai',
      dinner: 'Kadhai Paneer / Egg Curry, Dal Fry, Jeera Rice, Tawa Roti, Fruit Custard'
    },
    wednesday: {
      breakfast: 'Idli, Medu Vada, Coconut & Tomato Chutneys, Sambar, Coffee',
      lunch: 'Chole Masala, Bhature / Phulka, Jeera Rice, Cucumber Raita, Pickle',
      snacks: 'Bhel Puri, Sweet Corn Chaat, Tea / Coffee',
      dinner: 'Veg Pulao, Paneer Makhani, Dal Makhani, Paratha, Moong Dal Halwa'
    },
    thursday: {
      breakfast: 'Aloo Paratha with White Butter, Curd, Pickle, Seasonal Juice & Chai',
      lunch: 'Bhindi Do Pyaza, Yellow Moong Dal, Steamed Rice, Phulka, Dahi, Salad',
      snacks: 'Pav Bhaji, Onion Salad, Lemon Water / Masala Chai',
      dinner: 'Palak Paneer, Tadka Dal, Peas Pulao, Butter Roti, Rasgulla'
    },
    friday: {
      breakfast: 'Upma with Coconut Chutney, Boiled Eggs, Watermelon & Filter Coffee',
      lunch: 'Dum Aloo Kashmiri, Dal Tadka, Jeera Rice, Roti, Mix Veg Raita',
      snacks: 'Bread Pakora with Green Chutney, Cardamom Chai',
      dinner: 'Special Biryani (Veg/Chicken option), Mirchi Ka Salan, Raita, Ice Cream'
    },
    saturday: {
      breakfast: 'Puri Bhaji with Halwa, Sprouted Moong, Milk & Tea/Coffee',
      lunch: 'Shahi Paneer, Chana Dal, Steamed Rice, Tandoori Roti, Green Salad',
      snacks: 'Onion & Spinach Pakoras, Tomato Ketchup, Hot Chai',
      dinner: 'Dal Makhani, Kadhai Veg, Jeera Rice, Garlic Naan, Kheer'
    },
    sunday: {
      breakfast: 'Special Masala Omelette / Uttapam, Toast, Jam, Fruit Bowl, Coffee',
      lunch: 'Hyderabadi Veg/Chicken Biryani, Onion Raita, Dal Maharani, Papad',
      snacks: 'Club Sandwich, Potato Crisps, Fresh Lime Soda',
      dinner: 'Paneer Tikka Masala, Tawa Roti, Veg Pulao, Dal Fry, Gajar Halwa'
    }
  };

  const dayMenu = menuData[selectedDay] || menuData.monday;

  const mealSlots = [
    {
      name: 'Breakfast',
      time: '07:30 AM – 09:30 AM',
      icon: Coffee,
      iconColor: 'text-amber-500 bg-amber-50',
      items: dayMenu.breakfast,
      calories: '450 - 550 kcal',
      type: 'Vegetarian + Egg option'
    },
    {
      name: 'Lunch',
      time: '12:30 PM – 02:30 PM',
      icon: Sun,
      iconColor: 'text-orange-500 bg-orange-50',
      items: dayMenu.lunch,
      calories: '650 - 800 kcal',
      type: 'Full Thali Buffet'
    },
    {
      name: 'Evening Snacks',
      time: '05:00 PM – 06:15 PM',
      icon: Sunset,
      iconColor: 'text-teal-600 bg-teal-50',
      items: dayMenu.snacks,
      calories: '200 - 300 kcal',
      type: 'Light Refreshments'
    },
    {
      name: 'Dinner',
      time: '08:00 PM – 10:00 PM',
      icon: Moon,
      iconColor: 'text-indigo-600 bg-indigo-50',
      items: dayMenu.dinner,
      calories: '550 - 700 kcal',
      type: 'Warm Dinner & Dessert'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Chef's Weekly Dining Schedule
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Food & Mess Menu</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Freshly prepared 4-times daily meals adhering to high hygiene standards. Nutritional balance planned by campus nutritionists.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-300 font-medium">Mess Timings Status</p>
              <p className="text-sm font-bold text-teal-300">Dining Hall Open</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day.id;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{day.label}</span>
                {day.id === 'monday' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mealSlots.map((meal, idx) => {
          const Icon = meal.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meal.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{meal.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{meal.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {meal.type}
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 mb-4">
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {meal.items}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Approx. {meal.calories}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Hygiene Inspected
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dietary & Feedback Note */}
      <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-teal-950">Special Dietary Needs or Allergies?</h4>
            <p className="text-xs text-teal-800 mt-0.5">
              Please notify the mess warden or submit a dining request if you require gluten-free, low-spice, or sick meal packages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
