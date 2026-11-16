import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Users,
  RefreshCw,
} from "lucide-react";
import EmployeeModal from "../components/EmployeeModal.jsx";
import { getEmployees, saveEmployee, removeEmployee } from "../api.js";

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
const initials = (n) =>
  (n || "?")
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
export default function Employees() {
  const [employees, setEmployees] = useState([]),
    [search, setSearch] = useState(""),
    [department, setDepartment] = useState("All departments"),
    [modal, setModal] = useState(false),
    [selected, setSelected] = useState(null),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setEmployees(await getEmployees());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const departments = useMemo(
    () => [
      "All departments",
      ...new Set(employees.map((e) => e.department).filter(Boolean)),
    ],
    [employees],
  );
  const filtered = employees.filter(
    (e) =>
      `${e.name} ${e.employeeId} ${e.email} ${e.department} ${e.designation}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (department === "All departments" || e.department === department),
  );
  function openAdd() {
    setSelected(null);
    setModal(true);
  }
  function openEdit(e) {
    setSelected(e);
    setModal(true);
  }
  async function submit(form) {
    setSaving(true);
    try {
      await saveEmployee(form, selected?._id);
      setModal(false);
      await load();
    } finally {
      setSaving(false);
    }
  }
  async function del(e) {
    if (!confirm(`Delete ${e.name}? This cannot be undone.`)) return;
    try {
      await removeEmployee(e._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }
  function exportCSV() {
    const rows = [
      [
        "Employee ID",
        "Name",
        "Email",
        "Department",
        "Designation",
        "Salary",
        "Joining Date",
      ],
      ...filtered.map((e) => [
        e.employeeId,
        e.name,
        e.email,
        e.department,
        e.designation,
        e.salary,
        e.joiningDate,
      ]),
    ];
    const csv = rows
      .map((r) =>
        r.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PEOPLE / DIRECTORY</span>
          <h1>Employees</h1>
          <p>Manage your team, employee records, and information.</p>
        </div>
        <button className="button button-primary" onClick={openAdd}>
          <Plus size={17} /> Add employee
        </button>
      </div>
      <div className="employee-summary">
        <div className="summary-icon">
          <Users />
        </div>
        <div>
          <strong>{employees.length}</strong>
          <span>Total employee records</span>
        </div>
        <div className="summary-divider" />
        <div>
          <strong>{filtered.length}</strong>
          <span>Showing results</span>
        </div>
      </div>
      {error && (
        <div className="alert">
          {error}
          <button onClick={load}>
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      )}
      <section className="panel employee-panel">
        <div className="panel-heading">
          <div>
            <h2>Employee directory</h2>
            <p>View and manage all employee records</p>
          </div>
          <button className="button button-light" onClick={exportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
        <div className="toolbar">
          <label className="table-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, ID, email..."
            />
          </label>
          <label className="filter-select">
            <SlidersHorizontal size={16} />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="spin" /> Loading employees...
          </div>
        ) : filtered.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>DESIGNATION</th>
                  <th>SALARY / MONTH</th>
                  <th>JOINING DATE</th>
                  <th className="action-col">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
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
                    <td>
                      {e.joiningDate
                        ? new Date(e.joiningDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-button action-edit"
                          title="Edit employee"
                          onClick={() => openEdit(e)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="icon-button action-delete"
                          title="Delete employee"
                          onClick={() => del(e)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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
            <h3>No employees found</h3>
            <p>
              {search
                ? "Try a different search or filter."
                : "Add an employee to get started."}
            </p>
            {!search && (
              <button className="button button-primary" onClick={openAdd}>
                Add employee
              </button>
            )}
          </div>
        )}
        <div className="table-footer">
          <span>
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{employees.length}</strong> employees
          </span>
          <button className="refresh-link" onClick={load}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </section>
      <EmployeeModal
        open={modal}
        employee={selected}
        onClose={() => setModal(false)}
        onSave={submit}
        saving={saving}
      />
    </div>
  );
}
