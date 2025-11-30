import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Target, Crown } from "lucide-react";
import DropZone from "./DropZone";
import ModelSelector from "./ModelSelector";
import ErrorBanner from "./ErrorBanner";
import LoadingOverlay from "./LoadingOverlay";
import ResultsView from "./ResultsView";
import type { ModelOption, SegmentationResult, UploadError, AppState } from "../types";
import { segmentImage, validateFile } from "../services/api";

const MODELS: ModelOption[] = [
	{
		id: "fast",
		name: "Fast",
		description: "Quick results with good accuracy. Best for quick testing.",
		icon: Zap,
	},
	{
		id: "balanced",
		name: "Balanced",
		description: "Good balance between speed and accuracy.",
		icon: Target,
	},
	{
		id: "accurate",
		name: "Accurate",
		description: "Highest accuracy but slower processing. Best for final results.",
		icon: Crown,
	},
];

export default function UploadPage() {
	const [appState, setAppState] = useState<AppState>("upload");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
	const [error, setError] = useState<UploadError | null>(null);
	const [result, setResult] = useState<SegmentationResult | null>(null);
	const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

	const handleFileSelect = useCallback((file: File) => {
		const validation = validateFile(file);
		if (!validation.valid && validation.error) {
			setError({
				type: validation.error.type,
				message: validation.error.message,
				details: validation.error.details,
			});
			return;
		}
		setError(null);
		setSelectedFile(file);
		setOriginalImageUrl(URL.createObjectURL(file));
	}, []);

	const handleClearFile = useCallback(() => {
		if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
		setSelectedFile(null);
		setOriginalImageUrl(null);
		setError(null);
	}, [originalImageUrl]);

	const handleDismissError = useCallback(() => {
		setError(null);
	}, []);

	const handleProcess = useCallback(async () => {
		if (!selectedFile) return;

		setAppState("processing");
		try {
			const segmentationResult = await segmentImage(selectedFile);
			setResult(segmentationResult);
			setAppState("results");
		} catch (err) {
			setError({
				type: "network",
				message: "Processing failed",
				details: err instanceof Error ? err.message : "An unexpected error occurred. Please try again.",
			});
			setAppState("error");
		}
	}, [selectedFile]);

	const handleCancel = useCallback(() => {
		setAppState("upload");
	}, []);

	const handleBack = useCallback(() => {
		setAppState("upload");
	}, []);

	const handleNewImage = useCallback(() => {
		if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
		if (result?.mask) URL.revokeObjectURL(result.mask);
		setSelectedFile(null);
		setOriginalImageUrl(null);
		setResult(null);
		setError(null);
		setAppState("upload");
	}, [originalImageUrl, result]);

	const selectedModelName = MODELS.find((m) => m.id === selectedModel)?.name || selectedModel;

	// Results view
	if (appState === "results" && result && originalImageUrl) {
		return (
			<ResultsView
				result={result}
				originalImage={originalImageUrl}
				onBack={handleBack}
				onNewImage={handleNewImage}
			/>
		);
	}

	return (
		<motion.div
			className='max-w-2xl mx-auto px-4 py-10'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Processing overlay */}
			<AnimatePresence>
				{appState === "processing" && (
					<LoadingOverlay
						modelName={selectedModelName}
						onCancel={handleCancel}
					/>
				)}
			</AnimatePresence>

			{/* Welcome Section */}
			<div className='text-center mb-10'>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.1 }}
				>
					<h1 className='text-4xl font-bold text-stone-800 mb-4 tracking-tight'>Semantic Segmentation</h1>
					<p className='text-stone-500 max-w-md mx-auto text-lg'>
						Upload an image to segment it semantically. No account needed.
					</p>
				</motion.div>
			</div>

			{/* Error Banner */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
					>
						<ErrorBanner
							error={error}
							onDismiss={handleDismissError}
							onRetry={handleClearFile}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Upload Section */}
			<motion.div
				className='bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-5'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<DropZone
					onFileSelect={handleFileSelect}
					selectedFile={selectedFile}
					onClear={handleClearFile}
					disabled={appState === "processing"}
				/>
			</motion.div>

			{/* Model Selection */}
			<motion.div
				className='bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<ModelSelector
					models={MODELS}
					selectedModel={selectedModel}
					onSelect={setSelectedModel}
					disabled={appState === "processing"}
				/>
			</motion.div>

			{/* Process Button */}
			<motion.button
				onClick={handleProcess}
				disabled={!selectedFile || appState === "processing"}
				className='w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-linear-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 disabled:from-stone-300 disabled:to-stone-300 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				whileHover={{ scale: selectedFile ? 1.02 : 1 }}
				whileTap={{ scale: selectedFile ? 0.98 : 1 }}
			>
				<Sparkles className='w-5 h-5' />
				Process Image
			</motion.button>

			{/* Footer Guidelines */}
			<motion.p
				className='text-center text-sm text-stone-400 mt-6'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
			>
				Supports JPG/PNG up to 10MB • No account needed
			</motion.p>
		</motion.div>
	);
}
