"use client";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-50 border-t border-slate-200 w-full">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} CWAY Food & Beverages. All rights reserved.
        </p>

        {/* Right */}
        <p className="text-sm text-gray-500">
          Powered by{" "}
          <span className="font-semibold text-sky-500">
            BankyTech
          </span>
        </p>

      </div>
    </footer>
  );
}