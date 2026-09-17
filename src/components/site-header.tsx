import { Link } from "@tanstack/react-router";
import { UserButton, SignedIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { APP_NAME } from "@/lib/safelearn";
import { BrandMark } from "@/components/brand-mark";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-sand" />;
  }
  if (user) return <UserButton />;
  return (
    <Link
      to="/login"
      className="inline-flex h-11 items-center rounded-md bg-pine px-4 text-sm font-medium text-pine-fg"
    >
      Sign in
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-line/80 bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark className="size-8" />
          <span className="font-display text-lg tracking-tight text-ink">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          <Link
            to="/courses"
            className="inline-flex h-11 items-center px-3 text-muted hover:text-fg"
          >
            Courses
          </Link>
          <SignedIn>
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center px-3 text-muted hover:text-fg"
            >
              My access
            </Link>
          </SignedIn>
          <AuthSlot />
        </nav>
      </div>
    </header>
  );
}
