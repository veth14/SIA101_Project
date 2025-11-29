import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import your routes
// Note: Ensure these files exist and exports are correct
import dashboardRoute from "../../routes/invDashboard.route";
import procurementRoute from "../../routes/invProcurement.route";
import inventoryRoute from "../../routes/invInventory.route";
import requisitionRoute from "../../routes/invRequisition.route";
import supplierRoute from "../../routes/invSupplier.route";
import analyticRoute from "../../routes/invAnalytic.route";
import departmentRoute from "../../routes/invDepartment.route";

// Import Firebase config
import { db, User } from "../../config/firebaseAdmin";

// Import Serverless wrapper
// We use 'require' to avoid TypeScript strict import errors with this specific package
const serverless = require("serverless-http");

dotenv.config();

const app = express();

// 1. CORS Configuration
// In production, you might want to restrict 'origin' to your Netlify Frontend URL
// For now, we allow all to ensure it works.
app.use(cors({
  origin: "*", 
  credentials: true,
}));

app.use(express.json());

// 2. Create a Router
// We move all routes onto this router so they work behind Netlify's path
const router = express.Router();

// --- Mount your routes on the ROUTER, not 'app' ---
router.use("/inventory-dashboard", dashboardRoute);
router.use("/inventory-procurement", procurementRoute);
router.use("/inventory-inventory", inventoryRoute);
router.use("/inventory-requisition", requisitionRoute);
router.use("/inventory-supplier", supplierRoute);
router.use("/inventory-analytic", analyticRoute);
router.use("/inventory-department", departmentRoute);

// --- Define your custom routes on the router ---
router.post("/create", async (req, res) => {
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

router.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("inventory_items").get();
    if (snapshot.empty) {
      // In TS, return needs to be handled properly if res.send returns response
      res.status(404).send({ message: "No users found" });
      return; 
    }
    const users: any[] = [];
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

router.get("/", (req, res) => {
  res.send("Backend is running on Netlify Serverless!");
});

// 3. Mount the Router to the Netlify Path
// This is critical. Netlify sends requests to /.netlify/functions/api
app.use("/.netlify/functions/api", router);

// 4. Export the Handler (No app.listen)
export const handler = serverless(app);