import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

export const createApp = (): Application => {
  const app = express();

  // Trust reverse proxy (e.g. Render) for HTTPS detection and secure cookies
  app.set('trust proxy', 1);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // allow inline CSS for status page
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);

        const normalize = (url: string) => url.trim().replace(/\/+$/, '');
        const allowedOrigins = [
          normalize(ENV.CLIENT_URL),
          'https://task-flow-wine-iota-25.vercel.app',
          'http://localhost:5173',
          'http://127.0.0.1:5173',
        ];

        const normOrigin = normalize(origin);
        if (
          allowedOrigins.includes(normOrigin) ||
          ENV.NODE_ENV !== 'production' ||
          /^https:\/\/task-flow.*\.vercel\.app$/.test(normOrigin)
        ) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Parsers
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Root welcome & status endpoint (prevents "Cannot GET /" when visiting port 5000 directly)
  app.get('/', (_req: Request, res: Response) => {
    // If request wants JSON, return JSON
    if (_req.accepts('json') && !_req.accepts('html')) {
      res.status(200).json({
        service: 'TaskFlow API Server',
        status: 'online',
        healthCheck: '/api/health',
        clientUrl: ENV.CLIENT_URL,
        message: 'TaskFlow Backend API is running successfully.',
      });
      return;
    }

    // Otherwise return a sleek HTML dashboard page pointing to frontend and API
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TaskFlow API Server</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0f19;
              color: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .card {
              background: #131b2e;
              border: 1px solid #1e293b;
              border-radius: 20px;
              padding: 40px;
              max-width: 580px;
              width: 100%;
              text-align: center;
              box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
            }
            .logo {
              width: 56px;
              height: 56px;
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              border-radius: 16px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
            }
            .logo svg { width: 30px; height: 30px; stroke: white; fill: none; stroke-width: 2; }
            h1 { font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.5px; }
            .badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.3);
              padding: 4px 14px;
              border-radius: 999px;
              font-size: 13px;
              font-weight: 600;
              margin-bottom: 18px;
            }
            .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
            p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 26px; }
            .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; }
            .btn {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: #6366f1;
              color: white;
              font-weight: 600;
              font-size: 14px;
              padding: 12px 22px;
              border-radius: 12px;
              text-decoration: none;
              transition: all 0.2s;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }
            .btn:hover { background: #4f46e5; transform: translateY(-1px); }
            .btn-outline {
              background: transparent;
              border: 1px solid #334155;
              color: #cbd5e1;
              box-shadow: none;
            }
            .btn-outline:hover { background: #1e293b; color: white; transform: translateY(-1px); }
            .endpoints {
              background: #0b0f19;
              border: 1px solid #1e293b;
              border-radius: 12px;
              padding: 16px;
              text-align: left;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 12px;
              color: #94a3b8;
              line-height: 1.8;
            }
            .endpoints strong { color: #e2e8f0; font-size: 12px; display: block; margin-bottom: 6px; }
            .endpoints span { color: #818cf8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">
              <svg viewBox="0 0 24 24"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <h1>TaskFlow Backend Server</h1>
            <div class="badge">
              <span class="dot"></span> Backend API Online (Port 5000)
            </div>
            <p>
              The backend REST API is running. To access the user interface, open the frontend website link below.
            </p>
            <div class="actions">
              <a class="btn" href="${ENV.CLIENT_URL}">🚀 Open Frontend (${ENV.CLIENT_URL})</a>
              <a class="btn btn-outline" href="/api/health">🩺 Health Check (/api/health)</a>
            </div>
            <div class="endpoints">
              <strong>Available API Endpoints:</strong>
              • <span>GET</span>  /api/health<br/>
              • <span>POST</span> /api/auth/register<br/>
              • <span>POST</span> /api/auth/login<br/>
              • <span>GET</span>  /api/tasks<br/>
              • <span>GET</span>  /api/dashboard/stats
            </div>
          </div>
        </body>
      </html>
    `);
  });

  // Global rate limiter for API routes
  app.use('/api', apiLimiter);

  // Mount API endpoints
  app.use('/api', apiRoutes);

  // 404 handler for undefined API routes
  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'API route not found',
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
};
