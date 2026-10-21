<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Eventify API - Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .swagger-header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #fff;
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .swagger-header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      background: #3b82f6;
      color: white;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
    .swagger-header a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }
    .swagger-header a:hover {
      color: #fff;
    }
    .topbar {
      display: none !important;
    }
    .swagger-ui .information-container {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <header class="swagger-header">
    <h1>
      <span>⚡ Eventify API</span>
      <span class="badge">v1.0.0</span>
    </h1>
    <div>
      <a href="/docs/api" target="_blank" style="margin-right: 15px;">Elements View ↗</a>
      <a href="/docs/api.json" target="_blank">OpenAPI JSON ↗</a>
    </div>
  </header>

  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/docs/api.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "list",
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        defaultModelsExpandDepth: 1
      });
    };
  </script>
</body>
</html>
