import "./Unauthorized.css"
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl sm:p-10">
        {/* Error Code */}
        <div className="mb-4 text-8xl font-extrabold tracking-tight text-red-500">
          403
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-2xl font-bold text-slate-800 sm:text-3xl">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mb-8 text-sm leading-7 text-slate-500 sm:text-base">
          Sorry, you don't have permission to access this page.
          Please contact your administrator if you think this is a mistake.
        </p>

        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Back to Dashboard
        </Link>

        {/* Footer */}
        <p className="mt-6 text-xs text-slate-400">
          Error Code: 403 · Forbidden
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;
