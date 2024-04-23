import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const clientId = "862905097670-678pkbir60a8v0jk4v75ua6nsu4j3k40.apps.googleusercontent.com";

function LoginPage() {
    const handleLoginSuccess = (response) => {
        console.log('Login successful:', response);
        // Handle response and proceed
        const decoded = jwtDecode(response.credential);
        console.log('Decoded JWT:', decoded);

        const { email, name, sub: googleId, picture } = decoded;

        const userData = {
            email,
            name,
            googleId,
            picture
        };

        console.log('userData: ',userData)
    };

    const handleLoginFailure = (response) => {
        console.log('Login failed:', response);
        // Handle login failure
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="login-container">
                <h2>Login with Google</h2>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    scope="profile email"
                />

            </div>
        </GoogleOAuthProvider>
    );
}

export default LoginPage;