"use client";

import { Button } from "./ui/button";
import { LogOut, User, Shield } from "lucide-react";

interface HeaderProps {
  userEmail: string;
  role: "admin" | "reader";
  onLogout: () => void;
}

export function Header({ userEmail, role, onLogout }: HeaderProps) {
  const handleLogout = () => {
    onLogout();
    // The parent component (page.tsx) will handle switching the view back to login
  };

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">R</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">ReadHub</h1>
            <p className="text-xs text-slate-500">Simple Reading Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {role === "admin" ? (
              <Shield className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-emerald-600" />
            )}
            <span className="font-medium">{userEmail}</span>
            <span className="text-slate-400">•</span>
            <span className="capitalize text-slate-500">{role}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}