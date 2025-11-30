import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
	ZoomIn,
	ZoomOut,
	Download,
	Copy,
	Check,
	ArrowLeft,
	RefreshCw,
	RotateCcw,
	FileImage,
	FileJson,
	Image,
	Layers,
	Square,
} from "lucide-react";
import clsx from "clsx";
import type { SegmentationResult } from "../types";

interface ResultsViewProps {
	result: SegmentationResult;
	originalImage: string; // blob URL of original uploaded image
	onBack: () => void;
	onNewImage: () => void;
}

type ViewMode = "mask" | "blend";

export default function ResultsView({ result, originalImage, onBack, onNewImage }: ResultsViewProps) {
	const [zoom, setZoom] = useState(100);
	const [copied, setCopied] = useState(false);
	const [viewMode, setViewMode] = useState<ViewMode>("mask");
	const [blendedImage, setBlendedImage] = useState<string | null>(null);
	const [blendOpacity, setBlendOpacity] = useState(0.5);

	// Pan/drag state
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const dragStart = useRef({ x: 0, y: 0 });
	const containerRef1 = useRef<HTMLDivElement>(null);
	const containerRef2 = useRef<HTMLDivElement>(null);
	const imageGridRef = useRef<HTMLDivElement>(null);

	const loadImage = (src: string): Promise<HTMLImageElement> => {
		return new Promise((resolve, reject) => {
			const img = new window.Image();
			img.crossOrigin = "anonymous";
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	};

	// Create blended image when mode changes or opacity changes
	useEffect(() => {
		if (viewMode !== "blend") return;

		const createBlendedImage = async () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			// Load both images
			const [origImg, maskImg] = await Promise.all([
				loadImage(originalImage),
				loadImage(result.mask),
			]);

			canvas.width = origImg.width;
			canvas.height = origImg.height;

			// Draw original
			ctx.drawImage(origImg, 0, 0);

			// Draw mask with opacity
			ctx.globalAlpha = blendOpacity;
			ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);

			setBlendedImage(canvas.toDataURL("image/png"));
		};

		createBlendedImage();
	}, [viewMode, originalImage, result.mask, blendOpacity]);

	const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 300));
	const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 25));

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			setIsDragging(true);
			dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
			e.preventDefault();
		},
		[position]
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging) return;
			const newX = e.clientX - dragStart.current.x;
			const newY = e.clientY - dragStart.current.y;
			setPosition({ x: newX, y: newY });
		},
		[isDragging]
	);

	const handleMouseUp = useCallback(() => setIsDragging(false), []);
	const handleMouseLeave = useCallback(() => setIsDragging(false), []);

	useEffect(() => {
		const element = imageGridRef.current;
		if (!element) return;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const delta = e.deltaY > 0 ? -10 : 10;
			setZoom((z) => Math.min(Math.max(z + delta, 25), 300));
		};

		element.addEventListener("wheel", handleWheel, { passive: false });
		return () => element.removeEventListener("wheel", handleWheel);
	}, []);

	const handleResetView = useCallback(() => {
		setPosition({ x: 0, y: 0 });
		setZoom(100);
	}, []);

	const handleCopyEndpoint = async () => {
		await navigator.clipboard.writeText("POST /api/segment?mask_format=png");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownload = (type: "mask" | "blend" | "metadata") => {
		const baseName = result.imageName.replace(/\.[^/.]+$/, "");
		const prefix = `segment_ai_${baseName}`;

		if (type === "mask") {
			const link = document.createElement("a");
			link.href = result.mask;
			link.download = `${prefix}_mask.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else if (type === "blend" && blendedImage) {
			const link = document.createElement("a");
			link.href = blendedImage;
			link.download = `${prefix}_blend.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else if (type === "metadata") {
			const metadata = JSON.stringify({
				classes: result.classes,
				width: result.width,
				height: result.height,
			}, null, 2);
			const url = `data:application/json;charset=utf-8,${encodeURIComponent(metadata)}`;
			const link = document.createElement("a");
			link.href = url;
			link.download = `${prefix}_metadata.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	// Get the right panel image based on view mode
	const rightPanelImage = viewMode === "blend" ? blendedImage : result.mask;
	const rightPanelLabel = viewMode === "blend" ? "Blended Overlay" : "Segmentation Mask";

	return (
		<motion.div
			className='max-w-6xl mx-auto px-4 py-6'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
		>
			{/* Stats Bar */}
			<motion.div
				className='bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6 border border-teal-100'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				<div className='flex flex-wrap items-center justify-center gap-6 text-sm'>
					<div className='flex items-center gap-1.5'>
						<FileImage className='w-4 h-4 text-teal-500' />
						<span className='text-stone-500'>Image:</span>
						<span
							className='font-semibold text-stone-700 max-w-[150px] truncate inline-block align-bottom'
							title={result.imageName}
						>
							{result.imageName}
						</span>
					</div>
					<div className='hidden sm:block w-px h-4 bg-teal-200' />
					<div>
						<span className='text-stone-500'>Size:</span>{" "}
						<span className='font-semibold text-stone-700'>{result.width} × {result.height}</span>
					</div>
					<div className='hidden sm:block w-px h-4 bg-teal-200' />
					<div>
						<span className='text-stone-500'>Classes:</span>{" "}
						<span className='font-semibold text-teal-600'>{result.classes.length}</span>
					</div>
				</div>
			</motion.div>

			{/* Controls */}
			<motion.div
				className='flex flex-wrap items-center justify-between gap-4 mb-4'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				{/* Zoom controls */}
				<div className='flex items-center gap-1.5'>
					<button
						onClick={handleZoomOut}
						className='p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors'
						aria-label='Zoom out'
					>
						<ZoomOut className='w-4 h-4 text-stone-600' />
					</button>
					<span className='text-sm font-medium text-stone-600 w-12 text-center'>{zoom}%</span>
					<button
						onClick={handleZoomIn}
						className='p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors'
						aria-label='Zoom in'
					>
						<ZoomIn className='w-4 h-4 text-stone-600' />
					</button>
					<button
						onClick={handleResetView}
						className='p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors ml-1'
						aria-label='Reset view'
						title='Reset zoom and position'
					>
						<RotateCcw className='w-4 h-4 text-stone-600' />
					</button>
					<span className='text-xs text-stone-400 ml-2 hidden sm:inline'>Scroll to zoom • Drag to pan</span>
				</div>

				{/* View mode toggle */}
				<div className='flex items-center gap-2'>
					{/* Opacity slider (only shown in blend mode) */}
					{viewMode === "blend" && (
						<div className='flex items-center gap-2 mr-2'>
							<span className='text-xs text-stone-500'>Opacity:</span>
							<input
								type='range'
								min='0'
								max='1'
								step='0.1'
								value={blendOpacity}
								onChange={(e) => setBlendOpacity(parseFloat(e.target.value))}
								className='w-20 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-500'
							/>
							<span className='text-xs text-stone-600 w-8'>{Math.round(blendOpacity * 100)}%</span>
						</div>
					)}

					<div className='flex bg-stone-100 rounded-lg p-1'>
						<button
							onClick={() => setViewMode("blend")}
							className={clsx(
								"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
								viewMode === "blend"
									? "bg-white text-teal-600 shadow-sm"
									: "text-stone-500 hover:text-stone-700"
							)}
						>
							<Layers className='w-3.5 h-3.5' />
							Blend
						</button>
						<button
							onClick={() => setViewMode("mask")}
							className={clsx(
								"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
								viewMode === "mask"
									? "bg-white text-teal-600 shadow-sm"
									: "text-stone-500 hover:text-stone-700"
							)}
						>
							<Square className='w-3.5 h-3.5' />
							Mask
						</button>
					</div>
				</div>
			</motion.div>

			{/* Image Comparison */}
			<motion.div
				ref={imageGridRef}
				className='grid md:grid-cols-2 gap-4 mb-8 select-none'
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<div className='bg-stone-100 rounded-xl p-4'>
					<h3 className='text-sm font-medium text-stone-500 mb-3 flex items-center gap-2'>
						<Image className='w-4 h-4' />
						Original Image
					</h3>
					<div
						ref={containerRef1}
						onMouseDown={handleMouseDown}
						className={clsx(
							"overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-inner",
							isDragging ? "cursor-grabbing" : "cursor-grab"
						)}
						style={{ height: "400px" }}
					>
						<div
							className='flex items-center justify-center w-full h-full'
							style={{
								transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
								transition: isDragging ? "none" : "transform 0.1s ease-out",
								transformOrigin: "center center",
							}}
						>
							<img
								src={originalImage}
								alt='Original'
								className='max-w-full max-h-full object-contain select-none pointer-events-none'
								draggable={false}
							/>
						</div>
					</div>
				</div>
				<div className='bg-stone-100 rounded-xl p-4'>
					<h3 className='text-sm font-medium text-stone-500 mb-3 flex items-center gap-2'>
						{viewMode === "blend" ? <Layers className='w-4 h-4' /> : <FileImage className='w-4 h-4' />}
						{rightPanelLabel}
					</h3>
					<div
						ref={containerRef2}
						onMouseDown={handleMouseDown}
						className={clsx(
							"overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-inner",
							isDragging ? "cursor-grabbing" : "cursor-grab"
						)}
						style={{ height: "400px" }}
					>
						<div
							className='flex items-center justify-center w-full h-full'
							style={{
								transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
								transition: isDragging ? "none" : "transform 0.1s ease-out",
								transformOrigin: "center center",
							}}
						>
							{rightPanelImage ? (
								<img
									src={rightPanelImage}
									alt={rightPanelLabel}
									className='max-w-full max-h-full object-contain select-none pointer-events-none'
									draggable={false}
								/>
							) : (
								<div className='text-stone-400 text-sm'>Loading blend...</div>
							)}
						</div>
					</div>
				</div>
			</motion.div>

			{/* Export Section */}
			<motion.div
				className='bg-white rounded-xl p-6 border border-stone-200 shadow-sm'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				<h3 className='text-lg font-semibold text-stone-800 mb-4'>Export Your Results</h3>

				<div className='grid sm:grid-cols-3 gap-3 mb-6'>
					<motion.button
						onClick={() => handleDownload("mask")}
						className='flex items-center justify-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<Download className='w-4 h-4 text-teal-600' />
						<span className='font-medium text-stone-700'>Mask PNG</span>
					</motion.button>
					<motion.button
						onClick={() => handleDownload("blend")}
						disabled={!blendedImage}
						className='flex items-center justify-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
						whileHover={{ scale: blendedImage ? 1.02 : 1 }}
						whileTap={{ scale: blendedImage ? 0.98 : 1 }}
					>
						<Layers className='w-4 h-4 text-teal-600' />
						<span className='font-medium text-stone-700'>Blend PNG</span>
					</motion.button>
					<motion.button
						onClick={() => handleDownload("metadata")}
						className='flex items-center justify-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<FileJson className='w-4 h-4 text-teal-600' />
						<span className='font-medium text-stone-700'>Metadata JSON</span>
					</motion.button>
				</div>

				<div className='flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-100'>
					<span className='text-sm text-stone-500'>API:</span>
					<code className='flex-1 text-sm font-mono text-stone-600 truncate'>
						POST /api/segment?mask_format=png
					</code>
					<button
						onClick={handleCopyEndpoint}
						className='p-2 rounded-md hover:bg-stone-200 transition-colors'
						aria-label='Copy API endpoint'
					>
						{copied ? (
							<Check className='w-4 h-4 text-teal-600' />
						) : (
							<Copy className='w-4 h-4 text-stone-400' />
						)}
					</button>
				</div>
			</motion.div>

			{/* Actions */}
			<motion.div
				className='flex flex-wrap items-center justify-center gap-4 mt-6'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
			>
				<motion.button
					onClick={onBack}
					className='flex items-center gap-2 px-6 py-3 text-stone-500 hover:text-stone-700 transition-colors'
					whileHover={{ x: -3 }}
				>
					<ArrowLeft className='w-4 h-4' />
					Back to Upload
				</motion.button>
				<motion.button
					onClick={onNewImage}
					className='flex items-center gap-2 px-6 py-3 bg-linear-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all'
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<RefreshCw className='w-4 h-4' />
					New Image
				</motion.button>
			</motion.div>
		</motion.div>
	);
}
