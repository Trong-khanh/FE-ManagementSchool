import React, {useState} from 'react';
import {login} from "./CallAPILogin";
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate(); // Get the navigate function

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
        navigate('/');
        window.location.reload();
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div style={{
                margin: '20px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                maxWidth: '400px'
            }}>
                <h2>Login</h2>
                {errorMessage && <div style={{color: 'red', marginBottom: '10px'}}>{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '10px'}}>
                        <label>Email:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label>
                            <input type="checkbox" checked={rememberMe}
                                   onChange={(e) => setRememberMe(e.target.checked)}/>
                            Remember me
                        </label>
                    </div>
                    <button type="submit" style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}>Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;