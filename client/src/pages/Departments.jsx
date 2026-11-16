
import { useEffect, useState } from "react";
import {
  getDepartments,
  saveDepartment,
  removeDepartment
} from "../api";

import { Building2, Plus, Trash2 } from "lucide-react";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // GET API
  async function loadDepartments() {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  // POST API
  async function handleAdd(e) {
    e.preventDefault();

    try {
      await saveDepartment({
        departmentName,
        description
      });

      setDepartmentName("");
      setDescription("");

      await loadDepartments();
    } catch (err) {
      setError(err.message);
    }
  }

  // DELETE API
  async function handleDelete(id) {
    if (!window.confirm("Delete this department?")) return;

    try {
      await removeDepartment(id);
      await loadDepartments();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ORGANIZATION</span>
          <h1>Departments</h1>
          <p>Manage your company departments.</p>
        </div>
      </div>

      <section className="panel">
        <h3>
          <Building2 size={20} /> Add Department
        </h3>

        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Department name"
            value={departmentName}
            onChange={(e) =>
              setDepartmentName(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button type="submit" className="button button-primary">
            <Plus size={16} /> Add Department
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="panel">
        <h3>Department List</h3>

        {loading ? (
          <p>Loading departments...</p>
        ) : departments.length === 0 ? (
          <p>No departments found.</p>
        ) : (
          departments.map((dept) => (
            <div key={dept._id} className="department-row">
              <div>
                <strong>{dept.departmentName}</strong>
                <p>{dept.description}</p>
                <small>{dept.status}</small>
              </div>

              <button
                className="icon-button"
                onClick={() => handleDelete(dept._id)}
                aria-label="Delete department"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
