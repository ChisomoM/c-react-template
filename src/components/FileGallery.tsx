import React from 'react';
import { getPDFThumbnail } from '../lib/cloudinary';

interface FileItem {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  pages?: number;
}

interface FileGalleryProps {
  files: FileItem[];
  onRemove: (index: number) => void;
  className?: string;
}

export const FileGallery: React.FC<FileGalleryProps> = ({
  files,
  onRemove,
  className = ''
}) => {
  if (files.length === 0) return null;

  const images = files.filter(file => file.format !== 'pdf');
  const pdfs = files.filter(file => file.format === 'pdf');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Images Gallery */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Images ({images.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {images.map((file) => {
              const actualIndex = files.indexOf(file);
              return (
                <div key={file.publicId} className="relative group">
                  <img
                    src={file.url}
                    alt={`Uploaded ${file.format}`}
                    className="w-full h-20 sm:h-24 md:h-28 lg:h-32 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(actualIndex)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                    title="Remove image"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                    {file.format.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PDFs Gallery */}
      {pdfs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Documents ({pdfs.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {pdfs.map((file, index) => {
              const actualIndex = files.indexOf(file);
              return (
                <div key={file.publicId} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={getPDFThumbnail(file.publicId)}
                        alt={`PDF ${index + 1} thumbnail`}
                        className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded border shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            Document {index + 1}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {file.pages || 1} page{(file.pages || 1) !== 1 ? 's' : ''} • {(file.bytes / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(actualIndex)}
                          className="flex-shrink-0 ml-2 text-red-600 hover:text-red-800 p-1"
                          title="Remove document"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          View PDF
                        </a>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-500 uppercase">{file.format}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
