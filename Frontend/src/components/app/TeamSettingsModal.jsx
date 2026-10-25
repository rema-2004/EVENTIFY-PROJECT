import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export default function TeamSettingsModal({
  isOpen,
  onClose,
  members = [],
  currentUserId = 1,
  teamName = 'AI Pioneers',
  competitionName = { en: 'Global AI Innovation Challenge', ar: 'تحدي الابتكار العالمي بالذكاء الاصطناعي' },
  onTransferLeadership,
  onUnregisterTeam,
}) {
  const { language } = useLanguage();
  const ar = language === 'ar';

  const [activeTab, setActiveTab] = useState('transfer'); // 'transfer' | 'general' | 'unregister'
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  if (!isOpen) return null;

  // Potential new leaders (all members except current user)
  const candidateMembers = members.filter((m) => m.id !== currentUserId);

  // Selected candidate object
  const selectedCandidate = candidateMembers.find(
    (m) => String(m.id) === String(selectedMemberId)
  );

  // Handle Transfer Leadership Submit
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onTransferLeadership) {
        onTransferLeadership(Number(selectedMemberId));
      }
      onClose();
    }, 700);
  };

  // Handle Leader Unregister Click
  const handleUnregisterClick = () => {
    // Condition 2: If there are other members in the team, BLOCK the leader!
    if (members.length > 1) {
      setShowBlockAlert(true);
    } else {
      // Leader is alone, allow normal unregistration
      setConfirmLeaveOpen(true);
    }
  };

  const handleConfirmLeave = () => {
    if (onUnregisterTeam) {
      onUnregisterTeam();
    }
    setConfirmLeaveOpen(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div
        dir={ar ? 'rtl' : 'ltr'}
        className="relative w-full max-w-xl my-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[#FF4D2E] text-xl">settings</span>
              <span className="text-xs font-bold text-[#FF4D2E] uppercase tracking-wider">
                {ar ? 'لوحة تحكم الفريق والمسابقة' : 'Team & Competition Settings'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {ar ? 'إعدادات الفريق وإدارة القيادة' : 'Team Settings & Leadership'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {ar
                ? `إدارة فريق "${teamName}" في ${typeof competitionName === 'object' ? (ar ? competitionName.ar : competitionName.en) : competitionName}.`
                : `Manage "${teamName}" in ${typeof competitionName === 'object' ? (ar ? competitionName.ar : competitionName.en) : competitionName}.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl my-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('transfer');
              setShowBlockAlert(false);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'transfer'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span>{ar ? 'نقل القيادة (Transfer)' : 'Transfer Leadership'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unregister')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'unregister'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>{ar ? 'إلغاء التسجيل / المغادرة' : 'Unregister / Leave'}</span>
          </button>
        </div>

        {/* ================= TAB 1: TRANSFER LEADERSHIP ================= */}
        {activeTab === 'transfer' && (
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">
                info
              </span>
              <p className="leading-relaxed">
                {ar
                  ? `بصفتك قائد الفريق الحالي، يمكنك نقل مسؤولية وصلاحيات القيادة إلى أي عضو من أعضاء فريقك (${candidateMembers.length} أعضاء متاحين). بعد التأكيد، ستتحول رتبتك إلى عضو عادي.`
                  : `As team leader, you can transfer full leadership to any current team member. Your role will change to regular member.`}
              </p>
            </div>

            {/* Member Selection Dropdown & Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {ar ? 'اختر القائد الجديد من قائمة أعضاء الفريق الحاليين:' : 'Select New Team Leader from Current Members:'}
              </label>

              {candidateMembers.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                  {ar
                    ? 'لا يوجد أعضاء آخرون في الفريق لنقل القيادة إليهم.'
                    : 'No other team members available to transfer leadership to.'}
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {candidateMembers.map((member) => {
                    const isSelected = String(selectedMemberId) === String(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMemberId(member.id)}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#FF4D2E] bg-[#FF4D2E]/5 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={member.img}
                            alt={typeof member.name === 'object' ? member.name.en : member.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {typeof member.name === 'object' ? (ar ? member.name.ar : member.name.en) : member.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {typeof member.role === 'object' ? (ar ? member.role.ar : member.role.en) : member.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[11px] font-bold text-[#FF4D2E] bg-[#FF4D2E]/10 px-2 py-0.5 rounded-full">
                              {ar ? 'القائد المختار' : 'Selected'}
                            </span>
                          )}
                          <span
                            className={`material-symbols-outlined text-xl ${
                              isSelected ? 'text-[#FF4D2E]' : 'text-slate-300'
                            }`}
                          >
                            {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Member Preview Alert */}
            {selectedCandidate && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                <span>
                  {ar
                    ? `سيتم تعيين "${typeof selectedCandidate.name === 'object' ? (ar ? selectedCandidate.name.ar : selectedCandidate.name.en) : selectedCandidate.name}" كقائد جديد لفريق ${teamName}.`
                    : `Will assign "${typeof selectedCandidate.name === 'object' ? selectedCandidate.name.en : selectedCandidate.name}" as the new leader.`}
                </span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex gap-2.5 pt-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedMemberId}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#FF4D2E] hover:bg-[#e03d20] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    <span>{ar ? 'جاري نقل القيادة للـ API...' : 'Transferring Leadership...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    <span>{ar ? 'تأكيد نقل القيادة (Confirm Transfer)' : 'Confirm Transfer'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {ar ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {/* ================= TAB 2: UNREGISTER / LEAVE TEAM ================= */}
        {activeTab === 'unregister' && (
          <div className="space-y-4">
            {/* Condition 2 Check: Show Warning if members > 1 */}
            {members.length > 1 ? (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-rose-600 text-2xl shrink-0 mt-0.5">
                    gpp_maybe
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200 mb-1">
                      {ar ? 'تنبيه: لا يمكنك إلغاء التسجيل أو المغادرة كقائد!' : 'Blocked: You cannot leave as leader!'}
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed mb-3">
                      {ar
                        ? `يوجد حالياً (${members.length}) أعضاء مسجلين في فريقك ضمن هذه المسابقة. حرصاً على استمرار الفريق، تمنع سياسة المنصة القائد من المغادرة إلا بعد تعيين قائد بديل من قائمة الأعضاء.`
                        : `There are currently (${members.length}) members in your team. Platform rules require appointing a replacement leader before you can leave.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('transfer')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">swap_horiz</span>
                      <span>{ar ? 'الذهاب لتعيين قائد جديد أولاً' : 'Transfer Leadership First'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed mb-3">
                  {ar
                    ? `أنت العضو الوحيد في الفريق حالياً (${members.length} عضو). عند تأكيد إلغاء التسجيل، سيتم حذف الفريق وإلغاء تسجيلك في هذه المسابقة بشكل طبيعي.`
                    : `You are the sole member in this team (${members.length} member). Confirming unregistration will cancel your registration.`}
                </p>
                <button
                  type="button"
                  onClick={handleUnregisterClick}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">delete_forever</span>
                  <span>{ar ? 'تأكيد إلغاء تسجيل الفريق' : 'Confirm Team Unregistration'}</span>
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {ar ? 'إغلاق الإعدادات' : 'Close Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Solo Unregister Confirmation Modal */}
      {confirmLeaveOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            dir={ar ? 'rtl' : 'ltr'}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              {ar ? 'تأكيد إلغاء تسجيل الفريق' : 'Confirm Team Unregistration'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              {ar
                ? 'هل أنت متأكد من رغبتك في إلغاء التسجيل؟ سيتم سحب مشاركتك في المسابقة بالكامل.'
                : 'Are you sure you want to cancel registration? Your participation will be withdrawn.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmLeave}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
              >
                {ar ? 'نعم، إلغاء التسجيل' : 'Yes, Unregister'}
              </button>
              <button
                onClick={() => setConfirmLeaveOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100"
              >
                {ar ? 'تراجع' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
