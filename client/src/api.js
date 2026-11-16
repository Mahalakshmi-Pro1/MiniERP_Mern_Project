export const API = `${import.meta.env.VITE_API_URL}/api/employees`;

export async function getEmployees() {
  const response = await fetch(API);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Unable to load employees');
  return data;
}

export async function saveEmployee(employee, editingId) {
  const response = await fetch(editingId ? `${API}/${editingId}` : API, {
    method: editingId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...employee, salary: Number(employee.salary) })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Unable to save employee');
  return data;
}

export async function removeEmployee(id) {
  const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Unable to delete employee');
  return data;
}



export const DEPARTMENT_API =
  "http://localhost:5000/api/departments";

export async function getDepartments() {
  try {
    const response = await fetch(DEPARTMENT_API);

    if (!response.ok) {
      throw new Error(`Department API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid department API response");
    }

    return data;

  } catch (error) {
    console.error("GET Department Error:", error);
    throw error;
  }
}

// POST department
export async function saveDepartment(department, editingId) {
  const response = await fetch(
    editingId
      ? `${DEPARTMENT_API}/${editingId}`
      : DEPARTMENT_API,
    {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(department)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to save department");
  }

  return data;
}

// DELETE department
export async function removeDepartment(id) {
  const response = await fetch(
    `${DEPARTMENT_API}/${id}`,
    {
      method: "DELETE"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete department");
  }

  return data;
}
