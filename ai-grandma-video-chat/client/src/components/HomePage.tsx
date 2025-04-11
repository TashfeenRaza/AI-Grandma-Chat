import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import PhotoUploader from './PhotoUploader';
import VideoPlayer from './VideoPlayer';
import { uploadPhoto, generateResponse } from '../services/api';

interface ResponseData {
  videoUrl: string;
  text: string;
}

const HomePage = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handlePhotoUpload = async (file: File) => {
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
    setIsLoading(true);
    setError('');
    
    try {
      const photoId = await uploadPhoto(file);
      setUploadSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!photo || !question.trim()) {
      setError('Please upload a photo and enter a question.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const data = await generateResponse(photo, question);
      setResponseData(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to generate response. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Box className="album-page">
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Talk to AI Grandma
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                1. Upload Grandma's Photo
              </Typography>
              
              <PhotoUploader 
                onPhotoUpload={handlePhotoUpload} 
                photoUrl={photoUrl}
              />
              
              {uploadSuccess && (
                <Typography 
                  color="success.main" 
                  sx={{ mt: 2, textAlign: 'center' }}
                >
                  Photo uploaded successfully!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                2. Ask Grandma a Question
              </Typography>
              
              <TextField
                label="Type your question..."
                fullWidth
                multiline
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={!uploadSuccess || isLoading}
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmitQuestion}
                disabled={!uploadSuccess || !question.trim() || isLoading}
              >
                Ask Grandma
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card sx={{ minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardContent sx={{ width: '100%', textAlign: 'center' }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="loading-spinner" />
                  <Typography sx={{ mt: 2 }}>
                    Grandma is thinking about your question...
                  </Typography>
                </Box>
              ) : responseData ? (
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Grandma's Response:
                  </Typography>
                  <VideoPlayer videoUrl={responseData.videoUrl} />
                  <Typography sx={{ mt: 2, fontStyle: 'italic' }}>
                    "{responseData.text}"
                  </Typography>
                </Box>
              ) : (
                <Typography>
                  Upload a photo and ask a question to see Grandma's response
                </Typography>
              )}
              
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage; 