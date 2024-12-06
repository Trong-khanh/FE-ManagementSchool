import React, { useState } from 'react';

function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && username) {
            console.log('Sending password reset request for:', username, email);
            setMessage('Nếu thông tin bạn cung cấp tồn tại trong hệ thống của chúng tôi, chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.');
        } else {
            setMessage('Vui lòng nhập tất cả thông tin yêu cầu.');
        }
    };

    return (
        <div className="forgot-password-container">
            <style>
                {`
                    .forgot-password-container {
                        max-width: 400px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        background-color: #f9f9f9;
                    }

                    .forgot-password-container h2 {
                        text-align: center;
                        color: #333;
                    }

                    .forgot-password-container form {
                        display: flex;
                        flex-direction: column;
                    }

                    .forgot-password-container label {
                        margin-bottom: 10px;
                        color: #666;
                    }

                    .forgot-password-container input {
                        padding: 8px;
                        margin-top: 5px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        width: 100%; /* Đặt chiều rộng đồng nhất cho tất cả input */
                    }

                    .forgot-password-container button {
                        background-color: #0056b3;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 10px;
                    }

                    .forgot-password-container button:hover {
                        background-color: #004494;
                    }

                    .forgot-password-container p {
                        color: red;
                        text-align: center;
                    }
                `}
            </style>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    User Name:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Send</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPassword;
