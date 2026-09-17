import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { slugify } from "@/lib/safelearn";

export type CourseRow = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  audience: string;
  topic: string;
  price_ghs: number;
  duration_label: string;
  lesson_count: number;
  coming_soon: boolean;
  is_published?: boolean;
};

export type LessonSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  duration_min: number;
  sort_order: number;
  video_url: string | null;
};

export type LessonDetail = LessonSummary & { content: string };

export type EnrollmentRow = {
  id: number;
  course_id: number;
  status: string;
  created_at: string;
  approved_at: string | null;
  slug: string;
  title: string;
  first_lesson_slug: string | null;
};

export type PaymentAdminRow = {
  id: number;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  course_title: string;
  network: string;
  sender_name: string;
  momo_number: string;
  txn_id: string;
  notes: string | null;
  status: string;
  created_at: string;
  enrollment_id: number;
};

async function isAdminUser(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ ok: number }>`
    select 1 as ok
    from "user" u
    join admin_emails a on lower(a.email) = lower(u.email)
    where u.id = ${userId}
    limit 1
  `;
  return rows.length > 0;
}

async function requireAdmin(userId: string) {
  if (!(await isAdminUser(userId))) throw new Error("Forbidden");
}

async function refreshCourseMeta(courseId: number) {
  const sql = await getSql();
  const rows = await sql<{ n: number; minutes: number }>`
    select count(*)::int as n, coalesce(sum(duration_min), 0)::int as minutes
    from lessons where course_id = ${courseId}
  `;
  const n = rows[0]?.n ?? 0;
  const label = n === 0 ? "Lessons incoming" : `${n} lesson${n === 1 ? "" : "s"}`;
  await sql`
    update courses set lesson_count = ${n}, duration_label = ${label}
    where id = ${courseId}
  `;
}

export const listCourses = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<CourseRow>`
    select id, slug, title, subtitle, description, audience, topic, price_ghs,
           duration_label, lesson_count, coming_soon
    from courses
    where is_published = true
    order by coming_soon asc, id desc
  `;
});

export const getCourseBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const courses = await sql<CourseRow>`
      select id, slug, title, subtitle, description, audience, topic, price_ghs,
             duration_label, lesson_count, coming_soon
      from courses
      where slug = ${data.slug}
      limit 1
    `;
    const course = courses[0];
    if (!course) return null;
    const lessons = await sql<LessonSummary>`
      select id, slug, title, summary, duration_min, sort_order, video_url
      from lessons
      where course_id = ${course.id}
      order by sort_order asc
    `;
    return { course, lessons };
  });

export const getMyEnrollment = createServerFn({ method: "GET" })
  .validator(z.object({ courseId: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      status: string;
      created_at: string;
    }>`
      select id, status, created_at
      from enrollments
      where user_id = ${context.userId} and course_id = ${data.courseId}
      limit 1
    `;
    return rows[0] ?? null;
  });

export const listMyEnrollments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<EnrollmentRow>`
      select e.id, e.course_id, e.status, e.created_at, e.approved_at,
             c.slug, c.title,
             (select l.slug from lessons l
              where l.course_id = e.course_id
              order by l.sort_order asc limit 1) as first_lesson_slug
      from enrollments e
      join courses c on c.id = e.course_id
      where e.user_id = ${context.userId}
      order by e.created_at desc
    `;
  });

export const submitPayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      courseId: z.number(),
      network: z.string().min(2),
      senderName: z.string().min(2).max(120),
      momoNumber: z.string().min(8).max(20),
      txnId: z.string().min(4).max(80),
      notes: z.string().max(400).optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const course = await sql<{ id: number; coming_soon: boolean }>`
      select id, coming_soon from courses where id = ${data.courseId} limit 1
    `;
    if (!course[0] || course[0].coming_soon) {
      throw new Error("This tutorial is not open for payment yet.");
    }

    const existing = await sql<{ id: number; status: string }>`
      select id, status from enrollments
      where user_id = ${context.userId} and course_id = ${data.courseId}
      limit 1
    `;

    let enrollmentId: number;
    if (existing[0]?.status === "active") {
      return { ok: true as const, status: "active" as const };
    }
    if (existing[0]) {
      enrollmentId = existing[0].id;
      await sql`
        update enrollments set status = 'pending'
        where id = ${enrollmentId} and user_id = ${context.userId}
      `;
    } else {
      const inserted = await sql<{ id: number }>`
        insert into enrollments (user_id, course_id, status)
        values (${context.userId}, ${data.courseId}, 'pending')
        returning id
      `;
      enrollmentId = inserted[0].id;
    }

    await sql`
      insert into payments (
        user_id, course_id, enrollment_id, network, sender_name, momo_number, txn_id, notes, status
      ) values (
        ${context.userId}, ${data.courseId}, ${enrollmentId},
        ${data.network}, ${data.senderName}, ${data.momoNumber}, ${data.txnId},
        ${data.notes ?? null}, 'pending'
      )
    `;

    return { ok: true as const, status: "pending" as const };
  });

export const getLessonForLearner = createServerFn({ method: "GET" })
  .validator(z.object({ courseSlug: z.string(), lessonSlug: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const courses = await sql<CourseRow>`
      select id, slug, title, subtitle, description, audience, topic, price_ghs,
             duration_label, lesson_count, coming_soon
      from courses where slug = ${data.courseSlug} limit 1
    `;
    const course = courses[0];
    if (!course) return { error: "not_found" as const };

    const enroll = await sql<{ status: string }>`
      select status from enrollments
      where user_id = ${context.userId} and course_id = ${course.id}
      limit 1
    `;
    if (enroll[0]?.status !== "active") {
      return { error: "locked" as const, course };
    }

    const lessons = await sql<LessonDetail>`
      select id, slug, title, summary, duration_min, sort_order, content, video_url
      from lessons where course_id = ${course.id}
      order by sort_order asc
    `;
    const lesson = lessons.find((l) => l.slug === data.lessonSlug) ?? lessons[0];
    if (!lesson) return { error: "not_found" as const };

    const progress = await sql<{ lesson_id: number; completed_at: string | null }>`
      select lesson_id, completed_at from lesson_progress
      where user_id = ${context.userId}
        and lesson_id in (select id from lessons where course_id = ${course.id})
    `;

    await sql`
      insert into lesson_progress (user_id, lesson_id, last_viewed_at)
      values (${context.userId}, ${lesson.id}, now())
      on conflict (user_id, lesson_id)
      do update set last_viewed_at = now()
    `;

    return {
      error: null,
      course,
      lesson,
      lessons: lessons.map(({ content: _c, ...rest }) => rest),
      completedIds: progress.filter((p) => p.completed_at).map((p) => p.lesson_id),
    };
  });

export const markLessonComplete = createServerFn({ method: "POST" })
  .validator(z.object({ lessonId: z.number(), courseId: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const enroll = await sql<{ status: string }>`
      select status from enrollments
      where user_id = ${context.userId} and course_id = ${data.courseId}
      limit 1
    `;
    if (enroll[0]?.status !== "active") throw new Error("No active access.");
    await sql`
      insert into lesson_progress (user_id, lesson_id, completed_at, last_viewed_at)
      values (${context.userId}, ${data.lessonId}, now(), now())
      on conflict (user_id, lesson_id)
      do update set completed_at = coalesce(lesson_progress.completed_at, now()), last_viewed_at = now()
    `;
    return { ok: true };
  });

export const getAdminFlag = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return { isAdmin: await isAdminUser(context.userId) };
  });

export const listPendingPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql<PaymentAdminRow>`
      select p.id, p.user_id, u.email as user_email, u.name as user_name,
             c.title as course_title, p.network, p.sender_name, p.momo_number,
             p.txn_id, p.notes, p.status, p.created_at, p.enrollment_id
      from payments p
      join courses c on c.id = p.course_id
      left join "user" u on u.id = p.user_id
      order by p.created_at desc
      limit 80
    `;
  });

export const reviewPayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      paymentId: z.number(),
      enrollmentId: z.number(),
      decision: z.enum(["active", "rejected"]),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`
      update payments set status = ${data.decision}
      where id = ${data.paymentId}
    `;
    if (data.decision === "active") {
      await sql`
        update enrollments
        set status = 'active', approved_at = now()
        where id = ${data.enrollmentId}
      `;
    } else {
      await sql`
        update enrollments
        set status = 'rejected'
        where id = ${data.enrollmentId}
      `;
    }
    return { ok: true };
  });

export const adminListCourses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql<CourseRow>`
      select id, slug, title, subtitle, description, audience, topic, price_ghs,
             duration_label, lesson_count, coming_soon, is_published
      from courses
      order by id desc
    `;
  });

const courseInput = z.object({
  title: z.string().min(3).max(140),
  subtitle: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  audience: z.string().min(2).max(160),
  topic: z.string().min(2).max(80),
  priceGhs: z.number().int().min(0).max(5000),
  comingSoon: z.boolean(),
});

export const adminCreateCourse = createServerFn({ method: "POST" })
  .validator(courseInput)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    let slug = slugify(data.title);
    const clash = await sql<{ slug: string }>`select slug from courses where slug = ${slug}`;
    if (clash[0]) slug = `${slug}-${Date.now().toString(36)}`;
    const rows = await sql<{ slug: string }>`
      insert into courses (
        slug, title, subtitle, description, audience, topic, price_ghs,
        duration_label, lesson_count, is_published, coming_soon
      ) values (
        ${slug}, ${data.title}, ${data.subtitle}, ${data.description},
        ${data.audience}, ${data.topic}, ${data.priceGhs},
        'Lessons incoming', 0, true, ${data.comingSoon}
      )
      returning slug
    `;
    return { slug: rows[0].slug };
  });

export const adminUpdateCourse = createServerFn({ method: "POST" })
  .validator(courseInput.extend({ id: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`
      update courses set
        title = ${data.title},
        subtitle = ${data.subtitle},
        description = ${data.description},
        audience = ${data.audience},
        topic = ${data.topic},
        price_ghs = ${data.priceGhs},
        coming_soon = ${data.comingSoon}
      where id = ${data.id}
    `;
    return { ok: true };
  });

export const adminGetCourse = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const courses = await sql<CourseRow>`
      select id, slug, title, subtitle, description, audience, topic, price_ghs,
             duration_label, lesson_count, coming_soon, is_published
      from courses where slug = ${data.slug} limit 1
    `;
    const course = courses[0];
    if (!course) return null;
    const lessons = await sql<LessonDetail>`
      select id, slug, title, summary, duration_min, sort_order, content, video_url
      from lessons where course_id = ${course.id}
      order by sort_order asc
    `;
    return { course, lessons };
  });

export const adminAddLesson = createServerFn({ method: "POST" })
  .validator(
    z.object({
      courseId: z.number(),
      title: z.string().min(3).max(140),
      summary: z.string().min(3).max(400),
      durationMin: z.number().int().min(1).max(300),
      content: z.string().min(10).max(20000),
      videoUrl: z.string().max(500).optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const max = await sql<{ n: number }>`
      select coalesce(max(sort_order), 0)::int as n from lessons where course_id = ${data.courseId}
    `;
    let slug = slugify(data.title);
    const clash = await sql<{ slug: string }>`
      select slug from lessons where course_id = ${data.courseId} and slug = ${slug}
    `;
    if (clash[0]) slug = `${slug}-${(max[0]?.n ?? 0) + 1}`;
    const video = data.videoUrl?.trim() || null;
    await sql`
      insert into lessons (
        course_id, slug, title, summary, duration_min, sort_order, content, video_url
      ) values (
        ${data.courseId}, ${slug}, ${data.title}, ${data.summary},
        ${data.durationMin}, ${(max[0]?.n ?? 0) + 1}, ${data.content}, ${video}
      )
    `;
    await refreshCourseMeta(data.courseId);
    return { ok: true };
  });

export const adminUpdateLesson = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number(),
      courseId: z.number(),
      title: z.string().min(3).max(140),
      summary: z.string().min(3).max(400),
      durationMin: z.number().int().min(1).max(300),
      content: z.string().min(10).max(20000),
      videoUrl: z.string().max(500).optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const video = data.videoUrl?.trim() || null;
    await sql`
      update lessons set
        title = ${data.title},
        summary = ${data.summary},
        duration_min = ${data.durationMin},
        content = ${data.content},
        video_url = ${video}
      where id = ${data.id} and course_id = ${data.courseId}
    `;
    await refreshCourseMeta(data.courseId);
    return { ok: true };
  });
