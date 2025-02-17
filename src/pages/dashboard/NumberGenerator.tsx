import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice1 as Dice } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const NumberGenerator = () => {
  const { session } = useAuth();
  const [number, setNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const generateNumber = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setShowResult(false);

    try {
      // Check if user already has a number
      const { data: existingNumber } = await supabase
        .from('user_numbers')
        .select('assigned_number')
        .eq('user_id', session?.user.id)
        .single();

      if (existingNumber) {
        toast.error('You already have an assigned number');
        return;
      }

      // Get all assigned numbers
      const { data: assignedNumbers } = await supabase
        .from('user_numbers')
        .select('assigned_number');

      const usedNumbers = assignedNumbers?.map(n => n.assigned_number) || [];
      const availableNumbers = Array.from({ length: 12 }, (_, i) => i + 1)
        .filter(n => !usedNumbers.includes(n));

      if (availableNumbers.length === 0) {
        toast.error('No numbers available');
        return;
      }

      // Animate through random numbers
      let count = 0;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        setNumber(availableNumbers[randomIndex]);
        count++;

        if (count >= 20) {
          clearInterval(interval);
          const finalNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
          setNumber(finalNumber);
          setShowResult(true);
          
          // Save the number
          supabase
            .from('user_numbers')
            .insert([
              { user_id: session?.user.id, assigned_number: finalNumber }
            ])
            .then(({ error }) => {
              if (error) throw error;
              toast.success(`Number ${finalNumber} has been assigned to you!`);
            })
            .catch(error => {
              console.error('Error saving number:', error);
              toast.error('Failed to save your number');
            });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating number:', error);
      toast.error('Failed to generate number');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">Number Generator</h1>
        
        <div className="relative w-48 h-48 mx-auto">
          <AnimatePresence mode="wait">
            {number && (
              <motion.div
                key={number}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: showResult ? 1.2 : 1, 
                  opacity: 1,
                  rotate: showResult ? [0, 15, -15, 0] : 0
                }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-7xl font-bold text-secondary">
                  {number}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={generateNumber}
          disabled={isGenerating}
          className={`
            flex items-center justify-center space-x-2
            px-6 py-3 rounded-lg text-white
            transition-all duration-200
            ${isGenerating
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-secondary hover:bg-secondary/80'
            }
          `}
        >
          <Dice className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating...' : 'Generate Number'}</span>
        </button>
      </div>
    </div>
  );
};

export default NumberGenerator;