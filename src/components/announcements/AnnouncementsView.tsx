import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Plus, Bell, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AnnouncementsView: React.FC = () => {
  const { announcements, currentProperty, addAnnouncement, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Block A' | 'Block B' | 'Floors 1-2'>('All');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('important');

  const propertyAnnouncements = announcements.filter(a => a.propertyId === currentProperty.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      propertyId: currentProperty.id,
      title,
      content,
      targetAudience,
      priority,
      authorName: 'Property Admin',
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">Hostel Broadcasts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Announcements & Notices
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Broadcast emergency alerts, festival menus, maintenance shutdowns, and rules to residents.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {propertyAnnouncements.map(item => {
          const priorityStyles = {
            urgent: 'border-rose-300 bg-rose-50/40 text-rose-900',
            important: 'border-amber-300 bg-amber-50/30 text-amber-900',
            normal: 'border-slate-200 bg-white text-slate-900',
          };

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all shadow-2xs space-y-3 ${priorityStyles[item.priority]}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : item.priority === 'important'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.priority}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Audience: {item.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.createdAt} by {item.authorName}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{item.content}</p>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Delivered to all resident mobile apps
                </span>
                <span>Active notice</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast New Notice"
        subtitle={`Publish announcement for ${currentProperty.name} residents`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Overhead Tank Chlorination & Cleaning Schedule"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="All">All Residents</option>
                <option value="Block A">Block A Only</option>
                <option value="Block B">Block B Only</option>
                <option value="Floors 1-2">Floors 1 & 2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Content *</label>
            <textarea
              required
              rows={4}
              placeholder="Type message text to be displayed in student portals and sent via app notification..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Broadcast Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
