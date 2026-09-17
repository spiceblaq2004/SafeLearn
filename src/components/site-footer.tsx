import { Link } from "@tanstack/react-router";
import { APP_NAME } from "@/lib/safelearn";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {APP_NAME} — a growing tutorial library for Fire Safety and Disaster
          Management at UENR.
        </p>
        <Link to="/courses" className="hover:text-fg">
          Courses
        </Link>
      </div>
    </footer>
  );
}
