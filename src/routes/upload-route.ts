import express from 'express';
import upload from '../middlewares/upload';
import cloudinary from '../config/cloudinary';

const router = express.Router();

// Single image upload
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Multiple images upload
router.post('/images',  upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const imageUrls = (req.files as Express.Multer.File[]).map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    res.status(200).json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete image
router.delete('/image/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({
      message: 'Image deleted successfully',
      result
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;