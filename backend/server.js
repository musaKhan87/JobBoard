require("dotenv").config();
const cors=require("cors")
const express = require("express");
const { connectDb } = require("./utils/db");
const path = require("path");


const jobRoutes=require("./routes/jobs");
const authRoutes = require("./routes/auth");
const applicationRoutes = require("./routes/application");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDb();

//Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/apply",applicationRoutes)


// ---------------------Deployment----------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
 app.use(express.static(path.join(__dirname1, "../frontend/dist")));

 app.get("*", (req, res) =>
   res.sendFile(path.resolve(__dirname1, "../frontend/dist", "index.html"))
 );

} else {
  app.get("/", (req, res) => {
    res.send("Api is Running");
  });
}

app.get("/api/health", (req,res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});