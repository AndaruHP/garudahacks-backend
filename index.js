const express = require("express");
const dotenv = require("dotenv");
const supabase = require("./config/supabase.js");
const cors = require("cors");
const app = express();
const authenticate = require("./middleware/auth.js");
const path = require("path");

dotenv.config();

// Routes
const authRoute = require("./routes/auth_route.js");
const materialsRoute = require("./routes/materials_route.js");
const subjectRoute = require("./routes/subject_route.js");
const gradeRoute = require("./routes/grade_route");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("school").select("*").limit(1);

    if (error) {
      console.log("Supabase connection failed:", error.message);
    } else {
      console.log("Connected to Supabase database!");
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.log("Connection failed:", error.message);
  }
};

testConnection();

// Routes
app.use(authRoute); // Add a base path for auth routes
app.use(materialsRoute);
app.use(subjectRoute);
app.use(gradeRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});
