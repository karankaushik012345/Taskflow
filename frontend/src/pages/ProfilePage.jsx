
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "./ProfilePage.module.css";
export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ name: user ? user.name : "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const handleProfileSave = async e => {
    e.preventDefault(); setSaving(true);
    try { const { data } = await api.put("/users/profile", profile); setUser(data.data); toast.success("Profile updated!"); }
    catch (err) { toast.error(err.response && err.response.data ? err.response.data.message : "Failed"); }
    finally { setSaving(false); }
  };
  const handlePasswordChange = async e => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) { toast.error("Min 6 characters"); return; }
    setChanging(true);
    try { await api.put("/users/password", passwords); toast.success("Password changed!"); setPasswords({ currentPassword: "", newPassword: "" }); }
    catch (err) { toast.error(err.response && err.response.data ? err.response.data.message : "Failed"); }
    finally { setChanging(false); }
  };
  const initials = user && user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  return (
    <div className={styles.page}>
      <h1>Profile Settings</h1>
      <div className={styles.avatarSection}>
        <div className={styles.avatar}>{initials}</div>
        <div>
          <h2>{user && user.name}</h2>
          <p>{user && user.email}</p>
        </div>
      </div>
      <div className={styles.card}>
        <h3>Personal Info</h3>
        <form onSubmit={handleProfileSave} className={styles.form}>
          <div className={styles.field}><label>Full Name</label><input value={profile.name} onChange={e => setProfile(f => ({ ...f, name: e.target.value }))} required /></div>
          <div className={styles.field}><label>Email</label><input value={user ? user.email : ""} disabled className={styles.disabled} /></div>
          <button type="submit" disabled={saving} className={styles.btn}>{saving ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
      <div className={styles.card}>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange} className={styles.form}>
          <div className={styles.field}><label>Current Password</label><input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} required /></div>
          <div className={styles.field}><label>New Password</label><input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} /></div>
          <button type="submit" disabled={changing} className={styles.btn}>{changing ? "Updating..." : "Change Password"}</button>
        </form>
      </div>
    </div>
  );
}
