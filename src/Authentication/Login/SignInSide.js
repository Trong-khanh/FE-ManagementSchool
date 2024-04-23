import React, { useState } from 'react';
import { login } from "./CallAPILogin";
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const defaultTheme = createTheme();

const SignInSide = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleGoogleResponse = (response) => {
        if (response) {
            const { email, name, picture } = response;
            // Xử lý thông tin người dùng đăng nhập bằng Google tại đây
            // Ví dụ: gọi API đăng nhập với email và tên người dùng
            console.log('Google Sign-In Success:', { email, name, picture });
        }
    };

    const handleGoogleFailure = (error) => {
        console.log('Google Sign-In Error:', error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            username,
            password,
            rememberMe
        };

        try {
            console.log(username)
            console.log(password)
            const data = await login(credentials);
            if (data && data.accessToken) {
                console.log('User logged in successfully.');
                setLoggedIn(true);
            } else {
                console.error("Login was successful but no token was received.");
                setErrorMessage("Login was successful but no token was received.");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "An error occurred during login.";
            setErrorMessage(errorMsg);
            console.error("Login error:", errorMsg);
        }
    };

    if (loggedIn) {
        navigate('/admin');
        window.location.reload();
    }

    return (
        <GoogleOAuthProvider clientId="862905097670-678pkbir60a8v0jk4v75ua6nsu4j3k40.apps.googleusercontent.com">
            <ThemeProvider theme={defaultTheme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="userName"
                                    label="User Name"
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
                                <FormControlLabel
                                    control={<Checkbox value={rememberMe} color="primary" onChange={(e) => setRememberMe(e.target.checked)} />}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="ForgotPassword" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="SignUp" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <GoogleLogin
                                    onSuccess={handleGoogleResponse}
                                    onFailure={handleGoogleFailure}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
};

export default SignInSide;