import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/shell";
import { listCourses, type CourseRow } from "@/lib/server/safelearn";
import { TOPICS, formatGhs } from "@/lib/safelearn";

export const Route = createFileRoute("/courses/")({ component: CoursesPage });

function CoursesPage() {
  const [courses, setCourses] = useState<CourseRow[] | null>(null);
  const [topic, setTopic] = useState<string>("All");

  useEffect(() => {
    void listCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  const visible = useMemo(() => {
    if (!courses) return [];
    if (topic === "All") return courses;
    return courses.filter((c) => c.topic === topic);
  }, [courses, topic]);

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-pine">Library</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Tutorials</h1>
        <p className="mt-3 max-w-xl text-muted">
          Fire safety, disaster management, and GIS — added as soon as each
          recording and write-up is ready. Filter by topic, then buy the ones
          you need.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {["All", ...TOPICS].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTopic(name)}
              className={`h-11 rounded-full px-4 text-sm ${
                topic === name ? "bg-pine text-pine-fg" : "bg-sand text-fg hover:bg-line"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {courses === null
            ? [0, 1].map((k) => (
                <div key={k} className="h-64 animate-pulse rounded-xl bg-sand" />
              ))
            : visible.length === 0
              ? (
                <p className="text-muted md:col-span-2">
                  Nothing in this topic yet. New tutorials appear here when they
                  are uploaded.
                </p>
              )
              : visible.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col rounded-xl bg-surface p-6 shadow-card"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide">
                    <span className="text-muted">{course.topic}</span>
                    <span className="text-pine">
                      {course.coming_soon ? "Coming later" : formatGhs(course.price_ghs)}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl tracking-tight">{course.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{course.subtitle}</p>
                  <p className="mt-4 text-sm text-muted">
                    {course.duration_label} · {course.audience}
                  </p>
                  <div className="mt-6">
                    {course.coming_soon ? (
                      <Button disabled variant="secondary">
                        Not open yet
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/courses/$slug" params={{ slug: course.slug }}>
                          View tutorial
                        </Link>
                      </Button>
                    )}
                  </div>
                </article>
              ))}
        </div>
      </main>
    </Shell>
  );
}
