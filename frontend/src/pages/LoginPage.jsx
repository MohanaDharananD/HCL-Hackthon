import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await authAPI.login({ email: form.email, password: form.password });
        localStorage.setItem('retail_token', res.data.token);
        login(res.data.user);
      } else {
        const res = await authAPI.register(form);
        localStorage.setItem('retail_token', res.data.token);
        login(res.data.user);
      }
      navigate('/');
    } catch (err) {
      // Demo mode: allow login without backend
      if (err.code === 'ERR_NETWORK') {
        const demoUser = {
          id: '1',
          name: form.name || form.email.split('@')[0],
          email: form.email,
          role: form.email.includes('admin') ? 'ADMIN' : 'USER',
        };
        login(demoUser);
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" id="login-page">
      {/* Decorative background */}
      <div className="login-bg">
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
      </div>

      <div className="login-container">
        {/* Left - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <span className="branding-icon">🛒</span>
            <h1 className="branding-title">
              Retail<span className="branding-accent">Hub</span>
            </h1>
            <p className="branding-subtitle">
              Your one-stop shop for premium products at unbeatable prices
            </p>
            <div className="branding-features">
              <div className="feature-item">
                <span className="feature-dot" />
                <span>Free shipping on orders over ₹999</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot" />
                <span>100% secure payments</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot" />
                <span>Easy 30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="login-form-section">
          <div className="login-card animate-scaleIn">
            <div className="card-header">
              <h2 className="card-title">{isLogin ? 'Welcome back' : 'Create account'}</h2>
              <p className="card-subtitle">
                {isLogin ? 'Sign in to access your account' : 'Join us and start shopping'}
              </p>
            </div>

            {error && (
              <div className="error-message animate-slideDown">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" id="auth-form">
              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className="input-field input-with-icon"
                      value={form.name}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input-field input-with-icon"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    className="input-field input-with-icon"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg submit-btn"
                disabled={loading}
                id="auth-submit"
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="card-footer">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  className="switch-btn"
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  id="auth-switch"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
