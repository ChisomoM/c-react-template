import { useState } from 'react';

interface UploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  pages?: number; // For PDFs
}

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
  width: number;
  height: number;
  pages?: number;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
    const { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET } = import.meta.env;

    if (!VITE_CLOUDINARY_CLOUD_NAME || !VITE_CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'vite-app/uploads');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    return response.json();
  };

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      // Client-side validation
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        throw new Error('Please select an image or PDF file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large (max 5MB)');
      }

      setProgress(30);

      const result = await uploadToCloudinary(file);

      setProgress(100);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        pages: result.pages // For PDFs
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const uploadMultiple = async (files: File[]) => {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFile(files[i]);
      results.push(result);
    }
    return results;
  };

  return {
    uploadFile,
    uploadMultiple,
    uploading,
    progress,
    error
  };
};
