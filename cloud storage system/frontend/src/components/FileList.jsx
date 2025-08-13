import FileItem from './FileItem';

function FileList({ files, onDeleteSuccess }) {
  if (files.length === 0) {
    return <p>No files found. Try uploading one!</p>;
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      {files.map((file) => (
        <FileItem key={file._id} file={file} onDeleteSuccess={onDeleteSuccess} />
      ))}
    </div>
  );
}

export default FileList;