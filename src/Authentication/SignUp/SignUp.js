import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const defaultTheme = createTheme();

export default function SignUp() {
  const [role, setRole] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [userName, setUserName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      userName: userName || googleUser?.name || data.get('userName'),
      email: data.get('email') || googleUser?.email,
      password: data.get('password'),
      role: role,
    };

    console.log(userData);
    // Gọi API đăng ký tại đây với userData
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleGoogleResponse = (response) => {
    if (response) {
      const { email, name, picture } = response;
      setGoogleUser({ email, name, imageUrl: picture });
      setShowRoleSelect(true);
    }
  };

  const handleGoogleFailure = (error) => {
    console.log('Google Sign-In Error:', error);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  return (
      <GoogleOAuthProvider clientId="862905097670-678pkbir60a8v0jk4v75ua6nsu4j3k40.apps.googleusercontent.com">
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                {!googleUser && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                            autoComplete="userName"
                            name="userName"
                            required
                            fullWidth
                            id="userName"
                            label="User Name"
                            autoFocus
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                      </Grid>
                    </Grid>
                )}
                {showRoleSelect && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                            autoComplete="userName"
                            name="userName"
                            required
                            fullWidth
                            id="userName"
                            label="User Name"
                            value={userName}
                            onChange={handleUserNameChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Select
                            labelId="role-select-label"
                            id="role"
                            name="role"
                            value={role}
                            onChange={handleRoleChange}
                            fullWidth
                            displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Choose Role
                          </MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="student">Student</MenuItem>
                          <MenuItem value="teacher">Teacher</MenuItem>
                          <MenuItem value="parent">Parent</MenuItem>
                        </Select>
                      </Grid>
                    </>
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                      control={<Checkbox value="allowExtraEmails" color="primary" />}
                      label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <GoogleLogin
                    onSuccess={handleGoogleResponse}
                    onFailure={handleGoogleFailure}
                />
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="Login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </GoogleOAuthProvider>
  );
}