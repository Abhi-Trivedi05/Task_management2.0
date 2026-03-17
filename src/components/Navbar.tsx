"use client";

import { useAuth } from "@/lib/AuthContext";
import { LogOut, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { user, logoutState } = useAuth();

  return (
    <nav className="w-full glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] justify-between items-center">
          <div className="flex items-center gap-2 text-primary-600 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <CheckCircle className="h-7 w-7 text-primary-500 group-hover:text-primary-600 transition-colors" />
            <Link href="/" className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 hidden sm:block">
              TaskFlow
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-slate-700">
                  Hi, {user.username}
                </span>
                <button
                  onClick={logoutState}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
