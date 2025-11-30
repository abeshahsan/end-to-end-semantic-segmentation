import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			// Proxy requests that start with '/api'
			"/api": {
				target: "http://127.0.0.1:8000", // The address of your backend API server
				changeOrigin: true, // Needed for virtual hosted sites
				rewrite: (path) => path.replace(/^\/api/, ""), // Remove the '/api' prefix when forwarding
				ws: true, // Enable proxying of WebSockets
			},
		},
	},
});
