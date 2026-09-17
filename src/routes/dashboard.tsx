import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/shell";
import { SUPPORT } from "@/lib/safelearn";
import {
  getAdminFlag,
  listMyEnrollments,
  type EnrollmentRow,
} from "@/lib/server/safelearn";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function statusLabel(status: string) {
  if (status === "active") return { label: "Active", className: "text-good" };
  if (status === "pending") return { label: "Awaiting confirmation", className: "text-warn" };
  return { label: "Not approved", className: "text-bad" };
}

function Dashboard() {
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<EnrollmentRow[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    void listMyEnrollments()
      .then(setRows)
      .catch(() => setRows([]));
    void getAdminFlag()
      .then((r) => setIsAdmin(r.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [user]);

  if (isPending) {
    return (
      <Shell>
        <main className="mx-auto max-w-3xl px-4 py-16">
          <div className="h-40 animate-pulse rounded-xl bg-sand" />
        </main>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <Shell>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm text-muted">Signed in as {user.primaryEmail ?? user.displayName}</p>
        <h1 className="mt-1 font-display text-4xl tracking-tight">My access</h1>
        <p className="mt-3 text-muted">
          After Mobile Money is confirmed, a course moves from pending to active.
        </p>

        {isAdmin ? (
          <Link
            to="/admin"
            className="mt-4 inline-flex text-sm text-pine hover:underline"
          >
            Open studio
          </Link>
        ) : null}

        <div className="mt-8 grid gap-4">
          {rows === null ? (
            <div className="h-28 animate-pulse rounded-xl bg-sand" />
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-line bg-surface p-6">
              <p className="font-medium">No courses yet</p>
              <p className="mt-1 text-sm text-muted">
                Buy Decision Support with ArcGIS to get started.
              </p>
              <Button asChild className="mt-4">
                <Link to="/courses">Browse courses</Link>
              </Button>
            </div>
          ) : (
            rows.map((row) => {
              const s = statusLabel(row.status);
              return (
                <article key={row.id} className="rounded-xl bg-surface p-5 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl">{row.title}</h2>
                      <p className={`mt-1 text-sm ${s.className}`}>{s.label}</p>
                    </div>
                    {row.status === "active" ? (
                      <Button asChild size="sm">
                        <Link
                          to="/learn/$slug/$lessonId"
                          params={{
                            slug: row.slug,
                            lessonId: row.first_lesson_slug ?? "start",
                          }}
                        >
                          Open lessons
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="outline">
                        <Link to="/courses/$slug" params={{ slug: row.slug }}>
                          View course
                        </Link>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        <a
          href={SUPPORT.whatsappUrl}
          className="mt-8 inline-flex text-sm text-muted hover:text-fg"
        >
          WhatsApp support · {SUPPORT.whatsappDisplay}
        </a>
      </main>
    </Shell>
  );
}
