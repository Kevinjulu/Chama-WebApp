import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { CircleUserRound, Calendar, Hash } from 'lucide-react';

const Dashboard = () => {
  const { session } = useAuth();
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserNumber = async () => {
      try {
        const { data, error } = await supabase
          .from('user_numbers')
          .select('assigned_number')
          .eq('user_id', session?.user.id)
          .single();

        if (error) throw error;
        setUserNumber(data?.assigned_number);
      } catch (error) {
        console.error('Error fetching user number:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.id) {
      fetchUserNumber();
    }
  }, [session?.user.id]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-primary p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <CircleUserRound className="w-12 h-12 text-secondary" />
            <div>
              <h2 className="text-white font-semibold">Profile</h2>
              <p className="text-gray-400">{session?.user.email}</p>
            </div>
          </div>
        </div>

        {/* Assigned Number Card */}
        <div className="bg-primary p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <Hash className="w-12 h-12 text-secondary" />
            <div>
              <h2 className="text-white font-semibold">Your Number</h2>
              <p className="text-gray-400">
                {loading ? 'Loading...' : userNumber ? `#${userNumber}` : 'Not assigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Next Meeting Card */}
        <div className="bg-primary p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <Calendar className="w-12 h-12 text-secondary" />
            <div>
              <h2 className="text-white font-semibold">Next Meeting</h2>
              <p className="text-gray-400">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-primary p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-400">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;