import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 text-center space-y-4">
        <p className="text-white">
          Check your email for password reset instructions.
        </p>
        <Link
          to="/login"
          className="text-secondary hover:text-secondary/80"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
      <div>
        <label htmlFor="email" className="text-white">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
        />
      </div>

      <div className="flex items-center justify-center">
        <Link
          to="/login"
          className="text-secondary hover:text-secondary/80"
        >
          Back to login
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
      >
        {loading ? 'Sending instructions...' : 'Reset password'}
      </button>
    </form>
  );
};

export default ForgotPassword;