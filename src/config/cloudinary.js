const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: "nhaxinh/product"
  }
});


async function deleteImages(files) {
  try {
    const deletionPromises = files.map(async (item) => {
      const result = await cloudinary.uploader.destroy([`${item.filename}`], {
        type: 'upload',
        resource_type: 'image'
      });
      console.log(result);
      return result;
    });

    // Wait for all deletions to complete
    const results = await Promise.all(deletionPromises);
    return results;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it at the higher level if needed
  }
}

const uploadCloud = multer({ storage });

module.exports = { uploadCloud, deleteImages };
