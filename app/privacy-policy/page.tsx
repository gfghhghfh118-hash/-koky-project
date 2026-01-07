
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Privacy Policy & Terms</h1>
                    <p className="text-slate-500">Legal Disclaimer</p>
                </div>

                <div className="space-y-6 text-right" dir="rtl">
                    <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">إخلاء مسؤولية قانوني</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                            أدمن والموقع غير مسؤول قانونياً عن أي شيء داخل الموقع. الموافقة على شروط الموقع تعني أنك موافق على أن الموقع غير مسؤول عن أي أموال داخل الموقع أو خارجه. هذا بنفس النص، والموقع أو الأدمن غير مسؤول عن أي شيء قانوني داخل أو خارج الموقع.
                        </p>
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        باستخدامك لهذا الموقع، فإنك تقر وتوافق على شروط الاستخدام المذكورة أعلاه.
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
