import styles from "./TaskCard.module.css";
const PRIORITY_COLOR = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444" };
const STATUS_LABEL = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = due && due < new Date() && task.status !== "done";
  return (
    <div className={styles.card + (task.status === "done" ? " " + styles.done : "")}>
      <div className={styles.header}>
        <span className={styles.priority} style={{ background: PRIORITY_COLOR[task.priority] + "20", color: PRIORITY_COLOR[task.priority] }}>
          {task.priority}
        </span>
        <span className={styles.status}>{STATUS_LABEL[task.status]}</span>
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && <p className={styles.desc}>{task.description}</p>}
      {task.tags && task.tags.length > 0 && (
        <div className={styles.tags}>
          {task.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
      )}
      {due && (
        <div className={styles.due + (isOverdue ? " " + styles.overdue : "")}>
          Due: {due.toLocaleDateString()}{isOverdue ? " (Overdue)" : ""}
        </div>
      )}
      <div className={styles.actions}>
        <select value={task.status} onChange={e => onStatusChange(task._id, e.target.value)} className={styles.select}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={() => onEdit(task)} className={styles.editBtn}>Edit</button>
        <button onClick={() => onDelete(task._id)} className={styles.deleteBtn}>Del</button>
      </div>
    </div>
  );
}