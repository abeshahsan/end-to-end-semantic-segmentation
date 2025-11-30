import type { SegmentationResult } from "../types";

export async function segmentImage(
	file: File,
	options: { overlay?: boolean; returnOriginal?: boolean } = {}
): Promise<SegmentationResult> {
	const formData = new FormData();
	formData.append("image", file);

	const params = new URLSearchParams();
	params.set("mask_format", "png");
	if (options.overlay) params.set("overlay", "true");
	if (options.returnOriginal) params.set("return_original", "true");

	const response = await fetch(`/api/segment?${params}`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`Server error: ${response.status}`);
	}

	const data = await response.json();

	return {
		success: data.success,
		mask: `data:image/png;base64,${data.mask}`,
		overlay: data.overlay ? `data:image/png;base64,${data.overlay}` : undefined,
		original: data.original ? `data:image/png;base64,${data.original}` : undefined,
		width: data.width,
		height: data.height,
		classes: data.classes,
		imageName: file.name,
	};
}

export function validateFile(file: File): {
	valid: boolean;
	error?: { type: "size" | "format"; message: string; details: string };
} {
	const MAX_SIZE = 10 * 1024 * 1024; // 10MB
	const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
	const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

	// Check file size
	if (file.size > MAX_SIZE) {
		const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
		return {
			valid: false,
			error: {
				type: "size",
				message: `File too large (${sizeMB} MB)`,
				details:
					"Maximum file size is 10MB. Try compressing your image using tools like TinyPNG.com or reduce the resolution.",
			},
		};
	}

	// Check file type
	const extension = "." + file.name.split(".").pop()?.toLowerCase();
	if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(extension)) {
		const detectedFormat = file.type || extension.toUpperCase().replace(".", "");
		return {
			valid: false,
			error: {
				type: "format",
				message: `Unsupported format: ${detectedFormat}`,
				details:
					"We only support JPG and PNG formats. You can convert your image using CloudConvert.com or similar tools.",
			},
		};
	}

	return { valid: true };
}
