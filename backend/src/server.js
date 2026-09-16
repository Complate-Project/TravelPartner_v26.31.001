const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

// Fail fast if required production variables are missing/invalid.
const envConfig = require("./config/envConfig");
try {
    envConfig.validateEnv();
} catch (err) {
    console.error("[config] " + err.message);
    process.exit(1);
}

const app = express();
const db = require("./config/db");

// Reverse-proxy awareness for rate limiting (IP extraction). Only enabled when
// TRUST_PROXY is explicitly set. Accepts: true, a hop count (e.g. 1), or
// comma-separated addresses. Not enabled blindly.
const trustProxy = process.env.TRUST_PROXY;
if (trustProxy !== undefined && trustProxy !== "") {
    if (trustProxy === "true") app.set("trust proxy", true);
    else if (/^\d+$/.test(trustProxy)) app.set("trust proxy", Number(trustProxy));
    else app.set("trust proxy", trustProxy.split(",").map((s) => s.trim()));
}

const corsOrigins = envConfig.getCorsOrigins();
// Security headers. CSP is intentionally left off so WebRTC, external fonts,
// Socket.IO and uploads keep working; Helmet still adds HSTS, nosniff, frame
// protections, etc.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin(origin, cb) {
        // Allow same-origin / non-browser requests (curl, server-to-server) and
        // any explicitly configured origin. Never `*` (credentials are enabled).
        if (!origin || corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json());

// Static uploads must use the same directory as the local storage provider.
// This also supports cPanel deployments that set UPLOADS_DIR explicitly.
const uploadsRoot = path.resolve(
    process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads")
);

// express.static() bypasses the cors() middleware, so we must explicitly add
// CORS headers on the uploads routes. Without this, browsers block images
// loaded from the admin panel (e.g. deposit screenshots) even though the file
// exists, showing "Failed to load screenshot".
const uploadsCors = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && corsOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    } else if (!origin) {
        // Direct browser tab / non-CORS request — always allow.
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
};

app.use("/uploads", uploadsCors, express.static(uploadsRoot));
// Keep uploads reachable when the reverse proxy forwards only /api/* to Node.
app.use("/api/uploads", uploadsCors, express.static(uploadsRoot));

app.get("/", (req, res) => {
    res.send("Backend is running");
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/passwordResetRoutes"));
app.use("/api/test", require("./routes/testRoutes"));

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/user/membership", require("./routes/membershipRoutes"));

app.use("/api/user-wallet", require("./routes/wallet.routes"));

app.use("/api/provider", require("./routes/providerRoutes"));

app.use("/api/partner", require("./routes/partnerRequestRoutes"));
app.use("/api/provider", require("./routes/partnerRequestRoutes"));

app.use("/api/admin/auth", require("./routes/adminAuthRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin", require("./routes/adminReportRoutes"));
app.use("/api/admin/wallet", require("./routes/adminWalletRoutes"));
app.use("/api/admin-wallet", require("./routes/admin.wallet.routes"));

app.use("/api/upload", require("./routes/uploadRoutes"));

app.use("/api/newsfeed", require("./routes/newsfeedRoutes"));

app.use("/api/call", require("./routes/callRoutes"));
app.use("/api/gift", require("./routes/giftRoutes").userRouter);
app.use("/api/admin/gifts", require("./routes/giftRoutes").adminRouter);

app.use("/api/deposit-methods", require("./routes/paymentMethodRoutes").userRouter);
app.use("/api/admin/deposit-methods", require("./routes/paymentMethodRoutes").adminRouter);
app.use("/api", require("./routes/reportRoutes"));


// 404
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler: log details server-side, return a generic message to
// the client for 5xx. Preserves intentional 4xx error messages.
app.use((err, req, res, next) => {
    const status = err && err.statusCode ? Number(err.statusCode) : 500;
    console.error("[server error]", status, err && err.message);
    if (status >= 500) {
        return res.status(500).json({ message: "An internal server error occurred." });
    }
    return res.status(status).json({ message: (err && err.message) || "An internal server error occurred." });
});

const PORT = process.env.PORT || 5000;

const httpServer = require("http").createServer(app);

const { setupSocket } = require("./socket/socket");
const io = setupSocket(httpServer);
// Expose the Socket.IO server to routes that need to emit realtime events.
app.set("socketio", io);

httpServer.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // optional: safe startup init
    await require("./startup/initTables")(db);
});
