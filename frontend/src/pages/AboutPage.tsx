import { Github, Zap, Shield, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          About SegmentAI
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-8">
            SegmentAI is a web-based semantic segmentation tool that allows you to
            quickly analyze images using state-of-the-art deep learning models.
            No signup required.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Fast Processing</h3>
              <p className="text-sm text-slate-600">
                Get results in seconds with our optimized inference pipeline.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Privacy First</h3>
              <p className="text-sm text-slate-600">
                Your images are processed and deleted immediately. No data stored.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">API Access</h3>
              <p className="text-sm text-slate-600">
                Integrate segmentation into your own applications via our API.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Supported Models
          </h2>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <strong className="text-slate-800">Fast</strong>
                <p className="text-sm text-slate-600">
                  Optimized for speed. Great for quick testing and previews.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <strong className="text-slate-800">Balanced</strong>
                <p className="text-sm text-slate-600">
                  Good tradeoff between speed and accuracy for most use cases.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <strong className="text-slate-800">Accurate</strong>
                <p className="text-sm text-slate-600">
                  Highest quality segmentation for detailed analysis.
                </p>
              </div>
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            File Requirements
          </h2>
          <ul className="space-y-2 text-slate-600 mb-8">
            <li>• Supported formats: JPG, PNG</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Recommended resolution: Up to 2048x2048 pixels</li>
          </ul>

          <div className="bg-slate-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Open Source
            </h2>
            <p className="text-slate-600 mb-4">
              This project is open source. Check out the code and contribute on GitHub.
            </p>
            <a
              href="https://github.com/abeshahsan/end-to-end-semantic-segmentation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
