
import { useState, useEffect } from "react";
import styles from "./TaskModal.module.css";
const defaultForm = { title: "", description: "", status: "todo", priority: "medium", dueDate: "", tags: "" };
export default function TaskModal({ task, onClose, onSubmit }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (task) setForm({
      title: task.title || "", description: task.description || "",
      status: task.status || "todo", priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      tags: task.tags ? task.tags.join(", ") : ""
    });
  }, [task]);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await onSubmit({ ...form, tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [], dueDate: form.dueDate || null });
      onClose();
    } finally { setLoading(false); }
  };
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{task && task._id ? "Edit Task" : "Create New Task"}</h2>
          <button onClick={onClose} className={styles.closeBtn}>x</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}><label>Title *</label><input name="title" value={form.title} onChange={handleChange} required placeholder="What needs to be done?" /></div>
          <div className={styles.field}><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Add details..." /></div>
          <div className={styles.row}>
            <div className={styles.field}><label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option>
              </select>
            </div>
            <div className={styles.field}><label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}><label>Due Date</label><input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} /></div>
            <div className={styles.field}><label>Tags</label><input name="tags" value={form.tags} onChange={handleChange} placeholder="react, backend, urgent" /></div>
          </div>
        </form>
        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={async () => {
            setLoading(true);
            try {
              await onSubmit({ ...form, tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [], dueDate: form.dueDate || null });
              onClose();
            } finally { setLoading(false); }
          }} disabled={!form.title || loading} className={styles.submitBtn}>
            {loading ? "Saving..." : task && task._id ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
