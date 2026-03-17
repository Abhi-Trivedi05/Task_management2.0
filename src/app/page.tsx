import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      
      {/* Decorative blurred circles behind the hero */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
      
      <div className="glass-card p-8 sm:p-16 max-w-4xl w-full mx-auto text-center border-white/60 relative z-10 transition-transform duration-700 hover:scale-[1.01]">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-primary-800 to-secondary-800">
          TaskFlow
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          The secure, full-stack task management workspace designed for modern productivity.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            href="/login" 
            className="btn-primary w-full sm:w-auto text-base"
          >
            Log in to Dashboard
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-slate-200/50 pt-10">
          <div className="flex flex-col gap-2 p-4 rounded-xl hover:bg-white/40 transition-colors">
            <ShieldCheck className="w-8 h-8 text-secondary-500 mb-2" />
            <h3 className="font-bold text-slate-900 text-lg">Secure by Default</h3>
            <p className="text-sm text-slate-600 leading-relaxed">AES encryption & HttpOnly JWT handling for maximum data protection.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl hover:bg-white/40 transition-colors">
            <CheckCircle2 className="w-8 h-8 text-primary-500 mb-2" />
            <h3 className="font-bold text-slate-900 text-lg">Robust Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Full CRUD operations with intelligent pagination & filtering APIs.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl hover:bg-white/40 transition-colors">
            <Zap className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="font-bold text-slate-900 text-lg">Lightning Fast</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Powered by Next.js 15 App router and heavily optimized React rendering.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
