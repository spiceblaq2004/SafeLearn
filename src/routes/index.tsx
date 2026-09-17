import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Globe2, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/shell";
import { listCourses, type CourseRow } from "@/lib/server/safelearn";
import { APP_NAME, PAYMENT, formatGhs } from "@/lib/safelearn";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [courses, setCourses] = useState<CourseRow[] | null>(null);

  useEffect(() => {
    void listCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  const open = courses?.filter((c) => !c.coming_soon) ?? [];
  const featured = open[0];

  return (
    <Shell>
      <main>
        <section className="border-b border-line bg-sand/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-pine">
                Fire safety · Disaster management
              </p>
              <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl">
                A tutorial library that grows with the course.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
                {APP_NAME} publishes practical lessons for UENR students as they
                are recorded — fire safety, disaster management, GIS, and
                response. Pay once per tutorial. Access stays yours.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/courses">
                    Browse library
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Create an account</Link>
                </Button>
              </div>
            </div>

            {courses === null ? (
              <div className="h-48 animate-pulse rounded-xl bg-sand" />
            ) : featured ? (
              <article className="rounded-xl bg-surface p-6 shadow-card">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {featured.topic} · {formatGhs(featured.price_ghs)}
                </p>
                <h2 className="mt-2 font-display text-2xl tracking-tight">{featured.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{featured.subtitle}</p>
                <Button asChild className="mt-6 w-full">
                  <Link to="/courses/$slug" params={{ slug: featured.slug }}>
                    Get access
                  </Link>
                </Button>
              </article>
            ) : (
              <article className="rounded-xl bg-surface p-6 shadow-card">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Library
                </p>
                <h2 className="mt-2 font-display text-2xl tracking-tight">
                  New tutorials land here
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Lessons are uploaded when they are ready. Check the library
                  after each practical week.
                </p>
              </article>
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6">
          {[
            {
              icon: Flame,
              title: "Fire safety",
              body: "Prevention, protection systems, and the field habits that keep a crew alive.",
            },
            {
              icon: Globe2,
              title: "Disaster management",
              body: "Preparedness, GIS, and decision support for floods, fire, and other hazards.",
            },
            {
              icon: Smartphone,
              title: "Pay when a tutorial opens",
              body: `Each open tutorial is ${formatGhs(PAYMENT.priceGhs)} on ${PAYMENT.network}. We unlock it after we confirm the transfer.`,
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-line bg-surface p-5">
              <item.icon className="size-5 text-pine" strokeWidth={1.75} />
              <h3 className="mt-3 font-display text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="border-t border-line bg-ink text-pine-fg">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-display text-xl">Uploaded as needed. Kept for good.</p>
                <p className="mt-1 text-sm text-pine-fg/70">
                  No subscription. After a tutorial is confirmed, you keep the
                  lessons and can ask questions on WhatsApp.
                </p>
              </div>
            </div>
            <Button asChild variant="secondary">
              <Link to="/courses">Open the library</Link>
            </Button>
          </div>
        </section>
      </main>
    </Shell>
  );
}
