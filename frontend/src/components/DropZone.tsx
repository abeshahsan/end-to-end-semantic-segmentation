import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

interface DropZoneProps {
	onFileSelect: (file: File) => void;
	selectedFile: File | null;
	onClear: () => void;
	disabled?: boolean;
}

export default function DropZone({ onFileSelect, selectedFile, onClear, disabled }: DropZoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			if (!disabled) setIsDragging(true);
		},
		[disabled]
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			if (disabled) return;

			const file = e.dataTransfer.files[0];
			if (file) {
				onFileSelect(file);
				const reader = new FileReader();
				reader.onload = () => setPreview(reader.result as string);
				reader.readAsDataURL(file);
			}
		},
		[disabled, onFileSelect]
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				onFileSelect(file);
				const reader = new FileReader();
				reader.onload = () => setPreview(reader.result as string);
				reader.readAsDataURL(file);
			}
		},
		[onFileSelect]
	);

	const handleClear = useCallback(() => {
		setPreview(null);
		onClear();
	}, [onClear]);

	return (
		<motion.div
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={clsx(
				"relative border-2 border-dashed rounded-xl transition-all duration-300",
				"min-h-60 flex flex-col items-center justify-center p-6",
				isDragging && "border-teal-400 bg-teal-50/50 scale-[1.02]",
				!isDragging &&
					!selectedFile &&
					"border-stone-200 hover:border-teal-300 bg-stone-50/50 hover:bg-teal-50/30",
				selectedFile && "border-teal-400 bg-teal-50/30",
				disabled && "opacity-50 cursor-not-allowed"
			)}
			animate={{ scale: isDragging ? 1.02 : 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<AnimatePresence mode='wait'>
				{selectedFile && preview ? (
					<motion.div
						key='preview'
						className='relative w-full'
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
					>
						<motion.button
							onClick={handleClear}
							className='absolute -top-2 -right-2 z-10 p-1.5 bg-rose-500 text-white rounded-full shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-colors'
							aria-label='Remove file'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
						>
							<X className='w-4 h-4' />
						</motion.button>
						<div className='flex flex-col items-center gap-4'>
							<div className='relative'>
								<img
									src={preview}
									alt='Preview'
									className='max-h-44 max-w-full rounded-xl shadow-lg object-contain'
								/>
								<motion.div
									className='absolute -bottom-2 -right-2 p-1 bg-teal-500 rounded-full shadow-md'
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2, type: "spring" }}
								>
									<CheckCircle2 className='w-5 h-5 text-white' />
								</motion.div>
							</div>
							<div className='text-center'>
								<p className='text-sm font-medium text-stone-700'>{selectedFile.name}</p>
								<p className='text-xs text-stone-400 mt-0.5'>
									{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
								</p>
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key='dropzone'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='w-full h-full'
					>
						<input
							type='file'
							accept='image/jpeg,image/png,image/jpg'
							onChange={handleFileInput}
							className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
							disabled={disabled}
							aria-label='Upload image file'
						/>
						<div className='flex flex-col items-center gap-4 pointer-events-none'>
							<motion.div
								className={clsx(
									"p-4 rounded-2xl transition-colors duration-300",
									isDragging ? "bg-teal-100" : "bg-stone-100"
								)}
								animate={{
									y: isDragging ? -5 : 0,
									scale: isDragging ? 1.1 : 1,
								}}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
							>
								{isDragging ? (
									<Upload className='w-8 h-8 text-teal-500' />
								) : (
									<ImageIcon className='w-8 h-8 text-stone-400' />
								)}
							</motion.div>
							<div className='text-center'>
								<p
									className={clsx(
										"font-medium transition-colors",
										isDragging ? "text-teal-600" : "text-stone-600"
									)}
								>
									{isDragging ? "Drop your image here" : "Drag & drop your image here"}
								</p>
								<p className='text-sm text-stone-400 mt-1'>or click to browse</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
