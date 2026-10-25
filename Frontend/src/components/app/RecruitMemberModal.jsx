import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const SUGGESTED_CANDIDATES = [
  {
    id: 101,
    name: { en: 'Tariq Mansoor', ar: 'طارق منصور' },
    role: { en: 'Senior UI/UX & Product Designer', ar: 'مصمم واجهات وتجربة مستخدم' },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    match: '98%',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Mobile UI'],
    email: 'tariq.m@eventify.com',
  },
  {
    id: 102,
    name: { en: 'Mariam Al-Ahmad', ar: 'مريم الأحمد' },
    role: { en: 'Product Designer & Prototyper', ar: 'مصممة منتجات ونماذج أولية' },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    match: '94%',
    skills: ['Figma', 'Wireframing', 'User Testing', 'Tailwind'],
    email: 'mariam.ahmad@eventify.com',
  },
  {
    id: 103,
    name: { en: 'Omar Ziad', ar: 'عمر زياد' },
    role: { en: 'Frontend & UI Developer', ar: 'مطور واجهات أمامية ومصمم' },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    match: '90%',
    skills: ['React', 'Figma', 'UI Design', 'CSS Animation'],
    email: 'omar.z@eventify.com',
  },
  {
    id: 104,
    name: { en: 'Laila Kassem', ar: 'ليلى قاسم' },
    role: { en: 'Data Engineer & Analyst', ar: 'مهندسة بيانات ومحللة نظم' },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    match: '89%',
    skills: ['Python', 'SQL', 'Data Pipelines', 'ETL'],
    email: 'laila.k@eventify.com',
  },
];

export default function RecruitMemberModal({
  isOpen,
  onClose,
  vacantRoles = [{ en: 'Product Design', ar: 'تصميم المنتج' }],
  teamName = 'AI Pioneers',
  maxMembers = 6,
  currentMemberCount = 4,
  pendingInvitesCount = 0,
  onInviteSent,
  onVacancyPublished,
}) {
  const { language } = useLanguage();
  const ar = language === 'ar';

  const defaultRole = ar ? (vacantRoles[0]?.ar || 'تصميم المنتج') : (vacantRoles[0]?.en || 'Product Design');
  
  // Real remaining available slots based on team limit (6) minus members (4) minus pending invites
  const totalOpenSlots = Math.max(0, maxMembers - currentMemberCount - pendingInvitesCount);

  // Mode: 'by-name' | 'public'
  const [method, setMethod] = useState('by-name');

  // Multi-invite list: [{ id, name, role, email, avatar }]
  const [selectedList, setSelectedList] = useState([]);

  // Search & custom inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [customNameInput, setCustomNameInput] = useState('');
  const [customRoleInput, setCustomRoleInput] = useState(defaultRole);
  const [customEmailInput, setCustomEmailInput] = useState('');

  // Public vacancy state: multiple roles support
  const [vacancyCount, setVacancyCount] = useState(Math.min(totalOpenSlots, Math.max(1, vacantRoles.length)));
  const [vacancyRole, setVacancyRole] = useState(defaultRole);
  const [vacancySkills, setVacancySkills] = useState('Figma, React, Python, Data Engineering');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return SUGGESTED_CANDIDATES;
    const q = searchQuery.toLowerCase().trim();
    return SUGGESTED_CANDIDATES.filter(
      (c) =>
        c.name.ar.toLowerCase().includes(q) ||
        c.name.en.toLowerCase().includes(q) ||
        c.role.ar.toLowerCase().includes(q) ||
        c.role.en.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  // Toggle selection of a suggested candidate
  const toggleCandidate = (cand) => {
    const exists = selectedList.some((item) => item.id === cand.id);
    if (exists) {
      setSelectedList((prev) => prev.filter((item) => item.id !== cand.id));
      setWarningMessage(null);
    } else {
      if (totalOpenSlots === 0) {
        setWarningMessage(
          ar
            ? `لا يمكن دعوة أعضاء إضافيين: وصل الفريق للحد الأقصى (${maxMembers} أعضاء ودعوات معلقة).`
            : `Cannot invite more members: Team reached maximum capacity (${maxMembers}).`
        );
        setTimeout(() => setWarningMessage(null), 5000);
        return;
      }
      if (selectedList.length >= totalOpenSlots) {
        setWarningMessage(
          ar
            ? `لا يمكنك دعوة أكثر من ${totalOpenSlots} (المتبقي ${totalOpenSlots} مقعد فقط لتصل للحد الأقصى ${maxMembers}).`
            : `You can only invite up to ${totalOpenSlots} member(s) (remaining slots out of ${maxMembers}).`
        );
        setTimeout(() => setWarningMessage(null), 5000);
        return;
      }
      setSelectedList((prev) => [
        ...prev,
        {
          id: cand.id,
          name: ar ? cand.name.ar : cand.name.en,
          role: ar ? cand.role.ar : cand.role.en,
          email: cand.email,
          avatar: cand.avatar,
        },
      ]);
      setWarningMessage(null);
    }
  };

  // Add custom member to the list
  const addCustomMember = () => {
    const name = customNameInput.trim();
    if (!name) return;

    if (totalOpenSlots === 0) {
      setWarningMessage(
        ar
          ? `لا يمكن دعوة أعضاء إضافيين: وصل الفريق للحد الأقصى (${maxMembers} أعضاء ودعوات معلقة).`
          : `Cannot invite more members: Team reached maximum capacity (${maxMembers}).`
      );
      setTimeout(() => setWarningMessage(null), 5000);
      return;
    }

    if (selectedList.length >= totalOpenSlots) {
      setWarningMessage(
        ar
          ? `تم بلوغ الحد الأقصى للمقاعد المتاحة (${totalOpenSlots} من أصل ${maxMembers}).`
          : `Maximum vacant slots reached (${totalOpenSlots} out of ${maxMembers}).`
      );
      setTimeout(() => setWarningMessage(null), 5000);
      return;
    }

    const newCustom = {
      id: 'custom-' + Date.now(),
      name,
      role: customRoleInput || defaultRole,
      email: customEmailInput.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@eventify.com`,
      avatar: null,
    };

    setSelectedList((prev) => [...prev, newCustom]);
    setCustomNameInput('');
    setCustomEmailInput('');
  };

  // Remove a member from the invite list
  const removeFromList = (id) => {
    setSelectedList((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle Multi-Invite Submit
  const handleSendMultiInvites = (e) => {
    e.preventDefault();
    if (selectedList.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const newInvites = selectedList.map((item) => ({
        ...item,
        date: new Date().toLocaleDateString(ar ? 'ar-JO' : 'en-US'),
      }));

      try {
        const current = JSON.parse(localStorage.getItem('eventify:pending-invites') || '[]');
        const updated = [...current, ...newInvites];
        localStorage.setItem('eventify:pending-invites', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      if (onInviteSent) onInviteSent(newInvites);
      onClose();
    }, 700);
  };

  // Handle Public Vacancies Publish
  const handlePublishPublic = (e) => {
    e.preventDefault();
    if (!vacancyRole.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const pubData = {
        active: true,
        role: vacancyRole,
        count: vacancyCount,
        skills: vacancySkills,
        teamName,
        date: new Date().toISOString(),
      };

      try {
        localStorage.setItem('eventify:team-recruiting', JSON.stringify(pubData));
      } catch (err) {
        console.error(err);
      }

      if (onVacancyPublished) onVacancyPublished(pubData);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        dir={ar ? 'rtl' : 'ltr'}
        className="relative w-full max-w-xl my-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2E] animate-pulse"></span>
              <span className="text-xs font-bold text-[#FF4D2E] uppercase tracking-wider">
                {ar ? `تعويض الشواغر (${totalOpenSlots} مقاعد متاحة)` : `Fill Vacancies (${totalOpenSlots} Open Slots)`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {ar ? 'إضافة أو دعوة أعضاء للفريق' : 'Add or Invite Team Members'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {ar
                ? `يمكنك دعوة عدة أعضاء معاً دفعة واحدة لسد المقاعد الشاغرة في فريق ${teamName}.`
                : `You can invite multiple members at once to fill open team spots.`}
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

        {/* Warning Notification Banner */}
        {warningMessage && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between animate-fade-in my-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-base shrink-0">warning</span>
              <span className="font-medium leading-relaxed">{warningMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setWarningMessage(null)}
              className="text-amber-600 hover:text-amber-800 p-1 shrink-0"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl my-6">
          <button
            type="button"
            onClick={() => setMethod('by-name')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              method === 'by-name'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-lg">group_add</span>
            <span>{ar ? 'إضافة بالاسم (متعدد)' : 'Invite by Name (Multi)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('public')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              method === 'public'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-lg">campaign</span>
            <span>{ar ? 'نشر شواغر عامة' : 'Post Vacancies'}</span>
          </button>
        </div>

        {/* ================= TAB 1: MULTI-INVITE BY NAME ================= */}
        {method === 'by-name' && (
          <form onSubmit={handleSendMultiInvites} className="space-y-4">
            
            {/* Selected Members Chips Bar */}
            {selectedList.length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {ar
                      ? `الأعضاء المختارون للدعوة (${selectedList.length} من ${totalOpenSlots}):`
                      : `Selected to invite (${selectedList.length}/${totalOpenSlots}):`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedList([])}
                    className="text-[11px] font-semibold text-rose-500 hover:underline"
                  >
                    {ar ? 'مسح الكل' : 'Clear all'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedList.map((item) => (
                    <div
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF4D2E]/10 text-[#FF4D2E] border border-[#FF4D2E]/20"
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] opacity-75">({item.role})</span>
                      <button
                        type="button"
                        onClick={() => removeFromList(item.id)}
                        className="hover:text-red-700"
                      >
                        <span className="material-symbols-outlined text-sm leading-none">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {ar ? 'اختر شخصاً أو أكثر من المقترحين بالمنصة:' : 'Pick one or more suggested candidates:'}
              </label>
              <div className="relative">
                <span
                  className={`material-symbols-outlined absolute ${
                    ar ? 'right-3' : 'left-3'
                  } top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none`}
                >
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ar ? 'ابحث بالاسم، التخصص أو الإيميل...' : 'Search by name, role or email...'}
                  className={`w-full py-2.5 ${
                    ar ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'
                  } text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#FF4D2E] focus:outline-none transition-all`}
                />
              </div>
            </div>

            {/* Suggestions Checklist */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {filteredCandidates.map((cand) => {
                const isSelected = selectedList.some((item) => item.id === cand.id);
                return (
                  <div
                    key={cand.id}
                    onClick={() => toggleCandidate(cand)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#FF4D2E] bg-[#FF4D2E]/5 shadow-sm'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-[#FF4D2E]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={cand.avatar}
                        alt={cand.name.en}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {ar ? cand.name.ar : cand.name.en}
                          </p>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                            {cand.match}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {ar ? cand.role.ar : cand.role.en}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isSelected ? 'text-[#FF4D2E]' : 'text-slate-300'
                      }`}
                    >
                      {isSelected ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Person Manually */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {ar ? 'أو أضف شخصاً يدوياً بالاسم إلى قائمة الدعوات:' : 'Or manually add someone by name:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder={ar ? 'اسم العضو (مثال: أحمد خالد)' : 'Member Name'}
                  className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#FF4D2E] focus:outline-none"
                />
                <input
                  type="text"
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  placeholder={ar ? 'الدور' : 'Role'}
                  className="w-32 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#FF4D2E] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomMember}
                  disabled={!customNameInput.trim()}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 transition-colors disabled:opacity-40"
                >
                  {ar ? '+ إضافة' : '+ Add'}
                </button>
              </div>
            </div>

            {/* Submit Multi-Invites */}
            <div className="flex gap-2.5 pt-3">
              <button
                type="submit"
                disabled={isSubmitting || selectedList.length === 0}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#FF4D2E] hover:bg-[#e03d20] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">
                      progress_activity
                    </span>
                    <span>{ar ? 'جاري الإرسال...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>
                      {selectedList.length > 0
                        ? ar
                          ? `إرسال (${selectedList.length}) دعوات انضمام دفعة واحدة`
                          : `Send (${selectedList.length}) Invitations`
                        : ar
                        ? 'اختر عضواً على الأقل للإرسال'
                        : 'Select at least one member'}
                    </span>
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

        {/* ================= TAB 2: MULTI-VACANCY PUBLIC POST ================= */}
        {method === 'public' && (
          <form onSubmit={handlePublishPublic} className="space-y-4">
            
            {/* Number of Vacancies Counter */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {ar ? 'عدد الأعضاء المطلوبين:' : 'Number of members needed:'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {ar ? `المقاعد المتاحة بفريقك: ${totalOpenSlots}` : `Total open slots: ${totalOpenSlots}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVacancyCount((c) => Math.max(1, c - 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-sm flex items-center justify-center hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-sm text-[#FF4D2E]">
                  {vacancyCount}
                </span>
                <button
                  type="button"
                  onClick={() => setVacancyCount((c) => Math.min(totalOpenSlots, c + 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-sm flex items-center justify-center hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {ar ? 'الأدوار والتخصصات المطلوبة:' : 'Roles & Specializations:'}
              </label>
              <input
                type="text"
                value={vacancyRole}
                onChange={(e) => setVacancyRole(e.target.value)}
                placeholder="UI/UX Designer, Data Engineer, Frontend..."
                className="w-full py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#FF4D2E] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {ar ? 'المهارات المطلوبة للمقاعد الشاغرة:' : 'Required Skills for Vacancies:'}
              </label>
              <input
                type="text"
                value={vacancySkills}
                onChange={(e) => setVacancySkills(e.target.value)}
                placeholder="Figma, React, Python, Cloud..."
                className="w-full py-2.5 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#FF4D2E] focus:outline-none"
                required
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FF4D2E]/5 border border-[#FF4D2E]/15 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#FF4D2E] text-lg shrink-0 mt-0.5">
                campaign
              </span>
              <p className="leading-relaxed">
                {ar
                  ? `سيتم نشر إعلان يطلب (${vacancyCount}) أعضاء لفريق ${teamName} على صفحة Explore ومطابقة المتقدمين تلقائياً.`
                  : `Publishing a vacancy for (${vacancyCount}) members on the Explore page.`}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !vacancyRole.trim()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#FF4D2E] hover:bg-[#e03d20] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">
                      progress_activity
                    </span>
                    <span>{ar ? 'جاري النشر...' : 'Publishing...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">publish</span>
                    <span>
                      {ar
                        ? `نشر (${vacancyCount}) شواغر بنقرة واحدة`
                        : `Publish (${vacancyCount}) Vacancies`}
                    </span>
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
      </div>
    </div>
  );
}
