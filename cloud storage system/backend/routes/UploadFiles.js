const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const File = require('../models/File');

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

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        
        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload a file' });
        }

        const { filename, originalname, size, mimetype } = req.file;

        
        const newFile = new File({
            localFileName: filename,
            originalName: originalname,
            size: size,
            mimeType: mimetype,
            owner: req.user.id,
        });

        await newFile.save();

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

        res.json({
            message: 'File uploaded successfully!',
            file: {
                ...newFile.toObject(),
                url: fileUrl 
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;