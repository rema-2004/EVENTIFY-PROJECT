# Frontend-Eventifiy

الفرونت إند الخاص بمشروع EVENTIFY — صفحات HTML/CSS/JS ثابتة (بدون framework)، مقسّمة حسب الفئة (Role) اللي بتستخدم كل قسم. كل الصفحات بتشترك بنفس نظام التصميم (`assets/css/theme.css` + `assets/js/theme.js`) عشان يضمن اتساق الشكل بين كل الأقسام (وضع فاتح/داكن، ألوان، خطوط... إلخ).

## بنية المجلدات

| المجلد | الفئة المستهدفة | الوصف |
|---|---|---|
| [The Visitor/](The%20Visitor/) | زائر غير مسجّل | صفحات تسويقية عامة (Landing, About, Contact...) قبل تسجيل الدخول |
| [auth/](auth/) | كل الفئات | تسجيل دخول / إنشاء حساب / التحقق من الجهات المنظمة |
| [app/](app/) | الطالب / المشارك | الصفحات اللي يستخدمها المشارك بعد تسجيل الدخول (تصفح، تقديم، فرق...) |
| [org/](org/) | الجهة المنظّمة (Organization) | لوحة تحكم الجهات المنظمة لنشر وإدارة الفعاليات |
| [admin/](admin/) | مدير المنصة (Admin) | لوحة تحكم إدارة المنصة بالكامل |
| [assets/](assets/) | مشترك بين الكل | ملفات CSS/JS/خطوط/صور مشتركة بين كل الصفحات |

---

## The Visitor/ — صفحات الزائر (قبل تسجيل الدخول)

| الصفحة | الهدف |
|---|---|
| [landing.html](The%20Visitor/landing.html) | الصفحة الرئيسية (Homepage) اللي بتعرّف بالمنصة وتشرح ميزة "رفيق" (Rafeeq AI) وتدعو الزائر للتسجيل |
| [about.html](The%20Visitor/about.html) | صفحة "من نحن" — تعريف بالمشروع وفريق العمل |
| [contact.html](The%20Visitor/contact.html) | صفحة تواصل معنا (نموذج تواصل / معلومات التواصل) |
| [404.html](The%20Visitor/404.html) | صفحة الخطأ لما يفتح المستخدم رابط غير موجود |

## auth/ — تسجيل الدخول والتحقق (لكل الفئات)

| الصفحة | الهدف |
|---|---|
| [login.html](auth/login.html) | تسجيل الدخول لأي مستخدم (طالب / جهة منظمة / أدمن) |
| [signup.html](auth/signup.html) | إنشاء حساب جديد |
| [forgot-password.html](auth/forgot-password.html) | استرجاع/إعادة تعيين كلمة المرور |
| [organization-verification.html](auth/organization-verification.html) | نموذج تقديم بيانات التحقق للجهة المنظمة الجديدة (وثائق، معلومات الجهة...) |
| [organization-pending.html](auth/organization-pending.html) | صفحة انتظار بعد إنشاء حساب جهة منظمة، لحين موافقة الأدمن |
| [privacy.html](auth/privacy.html) | سياسة الخصوصية |
| [terms.html](auth/terms.html) | الشروط والأحكام |

## app/ — صفحات المشارك/الطالب (بعد تسجيل الدخول)

| الصفحة | الهدف |
|---|---|
| [index.html](app/index.html) | الصفحة الرئيسية للمشارك بعد الدخول (لوحة استكشاف رئيسية) |
| [explore.html](app/explore.html) | تصفح والبحث عن الفرص (مسابقات، ورش، تدريب...) مع فلترة |
| [opportunity.html](app/opportunity.html) | صفحة تفاصيل فرصة/فعالية محددة (وصف، شروط، نسبة التطابق AI) |
| [participation-type.html](app/participation-type.html) | اختيار نوع المشاركة (فردي أو ضمن فريق) قبل التسجيل بفرصة |
| [create-team.html](app/create-team.html) | إنشاء فريق جديد للمشاركة بفعالية جماعية |
| [teams.html](app/teams.html) | عرض الفرق المتاحة للانضمام إليها |
| [team-dashboard.html](app/team-dashboard.html) | لوحة تحكم قائد الفريق (إدارة الأعضاء والمهام) |
| [registration-success.html](app/registration-success.html) | صفحة تأكيد نجاح التسجيل/التقديم على فرصة |
| [my-applications.html](app/my-applications.html) | متابعة الفرص/الفعاليات اللي قدّم عليها المستخدم وحالتها |
| [saved.html](app/saved.html) | الفرص المحفوظة (Bookmarks) من قبل المستخدم |
| [posts.html](app/posts.html) | تغذية منشورات/تحديثات من الجهات المنظمة |
| [notifications.html](app/notifications.html) | إشعارات المستخدم |
| [profile.html](app/profile.html) | الملف الشخصي للمستخدم (مهارات، دورات، سجل مشاركات) |
| [rafeeq.html](app/rafeeq.html) | واجهة المساعد الذكي "رفيق" (Rafeeq AI) اللي بيحلل التطابق بين ملف المستخدم والفرص |

## org/ — لوحة تحكم الجهة المنظمة

| الصفحة | الهدف |
|---|---|
| [org-dashboard.html](org/org-dashboard.html) | نظرة عامة على أداء الجهة المنظمة (إحصائيات، آخر النشاطات) |
| [org-create-event.html](org/org-create-event.html) | معالج (Wizard) متعدد الخطوات لإنشاء فعالية/فرصة جديدة |
| [org-opportunities.html](org/org-opportunities.html) | إدارة الفعاليات/الفرص اللي نشرتها الجهة المنظمة |
| [org-applicants.html](org/org-applicants.html) | مراجعة المتقدمين على فعاليات الجهة المنظمة |
| [org-posts.html](org/org-posts.html) | إدارة منشورات/تحديثات الجهة المنظمة |
| [org-profile.html](org/org-profile.html) | الملف التعريفي العام للجهة المنظمة |
| [org-report-center.html](org/org-report-center.html) | إنشاء وعرض تقارير خاصة بالجهة المنظمة (تسجيلات، مشاركة، أداء الفعاليات) |
| [org-settings.html](org/org-settings.html) | إعدادات حساب الجهة المنظمة |

## admin/ — لوحة تحكم إدارة المنصة

| الصفحة | الهدف |
|---|---|
| [admin-dashboard.html](admin/admin-dashboard.html) | نظرة عامة على المنصة بالكامل (إحصائيات شاملة) |
| [admin-events.html](admin/admin-events.html) | مراجعة الفعاليات المقدّمة من الجهات المنظمة والموافقة عليها/رفضها |
| [admin-event-review-details.html](admin/admin-event-review-details.html) | تفاصيل مراجعة فعالية واحدة قبل قرار القبول/الرفض |
| [admin-users.html](admin/admin-users.html) | إدارة حسابات المستخدمين (المشاركين) على المنصة |
| [admin-verify-organizations.html](admin/admin-verify-organizations.html) | مراجعة طلبات توثيق الجهات المنظمة الجديدة والموافقة عليها |
| [admin-categories.html](admin/admin-categories.html) | إدارة تصنيفات/فئات الفعاليات على المنصة |
| [admin-reports.html](admin/admin-reports.html) | إنشاء وعرض تقارير شاملة على مستوى المنصة (مستخدمين، فعاليات، جهات منظمة...) |
| [admin-audit-log.html](admin/admin-audit-log.html) | سجل تدقيق (Audit Log) لكل العمليات الحساسة اللي تصير على المنصة |

## assets/ — الموارد المشتركة

| المجلد | المحتوى |
|---|---|
| [assets/css/](assets/css/) | `theme.css` — نظام التصميم الموحّد (الألوان، الخطوط، المسافات، الوضع الداكن) المستخدم بكل الصفحات |
| [assets/js/](assets/js/) | سكربتات مشتركة: `theme.js` (تبديل الوضع الفاتح/الداكن)، `ui-state.js`، `motion.js`، `tw-config.js` (إعدادات Tailwind) وغيرها |
| [assets/fonts/](assets/fonts/) | خطوط المشروع (بما فيها أيقونات Material Symbols) |
| [assets/images/](assets/images/) | الصور الثابتة المستخدمة بالصفحات (شعار، صور توضيحية...) |
