import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, RotateCcw, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserNumber {
  id: string;
  user_id: string;
  assigned_number: number;
  created_at: string;
  users: {
    email: string;
  };
}

const AdminDashboard = () => {
  const [userNumbers, setUserNumbers] = useState<UserNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchUserNumbers();
  }, []);

  const fetchUserNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_numbers')
        .select(`
          *,
          users:user_id (
            email
          )
        `)
        .order('assigned_number');

      if (error) throw error;
      setUserNumbers(data as UserNumber[]);
    } catch (error) {
      console.error('Error fetching user numbers:', error);
      toast.error('Failed to load user numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all number assignments?')) {
      return;
    }

    setResetting(true);
    try {
      const { error } = await supabase
        .from('user_numbers')
        .delete()
        .neq('id', '');  // Delete all records

      if (error) throw error;
      
      toast.success('All number assignments have been reset');
      await fetchUserNumbers();
    } catch (error) {
      console.error('Error resetting numbers:', error);
      toast.error('Failed to reset numbers');
    } finally {
      setResetting(false);
    }
  };

  const exportData = () => {
    const data = userNumbers.map(({ users, assigned_number, created_at }) => ({
      email: users.email,
      number: assigned_number,
      assigned_at: new Date(created_at).toLocaleString(),
    }));

    const csv = [
      ['Email', 'Assigned Number', 'Assigned At'],
      ...data.map(row => [row.email, row.number, row.assigned_at])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `number-assignments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg flex items-center space-x-2"
          >
            <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset All</span>
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-primary rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-2 text-white mb-4">
            <Users className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Number Assignments</h2>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : userNumbers.length === 0 ? (
            <p className="text-gray-400">No numbers have been assigned yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left">Number</th>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Assigned At</th>
                  </tr>
                </thead>
                <tbody>
                  {userNumbers.map((record) => (
                    <tr key={record.id} className="border-b border-gray-700">
                      <td className="px-6 py-4">#{record.assigned_number}</td>
                      <td className="px-6 py-4">{record.users.email}</td>
                      <td className="px-6 py-4">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;