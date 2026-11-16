require("dotenv").config(); 
 
const express = require("express"); 
const mongoose = require("mongoose"); 
const cors = require("cors"); 
const Employee = require("./models/Employee"); 
const Department = require("./models/Department");
const app = express(); 
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ]
}));
app.use(express.json()); 
app.get("/api/employees", async (req, res) => { 
try { 
const employees = await Employee.find().sort({ createdAt: -1 }); 
res.json(employees); 
} catch { 
res.status(500).json({ message: "Failed to fetch employees" }); 
} 
}); 

app.post("/api/employees", async (req, res) => {
  try {
    console.log("POST request received");
    console.log("Employee data:", req.body);

    const employee = await Employee.create(req.body);

    console.log("Employee saved successfully:", employee);

    res.status(201).json({
      message: "Employee added successfully",
      employee
    });

  } catch (error) {
    console.error("POST ERROR:", error);

    res.status(400).json({
      message: error.message,
      error: error.code || "Validation error"
    });
  }
});
app.put("/api/employees/:id", async (req, res) => { 
  try { 
    const employee = await Employee.findByIdAndUpdate( 
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    ); 
 
    if (!employee) { 
      return res.status(404).json({ message: "Employee not found" }); 
    } 
 
    res.json(employee); 
  } catch { 
    res.status(400).json({ message: "Failed to update employee" }); 
  } 
}); 
 
app.delete("/api/employees/:id", async (req, res) => { 
  try { 
    const employee = await Employee.findByIdAndDelete(req.params.id); 
 
    if (!employee) { 
      return res.status(404).json({ message: "Employee not found" }); 
    } 
 
    res.json({ message: "Employee deleted successfully" }); 
  } catch { 
    res.status(400).json({ message: "Failed to delete employee" }); 
  } 
}); 

app.get("/api/departments", async (req, res) => {
  try {
    console.log("GET /api/departments called");

    const departments = await Department.find().sort({
      createdAt: -1
    });

    console.log("Departments fetched:", departments);

    res.status(200).json(departments);

  } catch (error) {
    console.error("Department API Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

app.post("/api/departments", async (req, res) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({
      message: error.code === 11000
        ? "Department already exists"
        : error.message
    });
  }
});
app.put("/api/departments/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.json(department);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});
app.delete("/api/departments/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(
      req.params.id
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.json({
      message: "Department deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});
 
async function startServer() { 
  await mongoose.connect(process.env.MONGO_URI); 
 
  app.listen(process.env.PORT || 5000, () => { 
    console.log("MiniERP server running on port 5000"); 
  }); 
} 
 
startServer().catch(error => { 
  console.error("Server startup failed:", error.message); 
  process.exit(1); 
}); 