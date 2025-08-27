import React, {useState} from 'react';
import axios from 'axios';

function FileUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://16.176.228.233:5001/api/files/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('File uploaded successfully!');
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed!');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
    }
  };

  return (
    <div>
      <input id="file-input" type="file" onChange={handleFileChange} disabled={isUploading} />
      <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default FileUpload;