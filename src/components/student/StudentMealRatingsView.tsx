import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon, 
  Send,
  Award,
  Sparkles
} from 'lucide-react';

interface MealFeedbackItem {
  id: string;
  meal: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  date: string;
  rating: number;
  tags: string[];
  comment: string;
  chefResponse?: string;
}

export const StudentMealRatingsView: React.FC = () => {
  const { showToast } = useApp();

  const [activeMeal, setActiveMeal] = useState<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'>('Lunch');
  const [rating, setRating] = useState<number>(4);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fresh & Hot', 'Balanced Flavor']);

  const [recentReviews, setRecentReviews] = useState<MealFeedbackItem[]>([
    {
      id: 'r-1',
      meal: 'Breakfast',
      date: 'Today, 8:45 AM',
      rating: 5,
      tags: ['Crispy Dosa', 'Tasty Sambar'],
      comment: 'The masala dosa was exceptional today! Warm and crisp with fresh coconut chutney.',
      chefResponse: 'Thank you Rahul! Chef Ramesh and team appreciate your feedback.'
    },
    {
      id: 'r-2',
      meal: 'Dinner',
      date: 'Yesterday, 9:15 PM',
      rating: 4,
      tags: ['Good Dal Makhani', 'Soft Roti'],
      comment: 'Dinner was very satisfying. The paneer gravy had great consistency.',
    },
    {
      id: 'r-3',
      meal: 'Lunch',
      date: 'Yesterday, 1:30 PM',
      rating: 3,
      tags: ['Slightly Salty'],
      comment: 'The dal was slightly on the saltier side, though the jeera rice was cooked perfectly.',
      chefResponse: 'Noted! We have calibrated the salt ratios with the kitchen staff.'
    }
  ]);

  const tagOptions = [
    'Fresh & Hot', 
    'Balanced Flavor', 
    'Generous Portion', 
    'Soft Rotis', 
    'Need More Spice', 
    'Too Spicy', 
    'Crispy', 
    'Healthy & Light'
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Rating Required', 'Please tap a star to give a rating.', 'error');
      return;
    }

    const newReview: MealFeedbackItem = {
      id: `r-${Date.now()}`,
      meal: activeMeal,
      date: 'Just now',
      rating,
      tags: selectedTags,
      comment: comment.trim() || 'Rating submitted without notes.'
    };

    setRecentReviews([newReview, ...recentReviews]);
    setComment('');
    setSelectedTags(['Fresh & Hot']);
    showToast('Feedback Recorded', `Thank you! Your ${activeMeal} rating (${rating}/5) has been submitted to the mess team.`, 'success');
  };

  const getMealIcon = (m: string) => {
    switch (m) {
      case 'Breakfast': return Coffee;
      case 'Lunch': return Sun;
      case 'Snacks': return Sunset;
      case 'Dinner': return Moon;
      default: return Coffee;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Award className="w-3.5 h-3.5" />
              Resident Dining Voice
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Meal Ratings & Feedback</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Rate every meal to help our kitchen crew calibrate taste, portion sizes, and weekly menus. High quality feedback directly rewards kitchen staff!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-center shrink-0">
            <p className="text-xs text-slate-300 font-medium">Weekly Mess Rating</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-3xl font-extrabold text-teal-300">4.6</span>
              <span className="text-sm text-slate-300">/ 5.0</span>
            </div>
            <p className="text-[11px] text-teal-200 mt-0.5">Based on 148 resident ratings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Submission Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Rate Today's Meal</h2>
              <p className="text-xs text-slate-500">Select the meal slot you'd like to review</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Live Session
            </span>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-5">
            {/* Meal Slot Picker */}
            <div className="grid grid-cols-4 gap-2">
              {(['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const).map((m) => {
                const Icon = getMealIcon(m);
                const isSelected = activeMeal === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setActiveMeal(m)}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span>{m}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Star Rating */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Overall Satisfaction</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 focus:outline-hidden hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        star <= rating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {rating === 5 && 'Outstanding! Loved everything.'}
                {rating === 4 && 'Good quality and tasty.'}
                {rating === 3 && 'Average, acceptable standard.'}
                {rating === 2 && 'Below average, needs tuning.'}
                {rating === 1 && 'Poor, requires immediate attention.'}
              </p>
            </div>

            {/* Quick Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">What went well or could improve?</label>
              <div className="flex flex-wrap gap-1.5">
                {tagOptions.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                        isChecked
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Comment Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chef & Mess Committee Notes</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share specific suggestions, seasoning preferences, or appreciation..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-teal-400" />
              <span>Submit Meal Rating</span>
            </button>
          </form>
        </div>

        {/* Recent Meal History */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Feedback History</h2>
            <span className="text-xs text-slate-500">{recentReviews.length} records</span>
          </div>

          <div className="space-y-3">
            {recentReviews.map((item) => {
              const Icon = getMealIcon(item.meal);
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.meal}</h4>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-800">{item.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    "{item.comment}"
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>

                  {item.chefResponse && (
                    <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-3 text-xs text-teal-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Chef Reply: </span>
                        <span>{item.chefResponse}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
