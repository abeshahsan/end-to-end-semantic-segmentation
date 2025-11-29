import { Github, Zap, Shield, Code, Target, Crown, Sparkles, FileImage, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-73px)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            About <span className="bg-linear-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">SegmentAI</span>
          </h1>
          <p className="text-lg text-stone-500 mb-8">
            Semantic segmentation powered by state-of-the-art deep learning.
          </p>
        </motion.div>

        <motion.p 
          className="text-stone-600 mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          SegmentAI is a web-based semantic segmentation tool that allows you to
          quickly analyze images using cutting-edge deep learning models.
          No signup required — just upload and get results.
        </motion.p>

        <motion.div 
          className="grid md:grid-cols-3 gap-4 mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
            variants={fadeInUp}
            whileHover={{ y: -2 }}
          >
            <div className="w-10 h-10 bg-linear-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-stone-800 mb-2">Fast Processing</h3>
            <p className="text-sm text-stone-500">
              Get results in seconds with our optimized inference pipeline.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
            variants={fadeInUp}
            whileHover={{ y: -2 }}
          >
            <div className="w-10 h-10 bg-linear-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-stone-800 mb-2">Privacy First</h3>
            <p className="text-sm text-stone-500">
              Your images are processed and deleted immediately. No data stored.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
            variants={fadeInUp}
            whileHover={{ y: -2 }}
          >
            <div className="w-10 h-10 bg-linear-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="font-semibold text-stone-800 mb-2">API Access</h3>
            <p className="text-sm text-stone-500">
              Integrate segmentation into your own applications via our API.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            Supported Models
          </h2>
          <div className="space-y-3 mb-10">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-teal-50/50 border border-teal-100">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <strong className="text-stone-800">Fast</strong>
                <p className="text-sm text-stone-500">
                  Optimized for speed. Great for quick testing and previews.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50/50 border border-cyan-100">
              <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <strong className="text-stone-800">Balanced</strong>
                <p className="text-sm text-stone-500">
                  Good tradeoff between speed and accuracy for most use cases.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-50/50 border border-violet-100">
              <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <strong className="text-stone-800">Accurate</strong>
                <p className="text-sm text-stone-500">
                  Highest quality segmentation for detailed analysis.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-teal-500" />
            File Requirements
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            <div className="bg-stone-50 rounded-lg p-4 text-center border border-stone-100">
              <div className="text-xs uppercase tracking-wider text-stone-400 mb-1">Formats</div>
              <div className="font-semibold text-stone-700">JPG, PNG</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-4 text-center border border-stone-100">
              <div className="text-xs uppercase tracking-wider text-stone-400 mb-1">Max Size</div>
              <div className="font-semibold text-stone-700">10 MB</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-4 text-center border border-stone-100">
              <div className="text-xs uppercase tracking-wider text-stone-400 mb-1 flex items-center justify-center gap-1">
                <Maximize className="w-3 h-3" /> Resolution
              </div>
              <div className="font-semibold text-stone-700">Up to 2048px</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-linear-to-br from-stone-800 to-stone-900 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Github className="w-5 h-5" />
            Open Source
          </h2>
          <p className="text-stone-300 mb-4">
            This project is open source. Check out the code and contribute on GitHub.
          </p>
          <motion.a
            href="https://github.com/abeshahsan/end-to-end-semantic-segmentation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-800 rounded-xl font-medium hover:bg-stone-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
}
