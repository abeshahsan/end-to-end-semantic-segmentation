import type { LucideIcon } from "lucide-react";

export interface ModelOption {
	id: string;
	name: string;
	description: string;
	icon?: LucideIcon;
}

export interface SegmentationResult {
	success: boolean;
	mask: string; // blob URL for PNG
	overlay?: string; // blob URL for overlay PNG (if requested)
	original?: string; // blob URL for original (if requested)
	height: number;
	width: number;
	classes: string[];
	imageName: string; // added client-side
}

export interface UploadError {
	type: "size" | "format" | "network" | "unknown";
	message: string;
	details?: string;
}

export type AppState = "upload" | "processing" | "results" | "error";
