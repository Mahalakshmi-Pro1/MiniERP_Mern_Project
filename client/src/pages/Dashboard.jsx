import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Wallet,
  UserPlus,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard.jsx";
import { getEmployees, getDepartments } from "../api.js";

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
export default function Dashboard() {
  const [departments, setDepartments] = useState([]);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    getDepartments()
      .then((data) => {
        setDepartments(data);
        setDepartmentError("");
      })
      .catch((error) => {
        console.error("Department API Error:", error);
        setDepartmentError(error.message);
      })
      .finally(() => {
        setDepartmentLoading(false);
      });
  }, []);
  const avg = employees.length
    ? employees.reduce((s, e) => s + Number(e.salary || 0), 0) /
      employees.length
    : 0;
  const recent = [...employees]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.joiningDate) -
        new Date(a.createdAt || a.joiningDate),
    )
    .slice(0, 5);
  const initials = (n) =>
    (n || "?")
      .split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>
            Welcome, Admin <span className="wave">✦</span>
          </h1>
          <p>Here’s what’s happening across your organization today.</p>
        </div>
        <Link className="button button-primary" to="/employees">
          <Plus size={17} /> Add employee
        </Link>
      </div>
      {error && (
        <div className="alert">{error}. Make sure the backend is running.</div>
      )}
      <div className="stats-grid">
        <StatCard
          label="Total employees"
          value={employees.length}
          caption="Registered employee records"
          icon={Users}
        />
        <StatCard
    label="Departments"
    value={
        departmentLoading
            ? "..."
            : departmentError
                ? "—"
                : departments.length
    }
    caption={
        departmentLoading
            ? "Loading departments..."
            : departmentError
                ? "Unable to load department data"
                : departments.length === 0
                    ? "No departments added yet"
                    : "Departments registered successfully"
    }
    icon={Building2}
    tone="purple"
/>
        <StatCard
          label="Average salary"
          value={money(avg)}
          caption="Across all employees"
          icon={Wallet}
          tone="green"
        />
        <StatCard
          label="Recent additions"
          value={recent.length}
          caption="Latest employee records"
          icon={UserPlus}
          tone="orange"
        />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Recent employees</h2>
            <p>Latest employee records in your workspace</p>
          </div>
          <Link to="/employees" className="text-link">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        {recent.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>DESIGNATION</th>
                  <th>SALARY</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar avatar-soft">
                          {initials(e.name)}
                        </div>
                        <div>
                          <strong>{e.name}</strong>
                          <small>
                            {e.employeeId} · {e.email}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="department-chip">
                        {e.department || "—"}
                      </span>
                    </td>
                    <td>{e.designation || "—"}</td>
                    <td className="salary">{money(e.salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Users />
            </div>
            <h3>No employees yet</h3>
            <p>Add your first employee to see records here.</p>
            <Link className="button button-primary" to="/employees">
              Add employee
            </Link>
          </div>
        )}
      </section>
      <div className="dashboard-note">
        <span className="note-mark">i</span>
        <span>
          Dashboard data is calculated from your existing employee records.
        </span>
      </div>
    </div>
  );
}
