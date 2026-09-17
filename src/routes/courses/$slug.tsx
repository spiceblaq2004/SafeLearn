import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shell } from "@/components/shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PAYMENT, SUPPORT, formatGhs } from "@/lib/safelearn";
import {
  getCourseBySlug,
  getMyEnrollment,
  submitPayment,
  type CourseRow,
  type LessonSummary,
} from "@/lib/server/safelearn";

export const Route = createFileRoute("/courses/$slug")({ component: CourseDetail });

function CourseDetail() {
  const { slug } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [missing, setMissing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [txnId, setTxnId] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    void getCourseBySlug({ data: { slug } }).then((res) => {
      if (!res) {
        setMissing(true);
        return;
      }
      setCourse(res.course);
      setLessons(res.lessons);
    });
  }, [slug]);

  useEffect(() => {
    if (!user || !course) return;
    void getMyEnrollment({ data: { courseId: course.id } })
      .then((row) => setStatus(row?.status ?? null))
      .catch(() => setStatus(null));
  }, [user, course]);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(PAYMENT.number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    setFormError(null);
    setBusy(true);
    try {
      const res = await submitPayment({
        data: {
          courseId: course.id,
          network: PAYMENT.network,
          senderName,
          momoNumber,
          txnId,
          notes: notes || undefined,
        },
      });
      setStatus(res.status);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  if (missing) {
    return (
      <Shell>
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Course not found</h1>
          <Button asChild className="mt-6">
            <Link to="/courses">Back to courses</Link>
          </Button>
        </main>
      </Shell>
    );
  }

  if (!course) {
    return (
      <Shell>
        <main className="mx-auto max-w-6xl px-4 py-16">
          <div className="h-72 animate-pulse rounded-xl bg-sand" />
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start sm:px-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-pine">
            {course.topic} · {course.audience}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">{course.title}</h1>
          <p className="mt-4 max-w-xl text-muted leading-relaxed">{course.description}</p>

          <ol className="mt-10 space-y-3">
            {lessons.map((lesson, i) => (
              <li
                key={lesson.id}
                className="rounded-lg border border-line bg-surface px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-muted">
                  Lesson {i + 1} · {lesson.duration_min} min
                </p>
                <p className="mt-1 font-medium">{lesson.title}</p>
                <p className="mt-1 text-sm text-muted">{lesson.summary}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-xl bg-surface p-5 shadow-card sm:p-6">
          <p className="font-display text-3xl tabular-nums">{formatGhs(course.price_ghs)}</p>
          <p className="mt-1 text-sm text-muted">One-time · unlimited access</p>

          {status === "active" ? (
            <div className="mt-6 grid gap-3">
              <p className="text-sm text-good">Your access is active.</p>
              <Button asChild>
                <Link
                  to="/learn/$slug/$lessonId"
                  params={{ slug: course.slug, lessonId: lessons[0]?.slug ?? "gis-as-dss" }}
                >
                  Continue learning
                </Link>
              </Button>
              <a
                href={SUPPORT.whatsappUrl}
                className="inline-flex h-11 items-center justify-center rounded-md border border-line text-sm"
              >
                Open WhatsApp support
              </a>
            </div>
          ) : status === "pending" ? (
            <div className="mt-6 space-y-3 text-sm">
              <p className="rounded-md bg-sand px-3 py-2 text-warn">
                Payment received for review. You will get access after it is
                confirmed — usually the same day.
              </p>
              <Link to="/dashboard" className="text-pine hover:underline">
                Check access status
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-5 rounded-lg border border-line p-4 text-sm">
                <p className="font-medium">Pay with {PAYMENT.network}</p>
                <p className="mt-2 text-muted">Name: {PAYMENT.accountName}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="font-display text-2xl tabular-nums tracking-tight">
                    {PAYMENT.numberDisplay}
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyNumber()}
                    className="inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm text-pine"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-muted">
                  Send exactly {formatGhs(PAYMENT.priceGhs)}, then submit the
                  transaction ID below.
                </p>
              </div>

              {isPending ? (
                <div className="mt-5 h-40 animate-pulse rounded-md bg-sand" />
              ) : !user ? (
                <Button asChild className="mt-5 w-full">
                  <Link to="/login">Sign in to submit payment</Link>
                </Button>
              ) : (
                <form onSubmit={onPay} className="mt-5 grid gap-3">
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Name on the Mobile Money</span>
                    <Input
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Your MoMo number</span>
                    <Input
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      required
                      inputMode="tel"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Transaction ID</span>
                    <Input
                      value={txnId}
                      onChange={(e) => setTxnId(e.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Note (optional)</span>
                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </label>
                  {formError ? <p className="text-sm text-bad">{formError}</p> : null}
                  <Button type="submit" disabled={busy}>
                    {busy ? "Sending…" : "I have paid — submit"}
                  </Button>
                </form>
              )}
            </>
          )}
        </aside>
      </main>
    </Shell>
  );
}
