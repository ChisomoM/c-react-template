export const getCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    page?: number; // For PDFs
  } = {}
) => {
  const { VITE_CLOUDINARY_CLOUD_NAME } = import.meta.env;

  if (!VITE_CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.page) transformations.push(`pg_${options.page}`); // PDF page

  const transformationString = transformations.length > 0
    ? transformations.join(',') + '/'
    : '';

  return `https://res.cloudinary.com/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
};

// For PDF thumbnails
export const getPDFThumbnail = (publicId: string, page: number = 1) => {
  return getCloudinaryUrl(publicId, {
    page,
    width: 300,
    height: 400,
    crop: 'fill',
    format: 'jpg'
  });
};
