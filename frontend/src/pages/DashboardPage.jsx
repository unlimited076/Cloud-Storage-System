import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import '../App.css'; 

function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const { logout } = useAuth();

  
  const fetchFiles = useCallback(async () => {
    setIsLoading(true); 
    setError(null); 
    try {
      const response = await axios.get('http://localhost:5001/api/files');
      setFiles(response.data);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setError('Cannot loading files. Please try it later.'); 
    } finally {
      setIsLoading(false); 
    }
  }, []);

  
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleSuccess = () => {
    fetchFiles();
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="loading-message">Loading...</p>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    return <FileList files={files} onDeleteSuccess={handleSuccess} />;
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={logout} className="logout-button">Log Out</button>
      </section>

      <main className="dashboard-main">
        <section className="card upload-card">
          <h2>⬆️ Upload New File</h2>
          <FileUpload onUploadSuccess={handleSuccess} />
        </section>

        <section className="card files-card">
          <h2>🗂️ My File</h2>
          {renderContent()}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;