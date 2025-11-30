import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to SegmentAI homepage."
        noIndex={true}
      />
      <main 
        className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4"
        role="main"
        aria-label="Page not found"
      >
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-stone-100 rounded-2xl flex items-center justify-center"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.4, delay: 0.2 }}
          >
            <Search className="w-10 h-10 text-stone-400" aria-hidden="true" />
          </motion.div>
          
          <h1 className="text-6xl font-bold text-stone-800 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-stone-600 mb-4">Page Not Found</h2>
          <p className="text-stone-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
