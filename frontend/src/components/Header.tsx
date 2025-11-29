import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

export default function Header() {
	const location = useLocation();

	return (
		<header 
			className='bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50'
			role='banner'
		>
			<div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
				<Link
					to='/'
					className='flex items-center gap-2.5 group'
					aria-label='SegmentAI - Go to homepage'
				>
					<motion.div
						className='w-9 h-9 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20'
						whileHover={{ scale: 1.05, rotate: -3 }}
						whileTap={{ scale: 0.95 }}
					>
						<Layers className='w-5 h-5 text-white' aria-hidden='true' />
					</motion.div>
					<span className='font-semibold text-stone-800 text-lg tracking-tight group-hover:text-teal-700 transition-colors'>
						SegmentAI
					</span>
				</Link>

				<nav className='flex items-center gap-1' role='navigation' aria-label='Main navigation'>
					<Link
						to='/'
						aria-current={location.pathname === "/" ? "page" : undefined}
						className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
							location.pathname === "/"
								? "text-teal-700"
								: "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
						}`}
					>
						{location.pathname === "/" && (
							<motion.div
								layoutId='nav-indicator'
								className='absolute inset-0 bg-teal-50 rounded-lg border border-teal-200/50'
								transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
								aria-hidden='true'
							/>
						)}
						<span className='relative z-10'>Home</span>
					</Link>
					<Link
						to='/about'
						aria-current={location.pathname === "/about" ? "page" : undefined}
						className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
							location.pathname === "/about"
								? "text-teal-700"
								: "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
						}`}
					>
						{location.pathname === "/about" && (
							<motion.div
								layoutId='nav-indicator'
								className='absolute inset-0 bg-teal-50 rounded-lg border border-teal-200/50'
								transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
								aria-hidden='true'
							/>
						)}
						<span className='relative z-10'>About</span>
					</Link>
				</nav>
			</div>
		</header>
	);
}
