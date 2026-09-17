import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { LessonBody } from "@/components/lesson-body";
import { LessonMedia } from "@/components/lesson-media";
import { Shell } from "@/components/shell";
import {
  getLessonForLearner,
  markLessonComplete,
  type CourseRow,
  type LessonDetail,
  type LessonSummary,
} from "@/lib/server/safelearn";

export const Route = createFileRoute("/learn/$slug/$lessonId")({
  component: LearnPage,
});

function LearnPage() {
  const { slug, lessonId } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [state, setState] = useState<
    | { kind: "load" }
    | { kind: "locked"; course: CourseRow }
    | { kind: "missing" }
    | {
        kind: "ok";
        course: CourseRow;
        lesson: LessonDetail;
        lessons: LessonSummary[];
        completedIds: number[];
      }
  >({ kind: "load" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getLessonForLearner({ data: { courseSlug: slug, lessonSlug: lessonId } }).then(
      (res) => {
        if ("error" in res && res.error === "locked" && res.course) {
          setState({ kind: "locked", course: res.course });
          return;
        }
        if ("error" in res && res.error === "not_found") {
          setState({ kind: "missing" });
          return;
        }
        if (res.error === null && res.course && res.lesson && res.lessons) {
          setState({
            kind: "ok",
            course: res.course,
            lesson: res.lesson,
            lessons: res.lessons,
            completedIds: res.completedIds,
          });
        }
      },
    );
  }, [user, slug, lessonId]);

  if (isPending) {
    return (
      <Shell>
        <main className="mx-auto max-w-5xl px-4 py-16">
          <div className="h-64 animate-pulse rounded-xl bg-sand" />
        </main>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  if (state.kind === "load") {
    return (
      <Shell>
        <main className="mx-auto max-w-5xl px-4 py-16">
          <div className="h-64 animate-pulse rounded-xl bg-sand" />
        </main>
      </Shell>
    );
  }

  if (state.kind === "missing") {
    return (
      <Shell>
        <main className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Lesson not found</h1>
          <Button asChild className="mt-6">
            <Link to="/courses">Courses</Link>
          </Button>
        </main>
      </Shell>
    );
  }

  if (state.kind === "locked") {
    return (
      <Shell>
        <main className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Access is locked</h1>
          <p className="mt-3 text-muted">
            Pay for {state.course.title} and wait for confirmation to open the
            lessons.
          </p>
          <Button asChild className="mt-6">
            <Link to="/courses/$slug" params={{ slug: state.course.slug }}>
              Go to payment
            </Link>
          </Button>
        </main>
      </Shell>
    );
  }

  const done = state.completedIds.includes(state.lesson.id);
  const idx = state.lessons.findIndex((l) => l.id === state.lesson.id);
  const next = state.lessons[idx + 1];

  return (
    <Shell>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr] sm:px-6">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="text-xs uppercase tracking-wide text-muted">{state.course.title}</p>
          <nav className="mt-3 grid gap-1">
            {state.lessons.map((lesson, i) => {
              const active = lesson.slug === state.lesson.slug;
              const complete = state.completedIds.includes(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  to="/learn/$slug/$lessonId"
                  params={{ slug, lessonId: lesson.slug }}
                  className={`flex items-start gap-2 rounded-md px-2 py-2 text-sm ${
                    active ? "bg-sand text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {complete ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-good" />
                  ) : (
                    <Circle className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span>
                    <span className="block text-[11px] uppercase tracking-wide">
                      Lesson {i + 1}
                    </span>
                    {lesson.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <article className="rounded-xl bg-surface p-5 shadow-card sm:p-8">
          <p className="text-xs uppercase tracking-wide text-muted">
            {state.lesson.duration_min} minutes
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">{state.lesson.title}</h1>
          <p className="mt-2 text-muted">{state.lesson.summary}</p>
          <div className="mt-6">
            <LessonMedia url={state.lesson.video_url} />
          </div>
          <div className="mt-8">
            <LessonBody content={state.lesson.content} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              disabled={done || saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await markLessonComplete({
                    data: { lessonId: state.lesson.id, courseId: state.course.id },
                  });
                  setState({
                    ...state,
                    completedIds: [...new Set([...state.completedIds, state.lesson.id])],
                  });
                } finally {
                  setSaving(false);
                }
              }}
            >
              {done ? "Completed" : "Mark complete"}
            </Button>
            {next ? (
              <Button asChild variant="outline">
                <Link
                  to="/learn/$slug/$lessonId"
                  params={{ slug, lessonId: next.slug }}
                >
                  Next lesson
                </Link>
              </Button>
            ) : null}
          </div>
        </article>
      </main>
    </Shell>
  );
}
