import React, { useState, useRef, useEffect } from 'react'

const DEFAULT_QUICK_SKILLS = ['Python', 'UI/UX', 'AI']

const ALL_SKILLS_POOL = [
    'Python', 'UI/UX', 'AI', 'React', 'Node.js', 'Flutter',
    'AWS', 'Three.js', 'Data Viz', 'TypeScript', 'Docker',
    'Figma', 'Next.js', 'GraphQL', 'Machine Learning', 'Cybersecurity',
    'Mobile App Dev', 'Tailwind CSS', 'SQL', 'PHP', 'Laravel'
]

export default function SkillFilter({
    selectedSkills = [],
    onSkillsChange,
    quickSkills = DEFAULT_QUICK_SKILLS,
    availableSkills = ALL_SKILLS_POOL,
    ar = false,
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)

    // إغلاق عند النقر بالخارج أو زر Escape
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        function handleEscape(e) {
            if (e.key === 'Escape') setIsOpen(false)
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            onSkillsChange?.(selectedSkills.filter((s) => s !== skill))
        } else {
            onSkillsChange?.([...selectedSkills, skill])
        }
    }

    const removeSkill = (skill) => {
        onSkillsChange?.(selectedSkills.filter((s) => s !== skill))
    }

    // تصفية المهارات حسب البحث
    const filteredSkills = availableSkills.filter((skill) =>
        skill.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )

    const isAllActive = selectedSkills.length === 0

    return (
        <div className="relative flex flex-wrap items-center gap-2">
            
            {/* زر All Skills + البحث البسيط */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(!isOpen)
                        setSearchQuery('')
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border cursor-pointer select-none"
                    style={
                        isAllActive || isOpen
                            ? {
                                  backgroundColor: '#FF4D2E',
                                  color: '#ffffff',
                                  borderColor: '#FF4D2E',
                                  boxShadow: '0 2px 8px rgba(255, 77, 46, 0.25)',
                              }
                            : {
                                  backgroundColor: 'var(--color-surface-container-lowest)',
                                  borderColor: 'var(--color-outline-variant)',
                                  color: 'var(--color-on-surface)',
                              }
                    }
                >
                    {/* أيقونة الفلتر */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="6" y1="12" x2="18" y2="12" />
                        <line x1="10" y1="18" x2="14" y2="18" />
                    </svg>
                    <span>{ar ? 'كل المهارات' : 'All Skills'}</span>
                </button>

                {/* حقل البحث البسيط ونتائجه */}
                {isOpen && (
                    <div
                        className={`absolute top-full mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant p-2 z-[9999] ${
                            ar ? 'right-0 text-right' : 'left-0 text-left'
                        }`}
                        style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
                    >
                        {/* حقل البحث فقط */}
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={ar ? 'اكتب اسم المهارة...' : 'Type a skill...'}
                                className={`w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-[#FF4D2E] focus:bg-surface-container-lowest transition-all ${
                                    ar ? 'text-right' : 'text-left'
                                }`}
                            />
                        </div>

                        {/* قائمة النتائج السريعة */}
                        <div className="mt-1.5 max-h-48 overflow-y-auto space-y-0.5">
                            {filteredSkills.length > 0 ? (
                                filteredSkills.map((skill) => {
                                    const isSelected = selectedSkills.includes(skill)
                                    return (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => {
                                                toggleSkill(skill)
                                                setSearchQuery('')
                                                setIsOpen(false)
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                                                ar ? 'flex-row-reverse text-right' : 'text-left'
                                            } ${
                                                isSelected
                                                    ? 'bg-primary/10 text-[#FF4D2E] font-bold'
                                                    : 'text-on-surface hover:bg-surface-container'
                                            }`}
                                        >
                                            <span>{skill}</span>
                                            {isSelected && <span className="text-[#FF4D2E] font-bold">✓</span>}
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="py-3 text-center text-xs text-on-surface-variant">
                                    {ar ? 'لا توجد مهارة بهذا الاسم' : 'No skills found'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* أزرار الفلترة السريعة (Python, UI/UX, AI) */}
            {quickSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill)
                return (
                    <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="inline-flex items-center px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border cursor-pointer select-none"
                        style={
                            isSelected
                                ? {
                                      backgroundColor: '#FF4D2E',
                                      color: '#ffffff',
                                      borderColor: '#FF4D2E',
                                      boxShadow: '0 2px 8px rgba(255, 77, 46, 0.25)',
                                  }
                                : {
                                      backgroundColor: 'var(--color-surface-container-lowest)',
                                      borderColor: 'var(--color-outline-variant)',
                                      color: 'var(--color-on-surface)',
                                  }
                        }
                    >
                        {skill}
                    </button>
                )
            })}

            {/* المهارات المختارة كـ Tags صغيرة بجانب الأزرار */}
            {selectedSkills.map((skill) => (
                <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-[#FF4D2E] border border-primary/30"
                >
                    <span>{skill}</span>
                    <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="w-3.5 h-3.5 rounded-full hover:bg-primary/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </span>
            ))}
        </div>
    )
}
