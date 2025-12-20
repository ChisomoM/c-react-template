import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageUpload } from '../hooks/useImageUpload';

interface FileUploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  pages?: number;
}

interface FileUploadProps {
  onUpload: (result: FileUploadResult) => void;
  acceptImages?: boolean;
  acceptPDFs?: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptImages = true,
  acceptPDFs = false,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  className = '',
  label = 'Drop files here...'
}) => {
  const { uploadFile, uploadMultiple, uploading, progress, error } = useImageUpload();

  const acceptedTypes: Record<string, string[]> = {};
  if (acceptImages) {
    acceptedTypes['image/*'] = ['.jpeg', '.jpg', '.png', '.webp', '.gif'];
  }
  if (acceptPDFs) {
    acceptedTypes['application/pdf'] = ['.pdf'];
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 1) {
        const result = await uploadFile(acceptedFiles[0]);
        onUpload(result);
      } else {
        const results = await uploadMultiple(acceptedFiles);
        results.forEach(result => onUpload(result));
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Error handled by hook
    }
  }, [uploadFile, uploadMultiple, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles,
    disabled: uploading,
    multiple: maxFiles > 1
  });

  const getSupportedFormats = () => {
    const formats = [];
    if (acceptImages) formats.push('JPG, PNG, WebP, GIF');
    if (acceptPDFs) formats.push('PDF');
    return formats.join(', ');
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-600 text-sm sm:text-base">Drop files here...</p>
        ) : (
          <div>
            <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              {label}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Supports: {getSupportedFormats()} (max {maxSize / 1024 / 1024}MB each)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-xs sm:text-sm">{error}</div>
      )}
    </div>
  );
};
