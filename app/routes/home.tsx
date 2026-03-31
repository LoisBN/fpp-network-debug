import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ErrorInfo = {
  message: string;
  hint: string;
  type: "network" | "http" | "parse" | "empty" | "unknown";
  debugSteps: string[];
  learnMore: string;
};

const errorConfig: Record<ErrorInfo["type"], { icon: string; color: string; title: string }> = {
  network: { icon: "📡", color: "red", title: "Network Error" },
  http: { icon: "🌐", color: "orange", title: "HTTP Error" },
  parse: { icon: "📄", color: "yellow", title: "Parse Error" },
  empty: { icon: "📭", color: "blue", title: "Empty Response" },
  unknown: { icon: "❓", color: "gray", title: "Unknown Error" },
};

function getErrorInfo(error: unknown, context: string): ErrorInfo {
  if (!navigator.onLine) {
    return {
      message: "You appear to be offline",
      hint: "Your device is not connected to the internet.",
      type: "network",
      debugSteps: [
        "Check your WiFi or ethernet connection",
        "Open DevTools (F12) → Network tab",
        "Look for requests marked as '(failed)'",
        "Try refreshing once you're back online",
      ],
      learnMore: "Network errors occur when your browser cannot reach the server. This can happen due to no internet connection, DNS issues, or the server being down.",
    };
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: `Network request failed: ${context}`,
      hint: "The request couldn't reach the server.",
      type: "network",
      debugSteps: [
        "Open DevTools (F12) → Console tab",
        "Look for CORS or network errors",
        "Check the Network tab for failed requests",
        "Verify the URL is correct and accessible",
      ],
      learnMore: "This error often indicates a CORS (Cross-Origin Resource Sharing) issue, meaning the server doesn't allow requests from this origin, or the URL is unreachable.",
    };
  }

  if (error instanceof SyntaxError) {
    return {
      message: "Failed to parse response as JSON",
      hint: "The server returned something that isn't valid JSON.",
      type: "parse",
      debugSteps: [
        "Open DevTools (F12) → Network tab",
        "Click on the failed request",
        "Go to the 'Response' or 'Preview' tab",
        "Check what the server actually returned (maybe HTML error page?)",
      ],
      learnMore: "JSON parse errors happen when response.json() is called on non-JSON content. Servers often return HTML error pages instead of JSON when something goes wrong.",
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      hint: "An error occurred during the request.",
      type: "unknown",
      debugSteps: [
        "Open DevTools (F12) → Console tab",
        "Find the red error message",
        "Read the full stack trace",
        "Search the error message online if unclear",
      ],
      learnMore: "This is a general JavaScript error. The stack trace in the console will show exactly where and why it occurred.",
    };
  }

  return {
    message: "An unknown error occurred",
    hint: "Something unexpected went wrong.",
    type: "unknown",
    debugSteps: [
      "Open DevTools (F12)",
      "Check both Console and Network tabs",
      "Look for any red error messages",
      "Try the request again and watch what happens",
    ],
    learnMore: "Unknown errors are rare but can happen. Methodically checking DevTools will usually reveal the cause.",
  };
}

function createHttpError(status: number, statusText: string): ErrorInfo {
  const is404 = status === 404;
  return {
    message: `HTTP ${status}: ${statusText}`,
    hint: is404 ? "The requested resource was not found." : "The server returned an error.",
    type: "http",
    debugSteps: is404
      ? [
          "Open DevTools (F12) → Network tab",
          "Find the request with status 404",
          "Check the URL in the request - is it correct?",
          "Look for typos in the endpoint path",
        ]
      : [
          "Open DevTools (F12) → Network tab",
          "Click on the failed request",
          "Check the 'Response' tab for error details",
          "Look at the status code and message",
        ],
    learnMore: is404
      ? "A 404 error means the server couldn't find what you asked for. This usually indicates a typo in the URL or that the resource has been moved/deleted."
      : `HTTP ${status} errors indicate the server received your request but couldn't fulfill it. Common codes: 400 (bad request), 401 (unauthorized), 403 (forbidden), 500 (server error).`,
  };
}

function createEmptyError(context: string): ErrorInfo {
  return {
    message: context === "array" ? "No items found" : "Empty response received",
    hint: "The request succeeded but returned no data.",
    type: "empty",
    debugSteps: [
      "Open DevTools (F12) → Network tab",
      "Find the request and check its status (should be 200)",
      "Look at the 'Response' tab to see the data",
      "Verify you're requesting the correct resource",
    ],
    learnMore: "Empty responses aren't always errors - sometimes there's simply no data. But if you expected data, check that your filters/parameters are correct.",
  };
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <motion.div
      className="flex items-center gap-3 text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <span>Fetching data...</span>
    </motion.div>
  );
}

// Pedagogic Error Card Component
function ErrorCard({ error, onDismiss }: { error: ErrorInfo; onDismiss: () => void }) {
  const [showLearnMore, setShowLearnMore] = useState(false);
  const config = errorConfig[error.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`bg-gradient-to-br from-${config.color}-50 to-white border-2 border-${config.color}-200 rounded-xl p-5 mb-4 shadow-lg`}
      style={{
        background: config.color === "red" ? "linear-gradient(to bottom right, #fef2f2, white)" :
                   config.color === "orange" ? "linear-gradient(to bottom right, #fff7ed, white)" :
                   config.color === "yellow" ? "linear-gradient(to bottom right, #fefce8, white)" :
                   config.color === "blue" ? "linear-gradient(to bottom right, #eff6ff, white)" :
                   "linear-gradient(to bottom right, #f9fafb, white)",
        borderColor: config.color === "red" ? "#fecaca" :
                    config.color === "orange" ? "#fed7aa" :
                    config.color === "yellow" ? "#fef08a" :
                    config.color === "blue" ? "#bfdbfe" :
                    "#e5e7eb"
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {config.icon}
          </motion.span>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{config.title}</h3>
            <p className="text-gray-600 text-sm">{error.message}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Hint */}
      <p className="text-gray-700 mb-4 bg-white/50 rounded-lg p-3 border border-gray-100">
        💡 {error.hint}
      </p>

      {/* Debug Steps */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          🔍 How to Debug This
        </h4>
        <ol className="space-y-2">
          {error.debugSteps.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="flex items-start gap-3 text-sm text-gray-700"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Learn More */}
      <div className="border-t border-gray-200 pt-3">
        <button
          onClick={() => setShowLearnMore(!showLearnMore)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
        >
          <motion.span
            animate={{ rotate: showLearnMore ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▶
          </motion.span>
          {showLearnMore ? "Hide explanation" : "Learn more about this error"}
        </button>
        <AnimatePresence>
          {showLearnMore && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3 overflow-hidden"
            >
              {error.learnMore}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Error Type Badge */}
      <div className="mt-3 flex justify-end">
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
          Type: <code className="font-mono">{error.type}</code>
        </span>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);

  // BUG 1: This URL has a typo - students need to find and fix it
  const API_URL = "https://jsonplaceholder.typicode.com/pots/1";

  async function fetchData() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        setError(createHttpError(response.status, response.statusText));
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
        setError(createEmptyError("object"));
        setLoading(false);
        return;
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(getErrorInfo(err, API_URL));
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserList() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!navigator.onLine) {
        setError(getErrorInfo(new Error("offline"), "users API"));
        setLoading(false);
        return;
      }

      const response = await fetch("https://jsonplaceholder.typicode.com/users");

      if (!response.ok) {
        setError(createHttpError(response.status, response.statusText));
        setLoading(false);
        return;
      }

      const users = await response.json();

      if (!users || (Array.isArray(users) && users.length === 0)) {
        setError(createEmptyError("array"));
        setLoading(false);
        return;
      }

      // BUG 4: Should display user names but displays the whole object
      // This will cause a render error - catch it and show pedagogic message
      if (typeof users !== "string") {
        setError({
          message: "Objects are not valid as a React child",
          hint: "You're trying to render an object/array directly in JSX. React can only render strings, numbers, or elements.",
          type: "parse",
          debugSteps: [
            "Open DevTools (F12) → Console tab",
            "Look for the error about 'Objects are not valid as a React child'",
            "Find where `setResult(users)` is called in the code",
            "Fix it by converting to string: `JSON.stringify(users, null, 2)` or map to extract names",
          ],
          learnMore: "React cannot render plain JavaScript objects or arrays directly. You must convert them to strings (JSON.stringify) or map over arrays to create JSX elements. This is a common mistake when displaying API responses.",
        });
        setLoading(false);
        return;
      }
      setResult(users);
    } catch (err) {
      setError(getErrorInfo(err, "users API"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8"
    >
      <motion.h1
        className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Network Debug Lab
      </motion.h1>
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Open your browser DevTools (F12) and use the Network tab to debug these API calls.
        Find and fix the bugs!
      </motion.p>

      <motion.div
        className="flex gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={fetchData}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          Fetch Post
        </motion.button>
        <motion.button
          onClick={fetchUserList}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          Fetch Users
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading && <LoadingSpinner key="loading" />}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <ErrorCard
            key="error"
            error={error}
            onDismiss={() => setError(null)}
          />
        )}
      </AnimatePresence>

      <motion.pre
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-5 rounded-xl overflow-auto max-h-96 text-sm shadow-xl border border-gray-700"
      >
        {result || (error ? "👆 Follow the debug steps above" : "Click a button to fetch data. Watch the Network tab in DevTools!")}
      </motion.pre>
    </motion.div>
  );
}
