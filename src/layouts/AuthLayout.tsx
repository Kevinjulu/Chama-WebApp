import { Outlet } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="relative glass p-8 rounded-2xl shadow-2xl space-y-6 border border-white/10">
          <div className="flex flex-col items-center">
            <div className="relative">
              <CircleUserRound className="w-16 h-16 text-secondary animate-float" />
              <div className="absolute inset-0 bg-secondary/20 blur-xl -z-10" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Chama Group App
            </h2>
            <p className="mt-2 text-white/60">
              Manage your group efficiently
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;