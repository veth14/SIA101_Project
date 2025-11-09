import express from "express";
import cors from "cors";
import dashboardRoute from "./routes/invDashboard.js";
import procurementRoute from "./routes/invProcurement.js";
import inventoryRoute from "./routes/invInventory.js";
import requisitionRoute from "./routes/invRequisition.js";
import departmentRoute from "./routes/invDepartment.js";
const app = express();
const PORT = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/inventory-dashboard", dashboardRoute);
app.use("/api/inventory-procurement", procurementRoute);
app.use("/api/inventory-inventory", inventoryRoute);
app.use("/api/inventory-requisition", requisitionRoute);
app.use("/api/inventory-department", departmentRoute);

app.get("/", (req, res) => {
  res.send("dsadasa");
});

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`server running at port ${PORT}`);
});
