import axios from 'axios';

const API_URL = '/api';

export const uploadPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('photo', file);
  
  try {
    const response = await axios.post(`${API_URL}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.photoId;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('Failed to upload photo');
  }
};

export const generateResponse = async (photo: File, question: string) => {
  const formData = new FormData();
  formData.append('photo', photo);
  formData.append('question', question);
  
  try {
    const response = await axios.post(`${API_URL}/generate-response`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      videoUrl: response.data.videoUrl,
      text: response.data.text
    };
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}; 