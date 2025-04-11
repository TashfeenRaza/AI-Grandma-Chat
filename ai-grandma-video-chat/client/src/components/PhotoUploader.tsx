import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface PhotoUploaderProps {
  onPhotoUpload: (file: File) => void;
  photoUrl: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotoUpload, photoUrl }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onPhotoUpload(acceptedFiles[0]);
    }
  }, [onPhotoUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': []
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      {!photoUrl ? (
        <Paper
          {...getRootProps()}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'rgba(123, 92, 61, 0.1)' : 'transparent',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'rgba(123, 92, 61, 0.3)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(123, 92, 61, 0.05)',
              borderColor: 'primary.main'
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" component="div" gutterBottom>
            Drop Grandma's Photo Here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse your files
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Accepts JPG, JPEG, PNG (Max 5MB)
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            position: 'relative'
          }}
        >
          <Box
            className="vintage-photo"
            component="img"
            src={photoUrl}
            alt="Uploaded photo"
            sx={{
              maxWidth: '100%',
              maxHeight: '300px',
              objectFit: 'contain'
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PhotoUploader; 