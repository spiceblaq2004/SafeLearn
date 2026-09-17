import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/brand-mark";
import { Shell } from "@/components/shell";
import { APP_NAME } from "@/lib/safelearn";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) {
    void navigate({ to: "/dashboard" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        });
        if (err) throw new Error(err.message ?? "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message ?? "Could not sign in");
      }
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 py-12 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="size-12" />
          <h1 className="mt-4 font-display text-3xl tracking-tight">
            {mode === "in" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Use {APP_NAME} to buy a course and track your access.
          </p>
        </div>

        <div className="rounded-xl bg-surface p-5 shadow-card sm:p-6">
          {authEnabled ? (
            <div className="grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  onClick={() => signIn(p.providerId, { callbackURL: "/dashboard" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
            <span className="h-px flex-1 bg-line" />
            or email
            <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={onSubmit} className="grid gap-3">
            {mode === "up" ? (
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">Name</span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
            ) : null}
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Email</span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Password</span>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </label>
            {error ? <p className="text-sm text-bad">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm text-muted hover:text-fg"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setError(null);
            }}
          >
            {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>

        <p className="text-center text-sm text-muted">
          <Link to="/" className="hover:text-fg">
            Back home
          </Link>
        </p>
      </main>
    </Shell>
  );
}
