import "./styles.css";
import { createBrowserRouter, NavLink, Outlet } from "react-router-dom";
import type { JobApplication } from "@repo/types";
import { useCareerOSStore } from "@repo/state";

function Layout() {
  const workspace = useCareerOSStore((state) => state.workspace);
  return <div className="shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">C</span><span>CareerOS</span></div><p className="workspace-label">Workspace</p><p className="workspace-name">{workspace.name}</p><nav className="navigation" aria-label="Main navigation"><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Overview</NavLink><NavLink to="/applications" className={({ isActive }) => isActive ? "active" : ""}>Applications</NavLink><NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>Settings</NavLink></nav></aside><main className="main-content"><Outlet /></main></div>;
}

function Overview() {
  const applications = useCareerOSStore((state) => state.applications);
  const interviews = applications.filter((application) => application.status === "interview").length;
  const offers = applications.filter((application) => application.status === "offer").length;
  return <section><p className="eyebrow">Monday, September 27, 2026</p><h1>Good morning.</h1><p className="lede">A clear view of your next career move.</p><div className="metrics"><Metric label="Applications" value={applications.length} /><Metric label="Interviews" value={interviews} /><Metric label="Offers" value={offers} /></div><div className="section-heading"><h2>Recent applications</h2><NavLink className="text-link" to="/applications">View all</NavLink></div><ApplicationList applications={applications.slice(-3).reverse()} /></section>;
}

function Applications() {
  const applications = useCareerOSStore((state) => state.applications);
  const addApplication = useCareerOSStore((state) => state.addApplication);
  const addDemoApplication = () => addApplication({ id: `job-${applications.length + 1}`, company: "Atlas Studio", role: "Design Systems Lead", status: "applied", appliedAt: "2026-09-27" });
  return <section><div className="page-heading"><div><p className="eyebrow">Pipeline</p><h1>Applications</h1></div><button className="primary-button" type="button" onClick={addDemoApplication}>Add application</button></div><ApplicationList applications={applications.slice().reverse()} /></section>;
}

function Settings() {
  const workspace = useCareerOSStore((state) => state.workspace);
  const setWorkspace = useCareerOSStore((state) => state.setWorkspace);
  return <section><p className="eyebrow">Preferences</p><h1>Settings</h1><div className="settings-panel"><label htmlFor="workspace-name">Workspace name</label><input id="workspace-name" value={workspace.name} onChange={(event) => setWorkspace({ ...workspace, name: event.target.value })} /><p>Changes are shared across the admin app through the workspace store.</p></div></section>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="metric"><span>{label}</span><strong>{value}</strong></div>; }

function ApplicationList({ applications }: { applications: JobApplication[] }) {
  if (applications.length === 0) return <p className="empty-state">No applications yet.</p>;
  return <div className="application-list">{applications.map((application) => <article className="application-row" key={application.id}><div><h3>{application.role}</h3><p>{application.company}</p></div><span className={`status status-${application.status}`}>{application.status}</span></article>)}</div>;
}

export const router = createBrowserRouter([{ path: "/", element: <Layout />, children: [{ index: true, element: <Overview /> }, { path: "applications", element: <Applications /> }, { path: "settings", element: <Settings /> }] }]);