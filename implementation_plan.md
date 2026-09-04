# توحيد الهوية البصرية وتفاعل الواجهة

## Goal Description
تحسين تماسك التصميم ووظائف الأزرار عبر جميع صفحات المشروع دون تعديل البنية الحالية أو إضافة back‑end وهمي. سيتم توحيد الألوان، الخطوط، الـ buttons، الـ cards، الـ spacing، الـ border‑radius والـ typography بين `index.html` و `landing.html`، وتحديث الـ Navigation في قسم `app`، إضافة تفاعلات بصرية للأزرار، تحسين واجهة رفيق (Companion)، توحيد صفحات `org` و `admin`، وإضافة مؤشرات للـ Demo.

## User Review Required

> [!IMPORTANT]
> تأكيد ما إذا كان يجب إضافة متغيّر CSS جديد للـ accent الخاص بـ Admin (`--accent-admin`) أو استخدام لون موجود حاليًا.

> [!WARNING]
> بعض الروابط في الـ footer غير موجودة؛ سيتم إخفاؤها مؤقتًا. إذا كان هناك روابط تحتاج لإبقائها، يرجى إبلاغنا.

## Open Questions
- هل تفضّل استخدام اللون `#D6336C` كـ accent للـ Admin أم لون آخر موجود في ملفات الـ CSS؟
- أي نصوص تجريبية (Demo) تريد إظهارها في صفحة رفيق بالتحديد؟

## Proposed Changes
---
### Home Pages (index.html, landing.html)
- توحيد المتغيّرات في `:root` لتشمل ألوان مشتركة (`--primary`, `--secondary`, `--radius`, إلخ) في ملف CSS مركزي `frontend-eventifiy/assets/css/theme.css`.
- تحديث الـ `<link>` لاستدعاء ملف الـ CSS الجديد في كلا الصفحتين.
- تعديل الـ buttons لتستخدم فئة `.btn-primary` مع hover/active effects.
- تعديل الـ cards لإستخدام فئة `.card` موحدة (border‑radius, shadow, spacing).
- مراجعة الـ typography لتستخدم خط `Inter` فقط.

---
### App Section Navigation
- إنشاء ملف `app/nav.css` و `app/nav.js` لتوحيد Sidebar و Bottom Navigation.
- إضافة الـ Sidebar/Header إلى `app/saved.html` و `app/companion.html`.
- تحديث جميع صفحات الـ app لاستيراد `nav.css` و `nav.js`.
- ضمان استجابة التصميم عبر media queries (desktop, tablet, mobile).

---
### Button Interactions (UI State)
- إضافة سكريبت `ui-state.js` لتعامل مع أحداث النقر على الأزرار:
  - "احفظ لوقت لاحق"
  - "قبول طلب الانضمام"
  - "رفض طلب الانضمام"
  - أزرار مشابهة.
- تغيير مظهر الزر بعد الضغط (تغيير اللون/الظل) وتخزين الحالة في `localStorage` إذا رغبت.
- عرض Toast/Alert لتأكيد العملية.

---
### Companion (Rafeeq) Demo Indicator
- تعديل `app/companion.html` لإضافة badge أو نص صغر `Demo` فوق نافذة الدردشة.
- استخدام فئة `.demo-badge` بستايل خفيف (background rgba، border‑radius).

---
### Create Team Page
- توحيد ألوان، خطوط، أزرار، cards، inputs، spacing باستخدام الفئات المشتركة من `theme.css`.
- إضافة فئة `.input-primary` لتوحيد مظهر الحقول.

---
### Org Section
- **Applicant Details**: مراجعة `org/applicant-details.html` لضمان ظهور جميع البيانات (اسم، سيرة، ملفات، إلخ).
- توحيد Sidebar باستخدام `org/sidebar.css` لتطابق باقي صفحات Org.
- **Create Event Wizard**: تعديل `org/create-event.html` لتشمل ثلاث خطوات UI متتابعة عبر `event-wizard.js` مع حفظ البيانات في `localStorage` وعرضها في خطوة المراجعة.
- عند النقر على Publish، إظهار Toast نجاح.

---
### Admin Section
- إضافة تفاعلات بصريّة للأزرار (Approve, Reject, Suspend User, Verify Organization) عبر `admin/ui-actions.js`.
- تعديل صفحة Activity Log لإزالة النصوص التجريبية واستبدالها بأمثلة واقعية.
- مراجعة أرقام Analytics في `admin/analytics.html` لتصبح نسب منطقية وتحقق المجموع 100%.
- إضافة متغيّر `--accent-admin` وتطبيقه على header/sidebar لإبراز هوية الـ Admin.

---
### Final Polishing & Verification
- فحص جميع الروابط في الـ footer وإخفاء الروابط غير موجودة.
- تشغيل جميع ملفات HTML في المتصفح والتأكد من عدم وجود أخطاء JavaScript في الـ console.
- اختبار الـ responsive على أحجام شاشات مختلفة.
- اختبار الـ accessibility (ARIA labels, focus states).

## Verification Plan
### Automated Tests
- لا توجد اختبارات وحدة في المشروع؛ سيتم الاعتماد على فحص يدوي للـ console.

### Manual Verification
- فتح كل صفحة في متصفح (Chrome) وتأكيد:
  - تماسك الهوية البصرية.
  - عمل الـ navigation عبر جميع الصفحات.
  - ظهور تفاعل الأزرار وتخزين الحالة.
  - عدم وجود روابط ميتة في الـ footer.
  - عرض الـ Demo badge في صفحة رفيق.
  - توافر الـ Sidebar المتوحّد.
  - ألوان الـ Admin مميزة.
  - عدم ظهور أي أخطاء JS.
