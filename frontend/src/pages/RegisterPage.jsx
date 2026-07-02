
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./AuthPage.module.css";
export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await register(form.name, form.email, form.password); toast.success("Account created!"); navigate("/"); }
    catch (err) { toast.error(err.response && err.response.data ? err.response.data.message : "Registration failed"); }
    finally { setLoading(false); }
  };
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>TF</div>
          <span className={styles.brandName}>TaskFlow</span>
        </div>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Start managing tasks beautifully</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}><label>Full Name</label><input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" /></div>
          <div className={styles.field}><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" /></div>
          <div className={styles.field}><label>Password</label><input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters" minLength={6} /></div>
          <button type="submit" disabled={loading} className={styles.btn}>{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <p className={styles.switchText}>Have account? <Link to="/login" className={styles.switchLink}>Sign in</Link></p>
      </div>
    </div>
  );
}
