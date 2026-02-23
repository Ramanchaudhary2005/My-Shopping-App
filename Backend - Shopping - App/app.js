require("dotenv").config();
require("./config/db");
const express = require("express");
const morgan = require("morgan");
const { apiRouter } = require("./api/v1/routes");  
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3900;
const app = express();
const configuredOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...configuredOrigins,
];

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    return /^https:\/\/.*\.vercel\.app$/.test(origin);
};

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use((req,res,next)=>{
    setTimeout(()=>{
        next();
    }, 1000);
});

app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json({ ok: true, message: "Backend is running" });
});
app.use("/api/v1", apiRouter);
app.use(cookieParser());

app.listen(PORT, () => {
    console.log("-----------server started---------------");
});

