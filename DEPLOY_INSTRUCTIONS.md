# دليل النشر (Deployment Guide)

لجعل موقعك يعمل "أونلاين" بشكل دائم، قمنا بتحويل الإعدادات لتدعم قواعد البيانات السحابية.

## الخطوات المطلوبة منك الآن:

1. **الحصول على قاعدة بيانات (Database):**
   - أنصحك بموقع **[Neon.tech](https://neon.tech)** (مجاني وسهل).
   - سجل حساباً -> أنشئ مشروعاً جديداً (Create Project).
   - انسخ "Connection String" (الرابط الذي يبدأ بـ `postgresql://...`).

2. **ربط المشروع بـ Vercel:**
   - اذهب إلى **[Vercel.com](https://vercel.com)** وسجل بحساب GitHub الخاص بك.
   - اضغط **Add New Project** -> **Import** (اختر مشروع `koky-project` الذي رفعناه).
   - في صفحة الإعدادات (Configure Project)، انقر على **Environment Variables**.
   - أضف متغيراً جديداً:
     - **Name:** `DATABASE_URL`
     - **Value:** (الرابط الذي نسخته من Neon في الخطوة 1).
   - اضغط **Deploy**.

## ملاحظة هامة:
بعد النشر، سيقوم Vercel ببناء الموقع وتشغيله. لا تنسَ أنك تحتاج لتشغيل هذا الأمر في "Build settings" أو في الـ Console الخاص بـ Vercel لإنشاء الجداول:
`npx prisma db push`
(أو سيتم ذلك تلقائياً إذا أضفناه في سكريبت البناء).
