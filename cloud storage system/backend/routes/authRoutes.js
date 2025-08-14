
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

/**
 * @route   
 * @desc    
 * @access  
 */
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

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
