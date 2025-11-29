import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface LoadingOverlayProps {
	modelName: string;
	onCancel?: () => void;
}

export default function LoadingOverlay({ modelName, onCancel }: LoadingOverlayProps) {
	return (
		<motion.div
			className='fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className='bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center'
				initial={{ scale: 0.9, opacity: 0, y: 20 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.9, opacity: 0, y: 20 }}
				transition={{ type: "spring", damping: 25, stiffness: 300 }}
			>
				{/* Animated Logo */}
				<div className='flex justify-center mb-6'>
					<div className='relative'>
						{/* Outer ring */}
						<motion.div
							className='w-20 h-20 rounded-full border-4 border-teal-100'
							animate={{ rotate: 360 }}
							transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
						>
							<motion.div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full' />
						</motion.div>
						{/* Center icon */}
						<div className='absolute inset-0 flex items-center justify-center'>
							<motion.div
								className='w-12 h-12 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30'
								animate={{ scale: [1, 1.05, 1] }}
								transition={{ duration: 2, repeat: Infinity }}
							>
								<Layers className='w-6 h-6 text-white' />
							</motion.div>
						</div>
					</div>
				</div>

				<h2 className='text-xl font-semibold text-stone-800 mb-2'>Segmenting Your Image</h2>
				<p className='text-stone-500 mb-4'>
					Est. time: <span className='font-medium text-stone-700'>10-30 seconds</span>
				</p>

				{/* Progress dots */}
				<div className='flex justify-center gap-1.5 mb-4'>
					{[0, 1, 2, 3, 4].map((i) => (
						<motion.div
							key={i}
							className='w-2 h-2 bg-teal-500 rounded-full'
							animate={{
								scale: [1, 1.3, 1],
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								duration: 1,
								repeat: Infinity,
								delay: i * 0.15,
							}}
						/>
					))}
				</div>

				<p className='text-xs text-stone-400'>
					Model: <span className='font-medium text-stone-500'>{modelName}</span>
				</p>

				{onCancel && (
					<motion.button
						onClick={onCancel}
						className='mt-6 px-5 py-2 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						Cancel
					</motion.button>
				)}
			</motion.div>
		</motion.div>
	);
}
