import express, { type Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || "development";

    if (NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    server.listen(PORT, "0.0.0.0", () => {
      log(`🚀 Server running on http://localhost:${PORT}`);
      log(`📡 Environment: ${NODE_ENV}`);
      log(`🔗 API available at http://localhost:${PORT}/api`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        log(`❌ Port ${PORT} is already in use. Please use a different port.`);
      } else {
        log(`❌ Server error: ${err.message}`);
      }
      process.exit(1);
    });
  } catch (error: any) {
    log(`❌ Failed to start server: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
})();



