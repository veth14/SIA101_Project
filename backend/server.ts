import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Serverless wrapper
// const serverless = require("serverless-http");
import serverless from "serverless-http";

// --- FIX: Use './' because we moved the file to the root ---
import dashboardRoute from "./routes/invDashboard.route";
import procurementRoute from "./routes/invProcurement.route";
import inventoryRoute from "./routes/invInventory.route";
import requisitionRoute from "./routes/invRequisition.route";
import supplierRoute from "./routes/invSupplier.route";
import analyticRoute from "./routes/invAnalytic.route";
import departmentRoute from "./routes/invDepartment.route";

// --- FIX: Use './' here too ---
import { db, User } from "./config/firebaseAdmin";

dotenv.config();

const app = express();

// ✅ NEW (WORKING)
app.use(
  cors({
    // You must allow the specific Local URL and your future Netlify URL
    origin: [
      "http://localhost:5173", // Your Local Frontend
      "http://localhost:5174", // Alternate Local Port
      "https://balayginhawa.netlify.app", // Your Production Site (Add this later)
    ],
    credentials: true,
  })
);

const router = express.Router();

// --- Mount Routes ---
router.use("/inventory-dashboard", dashboardRoute);
router.use("/inventory-procurement", procurementRoute);
router.use("/inventory-inventory", inventoryRoute);
router.use("/inventory-requisition", requisitionRoute);
router.use("/inventory-supplier", supplierRoute);
router.use("/inventory-analytic", analyticRoute);
router.use("/inventory-department", departmentRoute);

// --- Custom Routes ---
router.post("/create", async (req, res) => {
  try {
    const data = req.body;
    const response = await User.add(data);
    res.status(201).send({ id: response.id, message: "User added" });
  } catch (error: any) {
    res
      .status(500)
      .send({ error: "Failed to create user", message: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("inventory_items").get();
    if (snapshot.empty) {
      res.status(404).send({ message: "No users found" });
      return;
    }
    const users: any[] = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send({ data: users });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/", (req, res) => {
  res.send("Backend is running!");
});

// --- Netlify Setup ---
// Even though the file is in root, we keep this path so redirects work
app.use("/.netlify/functions/server", router);

export const handler = serverless(app);

// --- Local Development Setup ---
// This allows 'npm run dev' to work on your laptop
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on port ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}/.netlify/functions/server`);
  });
}
