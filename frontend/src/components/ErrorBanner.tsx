import { AlertTriangle, AlertCircle, X, ExternalLink, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { UploadError } from "../types";

interface ErrorBannerProps {
	error: UploadError;
	onDismiss: () => void;
	onRetry?: () => void;
}

export default function ErrorBanner({ error, onDismiss, onRetry }: ErrorBannerProps) {
	const isWarning = error.type === "format";
	const Icon = isWarning ? AlertCircle : AlertTriangle;

	const externalLinks: Record<string, { text: string; url: string }> = {
		size: { text: "TinyPNG.com", url: "https://tinypng.com" },
		format: { text: "CloudConvert.com", url: "https://cloudconvert.com" },
	};

	const link = externalLinks[error.type];

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: -10, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: -10, scale: 0.95 }}
				transition={{ type: "spring", damping: 20, stiffness: 300 }}
				className={clsx(
					"rounded-xl p-4 mb-4 border shadow-sm",
					isWarning
						? "bg-linear-to-r from-amber-50 to-orange-50 border-amber-200"
						: "bg-linear-to-r from-rose-50 to-red-50 border-rose-200"
				)}
				role='alert'
			>
				<div className='flex items-start gap-3'>
					<motion.div
						initial={{ rotate: -10 }}
						animate={{ rotate: 0 }}
						transition={{ type: "spring", damping: 10 }}
					>
						<Icon
							className={clsx("w-5 h-5 shrink-0 mt-0.5", isWarning ? "text-amber-500" : "text-rose-500")}
						/>
					</motion.div>
					<div className='flex-1'>
						<h3 className={clsx("font-semibold", isWarning ? "text-amber-800" : "text-rose-800")}>
							{isWarning ? "Format Issue" : "Upload Error"}
						</h3>
						<p className={clsx("text-sm mt-1", isWarning ? "text-amber-700" : "text-rose-700")}>
							{error.message}
						</p>
						{error.details && (
							<p
								className={clsx(
									"text-sm mt-2 opacity-80",
									isWarning ? "text-amber-600" : "text-rose-600"
								)}
							>
								{error.details}
							</p>
						)}
						{link && (
							<a
								href={link.url}
								target='_blank'
								rel='noopener noreferrer'
								className={clsx(
									"inline-flex items-center gap-1 text-sm font-medium mt-2 hover:underline",
									isWarning ? "text-amber-700" : "text-rose-700"
								)}
							>
								Try {link.text}
								<ExternalLink className='w-3 h-3' />
							</a>
						)}
						<div className='flex gap-3 mt-3'>
							{onRetry && (
								<motion.button
									onClick={onRetry}
									className={clsx(
										"flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
										isWarning
											? "bg-amber-100 text-amber-800 hover:bg-amber-200"
											: "bg-rose-100 text-rose-800 hover:bg-rose-200"
									)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<RefreshCw className='w-3.5 h-3.5' />
									Try Again
								</motion.button>
							)}
							<button
								onClick={onDismiss}
								className='px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors'
							>
								Dismiss
							</button>
						</div>
					</div>
					<button
						onClick={onDismiss}
						className='p-1.5 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors'
						aria-label='Dismiss error'
					>
						<X className='w-4 h-4' />
					</button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
