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
import { register } from "../Login/CallAPILogin"; // Đảm bảo bạn đã có API đăng ký

const defaultTheme = createTheme();

export default function RegisterPage() {
  const [role, setRole] = useState(''); // Trạng thái để lưu vai trò của người dùng
  const [userName, setUserName] = useState(''); // Trạng thái để lưu tên người dùng
  const [errorMessage, setErrorMessage] = useState(''); // Để hiển thị thông báo lỗi nếu có

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const data = new FormData(event.currentTarget);
    const userData = {
      userName: data.get('userName'),
      email: data.get('email'),
      password: data.get('password'),
    };
    const selectedRole = data.get('role');

    try {
      // Gọi API đăng ký với userData và selectedRole
      const response = await register(userData, selectedRole);
      console.log('User registered successfully:', response);
      // Xử lý đăng ký thành công (ví dụ: chuyển hướng đến trang đăng nhập)
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage("Error registering user, please try again."); // Hiển thị thông báo lỗi
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
                  id="role"
                  label="Role"
                  name="role"
                  autoComplete="role"
                  value={role}
                  onChange={handleRoleChange}
                />
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
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/Login" variant="body2">
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
