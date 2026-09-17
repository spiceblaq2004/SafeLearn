import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shell } from "@/components/shell";
import { PAYMENT, TOPICS } from "@/lib/safelearn";
import {
  adminAddLesson,
  adminCreateCourse,
  adminGetCourse,
  adminListCourses,
  adminUpdateCourse,
  adminUpdateLesson,
  getAdminFlag,
  listPendingPayments,
  reviewPayment,
  type CourseRow,
  type LessonDetail,
  type PaymentAdminRow,
} from "@/lib/server/safelearn";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"library" | "payments">("library");

  useEffect(() => {
    if (!user) return;
    void getAdminFlag()
      .then((r) => setAllowed(r.isAdmin))
      .catch(() => setAllowed(false));
  }, [user]);

  if (isPending || allowed === null) {
    return (
      <Shell>
        <main className="mx-auto max-w-4xl px-4 py-16">
          <div className="h-40 animate-pulse rounded-xl bg-sand" />
        </main>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (!allowed) {
    return (
      <Shell>
        <main className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Restricted</h1>
          <p className="mt-2 text-muted">This studio is for the SafeLearn operator.</p>
          <Button asChild className="mt-6">
            <Link to="/dashboard">Back</Link>
          </Button>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Studio</h1>
        <p className="mt-2 text-muted">
          Upload tutorials when they are ready. Confirm Mobile Money here.
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("library")}
            className={`h-11 rounded-full px-4 text-sm ${
              tab === "library" ? "bg-pine text-pine-fg" : "bg-sand"
            }`}
          >
            Library
          </button>
          <button
            type="button"
            onClick={() => setTab("payments")}
            className={`h-11 rounded-full px-4 text-sm ${
              tab === "payments" ? "bg-pine text-pine-fg" : "bg-sand"
            }`}
          >
            Payments
          </button>
        </div>
        {tab === "library" ? <LibraryPanel /> : <PaymentsPanel />}
      </main>
    </Shell>
  );
}

function PaymentsPanel() {
  const [rows, setRows] = useState<PaymentAdminRow[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function refresh() {
    setRows(await listPendingPayments());
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function decide(row: PaymentAdminRow, decision: "active" | "rejected") {
    setBusyId(row.id);
    try {
      await reviewPayment({
        data: { paymentId: row.id, enrollmentId: row.enrollment_id, decision },
      });
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Txn</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-muted">
                No submissions yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 align-top">
                  <p className="font-medium">{row.sender_name}</p>
                  <p className="text-muted">{row.user_email ?? row.user_id}</p>
                  <p className="text-muted">{row.momo_number}</p>
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium tabular-nums">{row.txn_id}</p>
                  <p className="text-muted">{row.course_title}</p>
                </td>
                <td className="px-4 py-3 align-top capitalize">{row.status}</td>
                <td className="px-4 py-3 align-top">
                  {row.status === "pending" ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        size="sm"
                        disabled={busyId === row.id}
                        onClick={() => void decide(row, "active")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === row.id}
                        onClick={() => void decide(row, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted">Done</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function emptyCourseForm() {
  return {
    title: "",
    subtitle: "",
    description: "",
    audience: "UENR · Fire Safety & Disaster Management",
    topic: TOPICS[0] as string,
    priceGhs: PAYMENT.priceGhs as number,
    comingSoon: true,
  };
}

function LibraryPanel() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [form, setForm] = useState(emptyCourseForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  async function refresh() {
    setCourses(await adminListCourses());
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await adminCreateCourse({ data: form });
      setForm(emptyCourseForm());
      await refresh();
      setOpenSlug(res.slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 grid gap-8">
      <form onSubmit={onCreate} className="grid gap-3 rounded-xl bg-surface p-5 shadow-card">
        <h2 className="font-display text-2xl">New tutorial</h2>
        <p className="text-sm text-muted">
          Create the shell first. Add lessons and video links whenever you have them.
        </p>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Title</span>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Short line</span>
          <Input
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Description</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Topic</span>
            <select
              className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            >
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Price (GHS)</span>
            <Input
              type="number"
              min={0}
              value={form.priceGhs}
              onChange={(e) => setForm({ ...form, priceGhs: Number(e.target.value) })}
              required
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Audience</span>
          <Input
            value={form.audience}
            onChange={(e) => setForm({ ...form, audience: e.target.value })}
            required
          />
        </label>
        <label className="flex h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.comingSoon}
            onChange={(e) => setForm({ ...form, comingSoon: e.target.checked })}
          />
          Keep as coming later (not for sale yet)
        </label>
        {error ? <p className="text-sm text-bad">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Add to library"}
        </Button>
      </form>

      <div className="grid gap-3">
        {courses.map((course) => (
          <div key={course.id} className="rounded-xl border border-line bg-surface">
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left"
              onClick={() => setOpenSlug(openSlug === course.slug ? null : course.slug)}
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">{course.topic}</p>
                <p className="font-display text-xl">{course.title}</p>
                <p className="text-sm text-muted">
                  {course.duration_label}
                  {course.coming_soon ? " · coming later" : " · open"}
                </p>
              </div>
              <span className="text-sm text-pine">
                {openSlug === course.slug ? "Close" : "Edit"}
              </span>
            </button>
            {openSlug === course.slug ? <CourseEditor slug={course.slug} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseEditor({ slug }: { slug: string }) {
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [lessons, setLessons] = useState<LessonDetail[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [priceGhs, setPriceGhs] = useState<number>(PAYMENT.priceGhs);
  const [comingSoon, setComingSoon] = useState(true);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSummary, setLessonSummary] = useState("");
  const [durationMin, setDurationMin] = useState(20);
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await adminGetCourse({ data: { slug } });
    if (!res) return;
    setCourse(res.course);
    setLessons(res.lessons);
    setTitle(res.course.title);
    setSubtitle(res.course.subtitle);
    setDescription(res.course.description);
    setAudience(res.course.audience);
    setTopic(res.course.topic);
    setPriceGhs(res.course.price_ghs);
    setComingSoon(res.course.coming_soon);
  }

  useEffect(() => {
    void load();
  }, [slug]);

  if (!course) return <div className="h-24 animate-pulse bg-sand" />;

  return (
    <div className="border-t border-line px-4 py-4">
      <form
        className="grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await adminUpdateCourse({
              data: {
                id: course.id,
                title,
                subtitle,
                description,
                audience,
                topic,
                priceGhs,
                comingSoon,
              },
            });
            await load();
          } finally {
            setBusy(false);
          }
        }}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        <textarea
          className="min-h-20 rounded-md border border-line px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Input
            type="number"
            value={priceGhs}
            onChange={(e) => setPriceGhs(Number(e.target.value))}
          />
        </div>
        <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
        <label className="flex h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={comingSoon}
            onChange={(e) => setComingSoon(e.target.checked)}
          />
          Coming later (hide purchase)
        </label>
        <Button type="submit" size="sm" disabled={busy}>
          Save tutorial
        </Button>
      </form>

      <h3 className="mt-8 font-display text-lg">Lessons</h3>
      <ul className="mt-2 grid gap-2">
        {lessons.map((lesson) => (
          <LessonEditRow
            key={lesson.id}
            lesson={lesson}
            courseId={course.id}
            onSaved={() => void load()}
          />
        ))}
      </ul>

      <form
        className="mt-6 grid gap-3 rounded-lg border border-line p-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await adminAddLesson({
              data: {
                courseId: course.id,
                title: lessonTitle,
                summary: lessonSummary,
                durationMin,
                content,
                videoUrl: videoUrl || undefined,
              },
            });
            setLessonTitle("");
            setLessonSummary("");
            setContent("");
            setVideoUrl("");
            await load();
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-sm font-medium">Add a lesson</p>
        <Input
          placeholder="Lesson title"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          required
        />
        <Input
          placeholder="One-line summary"
          value={lessonSummary}
          onChange={(e) => setLessonSummary(e.target.value)}
          required
        />
        <Input
          type="number"
          min={1}
          value={durationMin}
          onChange={(e) => setDurationMin(Number(e.target.value))}
        />
        <Input
          placeholder="Video URL (YouTube or mp4) — optional"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <textarea
          className="min-h-32 rounded-md border border-line px-3 py-2 text-sm"
          placeholder="Lesson notes. Use a blank line between paragraphs. ## for headings."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit" size="sm" disabled={busy}>
          Upload lesson
        </Button>
      </form>
    </div>
  );
}

function LessonEditRow({
  lesson,
  courseId,
  onSaved,
}: {
  lesson: LessonDetail;
  courseId: number;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [summary, setSummary] = useState(lesson.summary);
  const [durationMin, setDurationMin] = useState(lesson.duration_min);
  const [content, setContent] = useState(lesson.content);
  const [videoUrl, setVideoUrl] = useState(lesson.video_url ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <li className="rounded-md border border-line">
      <button
        type="button"
        className="flex w-full justify-between px-3 py-2 text-left text-sm"
        onClick={() => setOpen(!open)}
      >
        <span>{lesson.title}</span>
        <span className="text-muted">{lesson.video_url ? "Has video" : "Notes only"}</span>
      </button>
      {open ? (
        <form
          className="grid gap-2 border-t border-line p-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await adminUpdateLesson({
                data: {
                  id: lesson.id,
                  courseId,
                  title,
                  summary,
                  durationMin,
                  content,
                  videoUrl: videoUrl || undefined,
                },
              });
              onSaved();
            } finally {
              setBusy(false);
            }
          }}
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
          <Input
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
          />
          <Input
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <textarea
            className="min-h-24 rounded-md border border-line px-3 py-2 text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="submit" size="sm" disabled={busy}>
            Save lesson
          </Button>
        </form>
      ) : null}
    </li>
  );
}
