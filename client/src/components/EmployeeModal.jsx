
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getDepartments } from "../api";

const empty = {
  employeeId: "",
  name: "",
  email: "",
  department: "",
  designation: "",
  salary: "",
  joiningDate: ""
};

export default function EmployeeModal({
  open,
  employee,
  onClose,
  onSave,
  saving
}) {
  const [form, setForm] = useState(empty);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments when modal opens
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadModalData() {
      setError("");
      setLoadingDepartments(true);

      // Set employee data when editing
      setForm(
        employee
          ? {
              employeeId: employee.employeeId || "",
              name: employee.name || "",
              email: employee.email || "",
              department: employee.department || "",
              designation: employee.designation || "",
              salary: String(employee.salary ?? ""),
              joiningDate: employee.joiningDate
                ? employee.joiningDate.slice(0, 10)
                : ""
            }
          : empty
      );

      try {
        const data = await getDepartments();

        if (cancelled) return;

        setDepartments(data);

        // Select first department when adding new employee
        if (!employee) {
          setForm((prev) => ({
            ...prev,
            department: data[0]?.departmentName || ""
          }));
        }

        if (data.length === 0) {
          setError("No departments found. Please add a department first.");
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load departments");
          setDepartments([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingDepartments(false);
        }
      }
    }

    loadModalData();

    return () => {
      cancelled = true;
    };
  }, [open, employee]);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.department) {
      setError("Please select a department.");
      return;
    }

    try {
      await onSave({
        ...form,
        salary: Number(form.salary)
      });
    } catch (err) {
      setError(err.message || "Unable to save employee");
    }
  }

  // Close modal
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* Modal Header */}
        <div className="modal-header">
          <h2>
            {employee ? "Edit Employee" : "Add Employee"}
          </h2>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Employee Form */}
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          {/* Department Dropdown */}
          <div className="form-group">
            <label>Department</label>

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              disabled={loadingDepartments || departments.length === 0}
              required
            >
              <option value="">
                {loadingDepartments
                  ? "Loading departments..."
                  : "Select Department"}
              </option>

              {departments.map((dept) => (
                <option
                  key={dept._id}
                  value={dept.departmentName}
                >
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Enter designation"
              required
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Enter salary"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* Form Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingDepartments || departments.length === 0}
            >
              {saving
                ? "Saving..."
                : employee
                  ? "Update Employee"
                  : "Add Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
