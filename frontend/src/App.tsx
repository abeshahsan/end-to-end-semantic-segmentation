import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
	return (
		<BrowserRouter>
			<div className='min-h-screen bg-stone-50'>
				<a
					href='#main-content'
					className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-lg'
				>
					Skip to main content
				</a>
				<Header />
				<div id='main-content'>
					<Routes>
						<Route
							path='/'
							element={<HomePage />}
						/>
						<Route
							path='/about'
							element={<AboutPage />}
						/>
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
