import axios from 'axios';

function FileItem({ file, onDeleteSuccess }) {

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${file.originalName}?`)) {
      try {
        await axios.delete(`http://localhost:5001/api/files/${file._id}`);
        alert('File deleted successfully');
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (error) {
        console.error('Failed to delete file:', error);
        alert('Failed to delete file');
      }
    }
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>
      <span>{file.originalName} ({formatBytes(file.size)})</span>
      <div>
        <a href={file.url} download={file.originalName} style={{ marginRight: '10px' }}>
          <button>Download</button>
        </a>
        <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
      </div>
    </div>
  );
}

export default FileItem;