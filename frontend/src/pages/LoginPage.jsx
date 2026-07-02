
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./AuthPage.module.css";
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await login(form.email, form.password); toast.success("Welcome back!"); navigate("/"); }
    catch (err) { toast.error(err.response && err.response.data ? err.response.data.message : "Login failed"); }
    finally { setLoading(false); }
  };
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>TF</div>
          <span className={styles.brandName}>TaskFlow</span>
        </div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your workspace</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" /></div>
          <div className={styles.field}><label>Password</label><input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter password" /></div>
          <button type="submit" disabled={loading} className={styles.btn}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className={styles.switchText}>No account? <Link to="/register" className={styles.switchLink}>Create one</Link></p>
      </div>
    </div>
  );
}
