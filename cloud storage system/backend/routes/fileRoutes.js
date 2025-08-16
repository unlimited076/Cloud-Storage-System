const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const File = require('../models/File'); 
const { protect } = require('../middleware/authMiddleware');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/uploads', protect, upload.single('file'), async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }
    const { filename, originalname, size, mimetype } = req.file;
    const newFile = new File({
      localFilename: filename,
      originalName: originalname,
      size: size,
      mimeType: mimetype,
      owner: req.user.id,
    });
    await newFile.save();
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    res.json({
      message: 'File uploaded successfully!',
      file: { ...newFile.toObject(), url: fileUrl }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }
    if (file.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const filePath = path.join(__dirname, '../uploads', file.localFilename);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Failed to delete file from filesystem:', err);
      }
      await File.deleteOne({ _id: req.params.id });
      res.json({ msg: 'File removed' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;