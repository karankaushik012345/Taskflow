
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { taskService } from "../services/taskService";
import TaskModal from "../components/TaskModal";
import styles from "./TasksPage.module.css";

const COLS = [
  { id: "todo",        label: "To Do",       color: "#f59e0b" },
  { id: "in-progress", label: "In Progress",  color: "#6366f1" },
  { id: "done",        label: "Done",         color: "#22c55e" },
];

const PRI_STYLE = {
  low:    { background: "rgba(34,197,94,0.15)",  color: "#22c55e" },
  medium: { background: "rgba(245,158,11,0.15)", color: "#f59e0b" },
  high:   { background: "rgba(239,68,68,0.15)",  color: "#ef4444" },
};

export default function TasksPage() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [dragId,  setDragId]  = useState(null);
  const [dragOver,setDragOver]= useState(null);
  const [search,  setSearch]  = useState("");
  const [priority,setPriority]= useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (priority) params.priority = priority;
      const { data } = await taskService.getAll(params);
      setTasks(data.data);
    } catch { toast.error("Failed to load tasks"); }
    finally { setLoading(false); }
  }, [search, priority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const colTasks = (colId) => tasks.filter(t => t.status === colId);

  const handleDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver  = (e, colId) => { e.preventDefault(); setDragOver(colId); };
  const handleDragLeave = () => setDragOver(null);
  const handleDrop = async (e, colId) => {
    e.preventDefault(); setDragOver(null);
    if (!dragId) return;
    const task = tasks.find(t => t._id === dragId);
    if (!task || task.status === colId) { setDragId(null); return; }
    setTasks(prev => prev.map(t => t._id === dragId ? { ...t, status: colId } : t));
    try { await taskService.update(dragId, { status: colId }); toast.success("Moved to " + colId); }
    catch { fetchTasks(); toast.error("Failed to move task"); }
    setDragId(null);
  };

  const handleCreate = async payload => {
    try { await taskService.create(payload); toast.success("Task created!"); fetchTasks(); }
    catch (err) { toast.error(err.response && err.response.data ? err.response.data.message : "Failed"); throw err; }
  };
  const handleUpdate = async payload => {
    try { await taskService.update(editing._id, payload); toast.success("Updated!"); fetchTasks(); }
    catch (err) { toast.error(err.response && err.response.data ? err.response.data.message : "Failed"); throw err; }
  };
  const handleDelete = async id => {
    if (!confirm("Delete this task?")) return;
    try { await taskService.remove(id); toast.success("Deleted"); setTasks(t => t.filter(x => x._id !== id)); }
    catch { toast.error("Failed"); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1>Kanban Board</h1>
          <p>Drag tasks between columns to update status</p>
        </div>
        <button onClick={() => { setEditing(null); setModal(true); }} className={styles.newBtn}>+ New Task</button>
      </div>

      <div className={styles.searchBar}>
        <input className={styles.search} placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.filterSelect} value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={() => { setSearch(""); setPriority(""); }} className={styles.clearBtn}>Clear</button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>
      ) : (
        <div className={styles.kanban}>
          {COLS.map(col => (
            <div
              key={col.id}
              className={styles.column + (dragOver === col.id ? " " + styles.dragOver : "")}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div className={styles.colHeader}>
                <div className={styles.colTitle}>
                  <span className={styles.colDot} style={{ background: col.color }} />
                  <span className={styles.colName}>{col.label}</span>
                </div>
                <span className={styles.colCount}>{colTasks(col.id).length}</span>
              </div>
              <div className={styles.cards}>
                {colTasks(col.id).length === 0
                  ? <p className={styles.empty}>Drop tasks here</p>
                  : colTasks(col.id).map(task => {
                      const due = task.dueDate ? new Date(task.dueDate) : null;
                      const overdue = due && due < new Date() && task.status !== "done";
                      return (
                        <div
                          key={task._id}
                          className={styles.card + (dragId === task._id ? " " + styles.dragging : "")}
                          draggable
                          onDragStart={e => handleDragStart(e, task._id)}
                        >
                          <div className={styles.cardTop}>
                            <span className={styles.priority} style={PRI_STYLE[task.priority] || {}}>{task.priority}</span>
                            <div className={styles.cardActions}>
                              <button className={styles.actionBtn} onClick={() => { setEditing(task); setModal(true); }}>edit</button>
                              <button className={styles.actionBtn + " " + styles.delBtn} onClick={() => handleDelete(task._id)}>del</button>
                            </div>
                          </div>
                          <h3 className={styles.cardTitle}>{task.title}</h3>
                          {task.description && <p className={styles.cardDesc}>{task.description}</p>}
                          {task.tags && task.tags.length > 0 && (
                            <div className={styles.cardTags}>{task.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}</div>
                          )}
                          <div className={styles.cardFooter}>
                            <span className={styles.dueDate + (overdue ? " " + styles.overdue : "")}>
                              {due ? (overdue ? "Overdue: " : "Due: ") + due.toLocaleDateString() : "No due date"}
                            </span>
                            <span className={styles.cardDrag}>drag</span>
                          </div>
                        </div>
                      );
                    })
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <TaskModal task={editing} onClose={() => setModal(false)} onSubmit={editing ? handleUpdate : handleCreate} />}
    </div>
  );
}
