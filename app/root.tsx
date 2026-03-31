import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "react-router";
import "./app.css";

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";
  let hint = "";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    if (error.status === 404) {
      message = "The page you're looking for doesn't exist.";
      hint = "Check the URL or navigate back to the home page.";
    } else if (error.status === 500) {
      message = "The server encountered an error.";
      hint = "Check the terminal/console for server-side errors.";
    } else {
      message = error.data?.message || "An error occurred while loading this page.";
    }
  } else if (error instanceof Error) {
    message = error.message;
    hint = "Open DevTools (F12) → Console tab to see the full error stack trace.";
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-700 mb-2">{title}</h1>
            <p className="text-red-600 mb-4">{message}</p>
            {hint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                <strong className="text-yellow-800">Debug tip:</strong>{" "}
                <span className="text-yellow-700">{hint}</span>
              </div>
            )}
            <a
              href="/"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              ← Back to Home
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}