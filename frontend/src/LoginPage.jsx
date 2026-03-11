// ============================================================================
// LOGIN PAGE  —  src/LoginPage.jsx
// Light/white theme matching the ArduinoDumper dashboard exactly.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { loginWithStudentId, parseAuthError } from './authService';

const injectStyles = () => {
  if (document.getElementById('lp-styles')) return;
  const s = document.createElement('style');
  s.id = 'lp-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    @keyframes lp-fadeIn  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes lp-shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
    @keyframes lp-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes lp-popIn   { 0%{opacity:0;transform:scale(0.9)} 70%{transform:scale(1.03)} 100%{opacity:1;transform:scale(1)} }
    @keyframes lp-pulse   { 0%,100%{opacity:1} 50%{opacity:0.45} }

    .lp-root {
      min-height: 100vh;
      background: linear-gradient(155deg, #eef2ff 0%, #f0f4ff 40%, #f8f9ff 100%);
      display: flex;
      align-items: stretch;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* ── LEFT brand panel ── */
    .lp-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 64px 72px;
      position: relative;
      overflow: hidden;
    }
    .lp-left::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 60% 50% at 20% 30%, rgba(37,99,235,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 50% 60% at 80% 70%, rgba(99,102,241,0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .lp-brand-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 7px 14px;
      background: rgba(37,99,235,0.08);
      border: 1px solid rgba(37,99,235,0.18);
      border-radius: 100px;
      margin-bottom: 28px;
      width: fit-content;
    }
    .lp-dot { width:7px;height:7px;border-radius:50%;background:#2563eb;animation:lp-pulse 2s ease-in-out infinite; }
    .lp-badge-txt { font-size:11px;font-weight:600;color:#2563eb;letter-spacing:1px;text-transform:uppercase; }
    .lp-title {
      font-size: clamp(30px, 3.5vw, 46px);
      font-weight: 700;
      color: #0f172a;
      line-height: 1.12;
      letter-spacing: -1px;
      margin-bottom: 16px;
    }
    .lp-title span {
      background: linear-gradient(135deg, #2563eb, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .lp-desc { font-size:15px;color:#64748b;line-height:1.7;margin-bottom:44px;max-width:360px; }
    .lp-features { display:flex;flex-direction:column;gap:18px; }
    .lp-feat {
      display: flex; align-items: flex-start; gap: 14px;
      animation: lp-fadeIn .5s ease both;
    }
    .lp-feat-icon {
      width:40px;height:40px;border-radius:11px;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;flex-shrink:0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .lp-feat-title { font-size:13px;font-weight:600;color:#1e293b;margin-bottom:2px; }
    .lp-feat-sub   { font-size:12px;color:#94a3b8;line-height:1.5; }

    /* decorative floating emojis */
    .lp-deco { position:absolute;pointer-events:none;opacity:0.055; font-size:80px; }
    .lp-deco1 { bottom:60px;left:40px;transform:rotate(-12deg); }
    .lp-deco2 { top:80px;right:40px;font-size:56px;transform:rotate(10deg); }

    /* ── DIVIDER ── */
    .lp-divider {
      width: 1px;
      background: linear-gradient(to bottom, transparent, #dde3f0 20%, #dde3f0 80%, transparent);
    }

    /* ── RIGHT form panel ── */
    .lp-right {
      width: 460px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 52px;
      background: white;
      box-shadow: -4px 0 40px rgba(0,0,0,0.04);
    }
    .lp-form-wrap { animation: lp-fadeIn .6s cubic-bezier(.16,1,.3,1) .08s both; }

    .lp-logo { height:36px;object-fit:contain;margin-bottom:28px; }

    .lp-form-title { font-size:22px;font-weight:700;color:#0f172a;margin-bottom:6px;letter-spacing:-0.4px; }
    .lp-form-sub   { font-size:13px;color:#94a3b8;margin-bottom:32px; }

    /* inputs */
    .lp-field { margin-bottom:16px; }
    .lp-label {
      font-size:11px;font-weight:600;color:#64748b;
      letter-spacing:0.7px;text-transform:uppercase;
      display:block;margin-bottom:7px;
    }
    .lp-input-wrap { position:relative; }
    .lp-input-ico  { position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none; }
    .lp-input {
      width:100%;
      padding:13px 14px 13px 42px;
      border: 1.5px solid #e2e8f0;
      border-radius: 11px;
      font-size: 14px;
      font-family: 'JetBrains Mono', monospace;
      color: #0f172a;
      background: #f8fafc;
      outline: none;
      transition: all .18s;
      letter-spacing: .3px;
    }
    .lp-input::placeholder { color:#cbd5e1; }
    .lp-input:focus {
      border-color: #93c5fd;
      background: white;
      box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
    }
    .lp-input.err {
      border-color: #fca5a5;
      background: #fff5f5;
      animation: lp-shake .35s ease;
    }
    .lp-eye {
      position:absolute;right:12px;top:50%;transform:translateY(-50%);
      background:none;border:none;cursor:pointer;font-size:15px;
      color:#94a3b8;padding:4px;transition:color .15s;
    }
    .lp-eye:hover { color:#64748b; }

    /* error box */
    .lp-error {
      margin-top:8px;padding:9px 13px;
      background:#fff5f5;border:1px solid #fecaca;border-radius:8px;
      font-size:12px;color:#dc2626;display:flex;align-items:center;gap:8px;
      animation:lp-fadeIn .2s ease;
    }

    /* remember + forgot */
    .lp-row {
      display:flex;align-items:center;justify-content:space-between;
      margin:12px 0 24px;
    }
    .lp-remember { display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none; }
    .lp-checkbox {
      width:15px;height:15px;border-radius:4px;
      border:1.5px solid #e2e8f0;background:#f8fafc;
      display:flex;align-items:center;justify-content:center;
      font-size:9px;color:#2563eb;transition:all .15s;cursor:pointer;
    }
    .lp-checkbox.on { background:#eff6ff;border-color:#93c5fd; }
    .lp-remember-txt { font-size:12px;color:#64748b; }
    .lp-forgot { font-size:12px;color:#2563eb;cursor:pointer;text-decoration:none; }
    .lp-forgot:hover { color:#1d4ed8; }

    /* submit button */
    .lp-btn {
      width:100%;padding:14px;border:none;border-radius:11px;
      font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
      cursor:pointer;transition:all .18s;
      display:flex;align-items:center;justify-content:center;gap:8px;
    }
    .lp-btn.active {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      box-shadow: 0 6px 20px rgba(37,99,235,0.22);
    }
    .lp-btn.active:hover  { transform:translateY(-1px);box-shadow:0 10px 26px rgba(37,99,235,0.28); }
    .lp-btn.active:active { transform:translateY(0); }
    .lp-btn.disabled { background:#f1f5f9;color:#94a3b8;cursor:not-allowed; }

    .lp-spinner {
      width:15px;height:15px;border-radius:50%;
      border:2px solid rgba(255,255,255,0.4);border-top-color:white;
      animation:lp-spin .7s linear infinite;
    }

    /* success */
    .lp-success { text-align:center;animation:lp-popIn .4s ease; }
    .lp-success-ico { font-size:52px;margin-bottom:14px;display:block; }
    .lp-success-title { font-size:18px;font-weight:700;color:#059669;margin-bottom:6px; }
    .lp-success-sub   { font-size:13px;color:#94a3b8; }

    /* bottom note */
    .lp-note { margin-top:24px;font-size:11px;color:#cbd5e1;text-align:center;line-height:1.7; }
    .lp-note span { display:block;margin-top:4px;color:#94a3b8; }

    /* security pills */
    .lp-pills { display:flex;gap:8px;justify-content:center;margin-top:18px; }
    .lp-pill {
      display:flex;align-items:center;gap:4px;
      padding:4px 10px;border-radius:6px;
      background:#f8fafc;border:1px solid #e2e8f0;
      font-size:10px;color:#94a3b8;
    }

    @media(max-width:860px){
      .lp-root  { flex-direction:column; }
      .lp-left  { padding:40px 32px 28px; }
      .lp-divider{ width:100%;height:1px;background:linear-gradient(to right,transparent,#dde3f0 20%,#dde3f0 80%,transparent); }
      .lp-right { width:100%;padding:36px 32px 48px; }
      .lp-deco1,.lp-deco2 { display:none; }
    }
  `;
  document.head.appendChild(s);
};

const FEATURES = [
  { icon:'🤖', bg:'#eff6ff', title:'Arduino & ESP32 IDE',   sub:'Write, compile and flash code from your browser' },
  { icon:'📡', bg:'#f0fdf4', title:'Real Hardware Flash',    sub:'Connect boards via USB and upload in one click' },
  { icon:'📚', bg:'#fdf4ff', title:'Guided Lab Projects',    sub:'Step-by-step experiments with live sensor output' },
];

export default function LoginPage({ onLoginSuccess }) {
  const [studentId, setStudentId] = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [fieldErr,  setFieldErr]  = useState('');  // 'id' | 'pw' | 'both'
  const [success,   setSuccess]   = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const clear = () => { setError(''); setFieldErr(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clear();
    if (!studentId.trim()) { setFieldErr('id'); setError('Please enter your Student ID.'); return; }
    if (!password)         { setFieldErr('pw'); setError('Please enter your password.');   return; }

    setLoading(true);
    try {
      const user = await loginWithStudentId(studentId.trim(), password, remember);
      setSuccess(true);
      setTimeout(() => { if (onLoginSuccess) onLoginSuccess(user); }, 1400);
    } catch (err) {
      setError(parseAuthError(err));
      setFieldErr('both');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">

      {/* ── LEFT ── */}
      <div className="lp-left">
        <div className="lp-deco lp-deco1">⚡</div>
        <div className="lp-deco lp-deco2">🔧</div>

        <div className="lp-brand-badge">
          <div className="lp-dot" />
          <span className="lp-badge-txt">Tesca Learning Platform</span>
        </div>

        <h1 className="lp-title">
          Build Real Things.<br />
          <span>Learn by Doing.</span>
        </h1>

        <p className="lp-desc">
          The hands-on Arduino & ESP32 learning platform for engineering students.
          Code, flash, and experiment — right from your browser.
        </p>

        <div className="lp-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="lp-feat" style={{ animationDelay:`${0.3 + i * 0.1}s` }}>
              <div className="lp-feat-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div>
                <div className="lp-feat-title">{f.title}</div>
                <div className="lp-feat-sub">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lp-divider" />

      {/* ── RIGHT ── */}
      <div className="lp-right">
        <div className="lp-form-wrap">

          {success ? (
            <div className="lp-success">
              <span className="lp-success-ico">✅</span>
              <div className="lp-success-title">Welcome back!</div>
              <div className="lp-success-sub">Redirecting to your dashboard...</div>
            </div>
          ) : (
            <>
              <img src="/Lab.png" alt="Tesca" className="lp-logo" />
              <div className="lp-form-title">Student Sign In</div>
              <div className="lp-form-sub">Enter your Student ID and password to continue</div>

              <form onSubmit={handleSubmit} noValidate>

                {/* Student ID */}
                <div className="lp-field">
                  <label className="lp-label">🎓 Student ID</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-ico">👤</span>
                    <input
                      className={`lp-input ${fieldErr==='id'||fieldErr==='both' ? 'err' : ''}`}
                      type="text"
                      placeholder="e.g. STU001"
                      value={studentId}
                      onChange={e => { setStudentId(e.target.value.toUpperCase()); clear(); }}
                      autoComplete="username"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="lp-field">
                  <label className="lp-label">🔑 Password</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-ico">🔒</span>
                    <input
                      className={`lp-input ${fieldErr==='pw'||fieldErr==='both' ? 'err' : ''}`}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); clear(); }}
                      autoComplete="current-password"
                      style={{ paddingRight: 44 }}
                    />
                    <button type="button" className="lp-eye" onClick={() => setShowPass(v => !v)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="lp-error"><span>⚠️</span><span>{error}</span></div>
                )}

                {/* Remember + Forgot */}
                <div className="lp-row">
                  <label className="lp-remember" onClick={() => setRemember(v => !v)}>
                    <div className={`lp-checkbox ${remember ? 'on' : ''}`}>{remember && '✓'}</div>
                    <span className="lp-remember-txt">Keep me signed in</span>
                  </label>
                  {/* <a className="lp-forgot" href="#forgot"
                    onClick={e => { e.preventDefault(); alert('Contact your instructor to reset your password.'); }}>
                    Forgot password?
                  </a> */}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`lp-btn ${!loading ? 'active' : 'disabled'}`}
                  disabled={loading}
                >
                  {loading
                    ? <><div className="lp-spinner" /> Signing in...</>
                    : <>⚡ Sign In to Dashboard</>
                  }
                </button>
              </form>

              <div className="lp-note">
                Don't have an account?
                <span>Contact your instructor to get your <strong>Student ID</strong> and credentials.</span>
              </div>

              <div className="lp-pills">
                <div className="lp-pill">🔒 Firebase Auth</div>
                <div className="lp-pill">🛡️ Encrypted</div>
                <div className="lp-pill">☁️ Secure</div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}