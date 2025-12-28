# دليل الحصول على مفاتيح الربط (API Keys)

لكي يعمل تسجيل الدخول عبر Google وإرسال الإيميلات، تحتاج إلى هذه المفاتيح. لا يمكنني إنشاؤها لك لأنها تتطلب حسابك الخاص.

## 1. مفاتيح Google (للدخول عبر جوجل)
1. اذهب إلى: [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروعاً جديداً (New Project).
3. ابحث عن **"OAuth consent screen"**:
   - اختر **External**.
   - أدخل اسم التطبيق (Koky) وإيميلك.
4. ابحث عن **"Credentials"** -> **Create Credentials** -> **OAuth Client ID**.
   - Application type: **Web application**.
   - **Authorized redirect URIs** (مهم جداً):
     - `https://koky-project-op1a.vercel.app/api/auth/callback/google`
5. سيعطيك رمزين:
   - **Client ID** (انسخه).
   - **Client Secret** (انسخه).

---

## 2. مفتاح Resend (لإرسال الإيميلات)
1. سجل في موقع: [Resend.com](https://resend.com)
2. اضغط **Add API Key**.
3. أعطه اسماً (مثلاً: Koky).
4. انسخ المفتاح الذي يبدأ بـ `re_...`.

---

## 3. أين تضع هذه المفاتيح؟
اذهب إلى **Vercel** -> **Settings** -> **Environment Variables** وأضف التالي:

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | (الرمز الأول من جوجل) |
| `GOOGLE_CLIENT_SECRET` | (الرمز الثاني من جوجل) |
| `RESEND_API_KEY` | (رمز Resend) |
| `AUTH_SECRET` | `nt8Z33pDWHXYfCcZ0+6VYCUOsO2thqAC8WBhkn7CyHQ=` |

بعد إضافتهم، لا تنسَ عمل **Redeploy** للمشروع في Vercel.
