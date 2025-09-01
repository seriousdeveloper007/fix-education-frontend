export const imageService = {
    // Convert file to data URL
    dataUrlFromFile: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    
    // Create complete image object for attachments
    createImageObject: async (file) => {
      const dataUrl = await imageService.dataUrlFromFile(file);
      const objectUrl = URL.createObjectURL(file);
      
      return {
        file,
        url: objectUrl,
        dataUrl,
        mime: file.type,
        name: file.name || 'pasted-image.png',
      };
    },
    
    // Cleanup image URL
    revokeImageUrl: (imageObj) => {
      if (imageObj?.url) {
        URL.revokeObjectURL(imageObj.url);
      }
    },
    
    // Validate image
    validateImage: (file) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
      }
      
      return true;
    }
  };