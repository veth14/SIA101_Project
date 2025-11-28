import express from "express";
import cors from "cors";
import dashboardRoute from "./routes/invDashboard.route.js";
import procurementRoute from "./routes/invProcurement.route.js";
import inventoryRoute from "./routes/invInventory.route.js";
import requisitionRoute from "./routes/invRequisition.route.js";
import supplierRoute from "./routes/invSupplier.route.js";
import analyticRoute from "./routes/invAnalytic.route.js";
import departmentRoute from "./routes/invDepartment.route.js";
import dotenv from "dotenv";
import { db, User } from "./config/firebaseAdmin.js";
const app = express();
const PORT = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

dotenv.config();
app.use(express.json());
app.use("/api/inventory-dashboard", dashboardRoute);
app.use("/api/inventory-procurement", procurementRoute);
app.use("/api/inventory-inventory", inventoryRoute);
app.use("/api/inventory-requisition", requisitionRoute);
app.use("/api/inventory-supplier", supplierRoute);
app.use("/api/inventory-analytic", analyticRoute);
app.use("/api/inventory-department", departmentRoute);

app.post("/create", async (req, res) => {
  try {
    const data = req.body;

    console.log("Attempting to create user:", data);

    const response = await User.add(data);

    console.log("User created successfully:", response.id);

    res.status(201).send({
      id: response.id,
      data: response,
      message: "User added",
    });
  } catch (error: any) {
    console.error("Detailed error:", error);
    res.status(500).send({
      error: "Failed to create user",
      message: error.message,
      code: error.code,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("inventory_items").get();

    if (snapshot.empty) {
      return res.status(404).send({ message: "No users found" });
    }
    const users: any = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).send({ data: users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("dsadasa");
});

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`server running at port ${PORT}`);
});
