import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Megaphone, 
  Bell, 
  Calendar, 
  Pin, 
  FileText, 
  CheckCircle2, 
  Filter, 
  Search,
  Sparkles,
  Info,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface NoticeItem {
  id: string;
  title: string;
  category: 'General' | 'Mess & Dining' | 'Maintenance' | 'Security & Rules' | 'Events';
  date: string;
  author: string;
  content: string;
  isPinned?: boolean;
  priority: 'high' | 'normal';
}

export const StudentNoticesView: React.FC = () => {
  const { currentProperty } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const notices: NoticeItem[] = [
    {
      id: 'n-1',
      title: 'Scheduled Water Tank Cleaning & Sanitization',
      category: 'Maintenance',
      date: 'Tomorrow, Oct 18, 10:00 AM - 02:00 PM',
      author: 'Estate Manager, K. Verma',
      content: 'Please be advised that the main overhead water tanks for Wing A & Wing B will undergo bi-monthly pressure cleaning and UV sanitization tomorrow. Water supply will be paused between 10:00 AM and 02:00 PM. Please store adequate drinking water beforehand.',
      isPinned: true,
      priority: 'high'
    },
    {
      id: 'n-2',
      title: 'Diwali Festive Dinner & Rooftop Cultural Night',
      category: 'Events',
      date: 'Sunday, Oct 27, 07:30 PM Onwards',
      author: 'Student Living Committee',
      content: 'We invite all residents for a grand festive feast featuring traditional sweets, live acoustic performances, and rooftop celebration. Traditional dress code encouraged. RSVP is not required—entry open to all campus residents.',
      isPinned: true,
      priority: 'normal'
    },
    {
      id: 'n-3',
      title: 'Campus High-Speed Wi-Fi Upgrade Completed',
      category: 'General',
      date: 'Oct 14, 2026',
      author: 'IT Infrastructure Lead',
      content: 'New Wi-Fi 6 access points have been deployed across Floors 1 to 5. SSID "LIVORA_RESIDENT_5G" is now active. Log in using your registered resident mobile number OTP for speeds up to 300 Mbps symmetrical.',
      priority: 'normal'
    },
    {
      id: 'n-4',
      title: 'Updated Dining Hall Timings & Midnight Snack Bar',
      category: 'Mess & Dining',
      date: 'Oct 10, 2026',
      author: 'Head Chef & Mess Warden',
      content: 'Based on survey feedback from examination period students, dinner service is extended to 10:30 PM. Furthermore, the 4th floor lounge vending machines and microwave stations are now restocked nightly.',
      priority: 'normal'
    },
    {
      id: 'n-5',
      title: 'Biometric Access & Visitor Curfew Reminders',
      category: 'Security & Rules',
      date: 'Oct 05, 2026',
      author: 'Chief Security Officer',
      content: 'External guests and visitors must be checked in at the front desk with valid government ID before 08:30 PM and must depart by 10:00 PM. Late entry requests must be submitted via the Livora app 2 hours prior.',
      priority: 'normal'
    }
  ];

  const categories = ['all', 'General', 'Mess & Dining', 'Maintenance', 'Security & Rules', 'Events'];

  const filteredNotices = notices.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Megaphone className="w-3.5 h-3.5" />
              Official Campus Broadcasts
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Notices & Circulars</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Stay up-to-date with hostel advisories, maintenance schedules, dining updates, and community activities for {currentProperty?.name || 'LIVORA Residency'}.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <Bell className="w-5 h-5 text-teal-300" />
            <div>
              <p className="text-xs text-slate-300 font-medium">Broadcast Status</p>
              <p className="text-sm font-bold text-teal-300">{notices.length} Active Circulars</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars, maintenance advisories, events..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Notices' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div 
            key={notice.id}
            className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs transition-all hover:shadow-xs ${
              notice.isPinned ? 'border-teal-200 ring-1 ring-teal-100 bg-linear-to-b from-teal-50/20 to-white' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                {notice.isPinned ? (
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Pin className="w-4 h-4 fill-teal-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {notice.category}
                    </span>
                    {notice.priority === 'high' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                        Urgent Action
                      </span>
                    )}
                    {notice.isPinned && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {notice.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0 pl-11 sm:pl-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{notice.date}</span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed pl-0 sm:pl-11 font-normal mb-4">
              {notice.content}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 sm:pl-11 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Issued by: {notice.author}</span>
              <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Circular
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
