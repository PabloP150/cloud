import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CssBaseline,
  Avatar,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4a90e2',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(0, 0, 0, 0.6)',
    },
  },
});

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('Archivo seleccionado:', file);
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToAzure = async (file) => {
    const sasToken = 'sp=racwdli&st=2024-11-16T17:11:12Z&se=2024-11-24T01:11:12Z&sv=2022-11-02&sr=c&sig=eQxx4c6%2FHthsNd0Ds6UJfWJstjjFikTWMFjquMupSGU%3D'; // Reemplaza con tu SAS token
    const containerName = 'taskmatecontainer'; // Nombre de tu contenedor
    const blobName = `${Date.now()}_${file.name}`;
    const blobUrl = `https://taskmatestorage1.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

    const response = await fetch(blobUrl, {
        method: 'PUT',
        headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': file.type,
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error('Error al subir la imagen a Azure');
    }

    return blobUrl; // Devuelve la URL de la imagen subida
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        console.error('No se ha seleccionado ninguna imagen.');
        return;
      }

      // Subir imagen a Azure
      const imageUrl = await uploadImageToAzure(image);

      const response = await fetch('http://52.173.30.244:9000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, imageUrl, email }), // Envía la URL de la imagen y el correo electrónico
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        localStorage.setItem('imageUrl', imageUrl); // Asegúrate de guardar la URL
        navigate('/'); // Redirige a la página de inicio de sesión
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'url(/1.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
          <Paper elevation={6} sx={{ p: 4, backgroundColor: 'background.paper', borderRadius: 2 }}>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" onSubmit={handleRegister} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span" sx={{ mt: 2 }}>
                  Subir Imagen de Perfil
                </Button>
              </label>
              {imagePreview && (
                <Avatar
                  alt="Imagen de perfil"
                  src={imagePreview}
                  sx={{ width: 56, height: 56, mt: 2 }}
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Register;