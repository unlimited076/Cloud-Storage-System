const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    localFilename: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


FileSchema.virtual('url').get(function() {
    const baseUrl = process.env.BASE_URL || 'http://54.252.42.147:5001';
    return `${baseUrl}/uploads/${this.localFilename}`;
});

module.exports = mongoose.model('File', FileSchema);