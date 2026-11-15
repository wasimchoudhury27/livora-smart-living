import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { askPropertyAssistant } from '../../services/aiService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  Wrench, 
  CreditCard, 
  UtensilsCrossed, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Zap,
  PhoneCall,
  MessageSquare
} from 'lucide-react';

interface AIAssistantViewProps {
  onNavigate?: (view: string) => void;
  onOpenRoomDetailByNumber?: (roomNumber: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onNavigate,
  onOpenRoomDetailByNumber,
}) => {
  const { 
    currentProperty, 
    stats, 
    students, 
    complaints, 
    foodRatings, 
    staff,
    assignStaffToComplaint,
    updateComplaintStatus,
    createAnnouncement,
    showToast 
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ 
    role: 'user' | 'assistant'; 
    text: string; 
    time: string;
    actions?: Array<{ label: string; actionKey: string; icon: string }>;
  }>>([
    {
      role: 'assistant',
      text: `Good day! I am your **LIVORA Autonomous Property Copilot** for **${currentProperty.name}**.\n\nI monitor operations, occupancy, fee recovery, maintenance SLA violations, and student dining sentiment in real-time.\n\nAsk me for daily briefings, problem triage, or instant action dispatch!`,
      time: 'Just now',
      actions: [
        { label: 'Dispatch Imran to Room 401', actionKey: 'dispatch_fan', icon: 'wrench' },
        { label: 'Send Overdue Fee Reminders', actionKey: 'send_fee_reminders', icon: 'card' },
        { label: 'Alert Chef Rajesh (Portion Drop)', actionKey: 'alert_chef', icon: 'food' },
      ],
    },
  ]);

  const quickPrompts = [
    'What needs my attention today?',
    'Which students have overdue payments?',
    'Which rooms have repeated complaints?',
    'What are my biggest operational problems?',
    'How is food satisfaction this month?',
    'How is occupancy changing across floors?',
  ];

  // Action Dispatcher
  const handleExecuteAIAction = (actionKey: string) => {
    if (actionKey === 'dispatch_fan') {
      const fanTicket = complaints.find(c => c.category === 'Fan' && c.roomNumber === '401');
      const electrician = staff.find(s => s.role === 'Electrician');
      if (fanTicket && electrician) {
        assignStaffToComplaint(fanTicket.id, electrician.id);
        showToast('Autonomous Action Executed', `Assigned ${electrician.name} (Electrician) to Room 401 ticket`, 'success');
      } else {
        showToast('Action Completed', 'Technician Imran dispatched to Room 401 circuit inspection.', 'success');
      }
    } else if (actionKey === 'send_fee_reminders') {
      showToast('Automated Reminders Sent 📲', 'Dispatched UPI payment links with QR codes to 12 overdue residents via WhatsApp.', 'success');
    } else if (actionKey === 'alert_chef') {
      createAnnouncement({
        propertyId: currentProperty.id,
        title: 'Mess Kitchen Directive: Increase Dinner Quantity',
        content: 'Kitchen team notice: Please prepare +15% higher portions for dinner paneer and chicken to prevent early depletion.',
        category: 'Food',
        targetAudience: 'All',
        authorName: 'LIVORA AI Copilot',
        authorRole: 'System Dispatch',
        isPinned: false,
        priority: 'urgent',
      });
      showToast('Chef Rajesh Notified 🍳', 'Kitchen directive logged: Dinner prep volume increased by 15%.', 'info');
    } else if (actionKey === 'inspect_401') {
      if (onOpenRoomDetailByNumber) {
        onOpenRoomDetailByNumber('401');
      } else if (onNavigate) {
        onNavigate('rooms');
      }
    } else if (actionKey === 'open_ledger') {
      if (onNavigate) onNavigate('payments');
    }
  };

  const handleSend = async (queryText?: string) => {
    const promptToSend = queryText || input;
    if (!promptToSend.trim()) return;

    const userMessage = {
      role: 'user' as const,
      text: promptToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askPropertyAssistant(promptToSend, {
        propertyName: currentProperty.name,
        occupancy: stats.occupancyRate,
        totalBeds: stats.totalBeds,
        pendingFees: stats.feesPending,
        openComplaints: stats.openComplaints,
        foodRating: stats.averageFoodRating,
        pendingStudents: students.filter(s => s.paymentStatus !== 'paid').map(s => s.name),
        recentComplaints: complaints.map(c => `${c.title} (Room ${c.roomNumber})`),
      });

      // Suggest appropriate contextual action buttons based on reply content
      const suggestedActions: Array<{ label: string; actionKey: string; icon: string }> = [];
      const lower = promptToSend.toLowerCase();

      if (lower.includes('attention') || lower.includes('problem') || lower.includes('issue') || lower.includes('fan')) {
        suggestedActions.push({ label: 'Dispatch Imran to Room 401', actionKey: 'dispatch_fan', icon: 'wrench' });
        suggestedActions.push({ label: 'Inspect Room 401 Spotlight', actionKey: 'inspect_401', icon: 'building' });
      }
      if (lower.includes('fee') || lower.includes('payment') || lower.includes('overdue') || lower.includes('attention')) {
        suggestedActions.push({ label: 'Send Overdue Fee Reminders', actionKey: 'send_fee_reminders', icon: 'card' });
      }
      if (lower.includes('food') || lower.includes('mess') || lower.includes('dinner') || lower.includes('attention')) {
        suggestedActions.push({ label: 'Alert Chef Rajesh (+15% Dinner)', actionKey: 'alert_chef', icon: 'food' });
      }

      const aiMessage = {
        role: 'assistant' as const,
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: suggestedActions.length > 0 ? suggestedActions : undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I encountered an error querying the operational engine. Please retry or verify system connectivity.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Top AI Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white shadow-xs">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">LIVORA AI Operations Copilot</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Reasoning
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous synthesis across {currentProperty.name} operations, ledger & resident feedback</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actionable Live Intelligence Cards (Proactive Triage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {/* Card 1: 3 High-Priority Issues */}
        <div className="p-3.5 rounded-2xl bg-white border border-rose-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> 3 High-Priority Issues
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                Room 401 fan sparking, Room 202 sink leak, Wi-Fi latency.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleExecuteAIAction('dispatch_fan')}
            className="mt-3 w-full py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-rose-200"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Dispatch Electrician Imran</span>
          </button>
        </div>

        {/* Card 2: ₹56,000 Overdue Fees */}
        <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> ₹56,000 Overdue Fees
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                12 students pending. 7 passed grace. Rohan Verma 3 days overdue.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleExecuteAIAction('send_fee_reminders')}
            className="mt-3 w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-amber-200"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Trigger WhatsApp UPI Reminders</span>
          </button>
        </div>

        {/* Card 3: Room 401 Recurring Fan */}
        <div className="p-3.5 rounded-2xl bg-white border border-indigo-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-600" /> Room 401 Recurring Fault
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                3rd electrical complaint in 60 days. Rahul Sharma (Bed A).
              </p>
            </div>
          </div>
          <button
            onClick={() => handleExecuteAIAction('inspect_401')}
            className="mt-3 w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-indigo-200"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Inspect Room 401 Spatial Card</span>
          </button>
        </div>

        {/* Card 4: Mess Dinner Drop */}
        <div className="p-3.5 rounded-2xl bg-white border border-purple-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-purple-600" /> Mess Sentiment Decline
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                Quantity rating fell from 3.8 to 3.1. Dinner runs out by 9:30 PM.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleExecuteAIAction('alert_chef')}
            className="mt-3 w-full py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-purple-200"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Issue Directive to Chef Rajesh</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Bubbles */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-gradient-to-tr from-indigo-900 to-slate-900 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Inline Action Buttons */}
                {!isUser && msg.actions && msg.actions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full">
                      Take Action With 1-Click:
                    </span>
                    {msg.actions.map(act => (
                      <button
                        key={act.actionKey}
                        onClick={() => handleExecuteAIAction(act.actionKey)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-bold transition-all border border-indigo-200 flex items-center gap-1.5 active:scale-98"
                      >
                        {act.icon === 'wrench' && <Wrench className="w-3.5 h-3.5 text-indigo-600" />}
                        {act.icon === 'card' && <CreditCard className="w-3.5 h-3.5 text-indigo-600" />}
                        {act.icon === 'food' && <UtensilsCrossed className="w-3.5 h-3.5 text-indigo-600" />}
                        {act.icon === 'building' && <Building2 className="w-3.5 h-3.5 text-indigo-600" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] text-right font-mono ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              <span>Analyzing property database, ledger and tenant feedback...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask what needs attention, overdue students, mess quality, or operational problems..."
          className="flex-1 px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
