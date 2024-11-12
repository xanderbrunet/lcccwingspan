import { useState } from 'react';
import { supabase } from "@api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    onAuthenticated: () => void;
  }
  
  const OverlayLogin: React.FC<Props> = ({ onAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);
  
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setIsSubmitting(false);
      } else {
        onAuthenticated();
      }
    };
  
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-black p-8 rounded-lg shadow-lg max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className='text-3xl cormorant-bold text-center'>The Wingpsan Editor</h1>
            <h2 className="text-xl libre-regular font-bold text-center text-gray-700 dark:text-gray-300 mb-10">Login to access this page</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 libre-light">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm libre-regular"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 libre-light">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm libre-regular"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 bg-blue-600 text-white shadow hover:bg-blue-700 dark:bg-blue-900 dark:hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 libre-medium ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };
  
  export default OverlayLogin;
