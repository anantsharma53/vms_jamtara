
import './Login.css';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header/Header';

function Login() {
    const [user, setUser] = useState({ username: "", password: "", captcha: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [captchaImg, setCaptchaImg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const fetchCaptcha = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/generate-captcha/', {
                credentials: 'include',
            });
            const data = await res.json();
            setCaptchaImg(data.captcha_image);
        } catch (error) {
            console.error("CAPTCHA fetch error:", error);
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

   
const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
        const res = await fetch("http://localhost:8000/api/signin/", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Login failed");
        }

        const data = await res.json();
        const { user: userData, access } = data;

        localStorage.setItem("token", access);
        localStorage.setItem("user_details", JSON.stringify(userData));

        if (userData?.is_recptionstaff) {
            navigate("/reception-dashboard");
        } else if (userData?.is_candiate) {
            navigate("/public-dashboard");
        } else if (userData?.is_superuser || userData?.is_staff) {
            navigate("/admindasboard");
        } else if (userData?.is_jantadarbar) {
            navigate("/reception-dashboard");
        } else
            {
            navigate("/");  // fallback for any other user
        }

    } catch (err) {
        setErrorMsg(err.message);
        fetchCaptcha();
    }
};
    return (
        <>
            <Header />
            <div className="login-container">

                <h2>Visitor Monitoring System</h2>

                <div className="login-content">
                    <div className="form-container"
                        style={{
                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%)',
                            padding: '1.5rem 0'
                        }}
                    >
                        <div className="logo-wrapper" onClick={() => navigate('/')}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/6/60/Firefox_Home_-_logo.png"
                                alt="logo"
                                className="login-logo"
                            />
                        </div>

                        {errorMsg && <div className="error-message">{errorMsg}</div>}

                        <form onSubmit={handleSubmit} id="loginForm" style={{ marginLeft: '10%', marginRight: '10%' }}>
                            <div className="form-control-group">
                                <label className="form-label" htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    value={user.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control-group password-container">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title="Show/Hide Password"
                                >
                                    👁️
                                </button>
                            </div>

                            <div className="forgot-password-link">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>

                            {captchaImg && (
                                <>
                                    <img src={captchaImg} alt="CAPTCHA" className="captcha-img" />
                                    <div style={{ textAlign: "center" }}>
                                        <button type="button" 
                                        className="refresh-captcha"
                                        onClick={fetchCaptcha}>
                                            🔄 Refresh CAPTCHA
                                        </button>
                                    </div>
                                    <div className="form-control-group">
                                        <label className="form-label">Enter CAPTCHA</label>
                                        <input
                                            type="text"
                                            name="captcha"
                                            className="form-control"
                                            value={user.captcha}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <button type="submit" className="loginbutton">
                                Log In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
