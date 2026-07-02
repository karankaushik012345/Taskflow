
import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/AuthContext";
import styles from "./DashboardPage.module.css";

function DonutChart({ done, inProgress, todo, total }) {
  const r = 48, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  const pDone = total ? done / total : 0;
  const pProg = total ? inProgress / total : 0;
  const pTodo = total ? todo / total : 0;
  let offset = 0;
  const seg = (pct, color, off) => (
    <circle key={color} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
      strokeDasharray={`${pct * circ} ${circ}`} strokeDashoffset={-off * circ} strokeLinecap="butt" />
  );
  const segs = [
    [pDone, "#22c55e", 0],
    [pProg, "#6366f1", pDone],
    [pTodo, "#f59e0b", pDone + pProg],
  ];
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.donut}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          {total > 0 && segs.map(([p, c, o]) => seg(p, c, o))}
        </svg>
        <div className={styles.donutCenter}>
          <span className={styles.donutPct}>{pct}%</span>
          <span className={styles.donutSub}>done</span>
        </div>
      </div>
      <div className={styles.legend}>
        {[["#22c55e","Done",done],["#6366f1","In Progress",inProgress],["#f59e0b","To Do",todo]].map(([c,l,v]) => (
          <div key={l} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: c }} />
            <span>{l}</span>
            <span className={styles.legendVal}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, todo: 0, "in-progress": 0, done: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([taskService.getStats(), taskService.getAll({ sort: "-createdAt" })])
      .then(([s, t]) => { setStats(s.data.data); setRecent(t.data.data.slice(0, 6)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}><div className="spinner" /></div>;

  const ip = stats["in-progress"];
  const total = stats.total;
  const pDone = total ? Math.round((stats.done / total) * 100) : 0;
  const pProg = total ? Math.round((ip / total) * 100) : 0;
  const pTodo = total ? Math.round((stats.todo / total) * 100) : 0;

  const statCards = [
    { label: "Total Tasks",  value: total,      icon: "◈", color: "#6366f1" },
    { label: "To Do",        value: stats.todo, icon: "○", color: "#f59e0b" },
    { label: "In Progress",  value: ip,         icon: "◑", color: "#3b82f6" },
    { label: "Completed",    value: stats.done, icon: "●", color: "#22c55e" },
  ];

  const dotColor = { todo: "#f59e0b", "in-progress": "#6366f1", done: "#22c55e" };
  const badgeStyle = {
    low:    { background: "rgba(34,197,94,0.15)",   color: "#22c55e" },
    medium: { background: "rgba(245,158,11,0.15)",  color: "#f59e0b" },
    high:   { background: "rgba(239,68,68,0.15)",   color: "#ef4444" },
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.greeting}>Good day, {user && user.name ? user.name.split(" ")[0] : "there"}</h1>
        <p>Here is your productivity overview</p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map(s => (
          <div key={s.label} className={styles.statCard} style={{ "--card-accent": s.color }}>
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Completion Breakdown</p>
          <DonutChart done={stats.done} inProgress={ip} todo={stats.todo} total={total} />
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Progress Bars</p>
          <div className={styles.progressWrap}>
            {[["Done", pDone, "#22c55e"], ["In Progress", pProg, "#6366f1"], ["To Do", pTodo, "#f59e0b"]].map(([l, p, c]) => (
              <div key={l} className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>{l}</span>
                  <span className={styles.progressPct}>{p}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: p + "%", background: c }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
          <p className={styles.cardTitle}>Recent Tasks</p>
          {recent.length === 0
            ? <p className={styles.empty}>No tasks yet</p>
            : <div className={styles.recentList}>
                {recent.map(t => (
                  <div key={t._id} className={styles.recentItem}>
                    <span className={styles.dot} style={{ background: dotColor[t.status] || "#64748b" }} />
                    <span className={styles.recentTitle}>{t.title}</span>
                    <span className={styles.badge} style={badgeStyle[t.priority] || {}}>{t.priority}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}
