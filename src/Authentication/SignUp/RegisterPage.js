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
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { register } from "../Login/CallAPILogin"; // Đảm bảo bạn đã có API đăng ký

const defaultTheme = createTheme();
const availableRoles = ['Student', 'Parent', 'Teacher', 'Admin'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student'); // Trạng thái để lưu vai trò của người dùng
  const [userName, setUserName] = useState(''); // Trạng thái để lưu tên người dùng
  const [errorMessage, setErrorMessage] = useState(''); // Để hiển thị thông báo lỗi nếu có
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const data = new FormData(event.currentTarget);
    const userData = {
      userName: (data.get('userName') || '').toString().trim(),
      email: (data.get('email') || '').toString().trim(),
      password: (data.get('password') || '').toString(),
    };
    const selectedRole = (data.get('role') || '').toString().trim();

    if (!selectedRole) {
      setErrorMessage('Role is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Gọi API đăng ký với userData và selectedRole
      const response = await register(userData, selectedRole);
      console.log('User registered successfully:', response);
      setSuccessMessage('Account created. Please check your email to confirm your account, then sign in.');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage(error.message || "Error registering user, please try again."); // Hiển thị thông báo lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value); // Cập nhật vai trò khi người dùng thay đổi
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value); // Cập nhật tên người dùng khi người dùng thay đổi
  };

  return (
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
          {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>} {/* Hiển thị thông báo lỗi nếu có */}
          {successMessage && <div style={{ color: '#2e7d32', marginBottom: '10px' }}>{successMessage}</div>}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  value={userName}
                  onChange={handleUserNameChange}
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  id="role"
                  label="Role"
                  name="role"
                  autoComplete="role"
                  value={role}
                  onChange={handleRoleChange}
                >
                  {availableRoles.map((availableRole) => (
                    <MenuItem key={availableRole} value={availableRole}>
                      {availableRole}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions, and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
