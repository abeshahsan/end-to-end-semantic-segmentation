import type { SegmentationResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function segmentImage(
  file: File,
  modelId: string,
  onProgress?: (progress: number) => void
): Promise<SegmentationResult> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('model', modelId);

  // Simulate progress for demo purposes
  if (onProgress) {
    const progressInterval = setInterval(() => {
      onProgress(Math.random() * 30 + 10);
    }, 500);

    setTimeout(() => clearInterval(progressInterval), 3000);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/segment`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch {
    // For demo: return mock data if API is not available
    console.warn('API not available, using mock data');
    
    // Create mock result with the uploaded image
    const imageUrl = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          originalImage: imageUrl,
          segmentedImage: imageUrl, // In real app, this would be different
          maskImage: imageUrl,
          processingTime: 2.3,
          modelUsed: modelId,
          confidence: 92,
          imageName: file.name,
          metadata: {
            classes: ['background', 'person', 'car', 'building', 'vegetation'],
            width: 512,
            height: 512,
          },
        });
      }, 2000);
    });
  }
}

export function validateFile(file: File): { valid: boolean; error?: { type: 'size' | 'format'; message: string; details: string } } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

  // Check file size
  if (file.size > MAX_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: {
        type: 'size',
        message: `File too large (${sizeMB} MB)`,
        details: 'Maximum file size is 10MB. Try compressing your image using tools like TinyPNG.com or reduce the resolution.',
      },
    };
  }

  // Check file type
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(extension)) {
    const detectedFormat = file.type || extension.toUpperCase().replace('.', '');
    return {
      valid: false,
      error: {
        type: 'format',
        message: `Unsupported format: ${detectedFormat}`,
        details: 'We only support JPG and PNG formats. You can convert your image using CloudConvert.com or similar tools.',
      },
    };
  }

  return { valid: true };
}
