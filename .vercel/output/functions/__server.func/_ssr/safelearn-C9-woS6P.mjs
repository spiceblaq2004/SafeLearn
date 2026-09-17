import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-BrtW4WzY.mjs";
import { t as authMiddleware } from "./middleware-Dnyh6ml0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/safelearn-C9-woS6P.js
async function isAdminUser(userId) {
	return (await (await getSql())`
    select 1 as ok
    from "user" u
    join admin_emails a on lower(a.email) = lower(u.email)
    where u.id = ${userId}
    limit 1
  `).length > 0;
}
var listCourses_createServerFn_handler = createServerRpc({
	id: "66ab8585fda95c6a77aafbdd61d468194dc1fc632c9e98019e76364b7b845d7b",
	name: "listCourses",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => listCourses.__executeServer(opts));
var listCourses = createServerFn({ method: "GET" }).handler(listCourses_createServerFn_handler, async () => {
	return (await getSql())`
    select id, slug, title, subtitle, description, audience, price_ghs,
           duration_label, lesson_count, coming_soon
    from courses
    where is_published = true
    order by coming_soon asc, id asc
  `;
});
var getCourseBySlug_createServerFn_handler = createServerRpc({
	id: "5b29e1d5c231ed85eea7bb5b496cc912c5c9b9785519a0bc831dfc8cc7a4007d",
	name: "getCourseBySlug",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => getCourseBySlug.__executeServer(opts));
var getCourseBySlug = createServerFn({ method: "GET" }).validator(object({ slug: string().min(1) })).handler(getCourseBySlug_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const course = (await sql`
      select id, slug, title, subtitle, description, audience, price_ghs,
             duration_label, lesson_count, coming_soon
      from courses
      where slug = ${data.slug}
      limit 1
    `)[0];
	if (!course) return null;
	return {
		course,
		lessons: await sql`
      select id, slug, title, summary, duration_min, sort_order
      from lessons
      where course_id = ${course.id}
      order by sort_order asc
    `
	};
});
var getMyEnrollment_createServerFn_handler = createServerRpc({
	id: "b3c0e7cecbdfbf93481c8267d9bf98367eb8f7921ad6d2995b3a4fa59efe7e63",
	name: "getMyEnrollment",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => getMyEnrollment.__executeServer(opts));
var getMyEnrollment = createServerFn({ method: "GET" }).validator(object({ courseId: number() })).middleware([authMiddleware]).handler(getMyEnrollment_createServerFn_handler, async ({ context, data }) => {
	return (await (await getSql())`
      select id, status, created_at
      from enrollments
      where user_id = ${context.userId} and course_id = ${data.courseId}
      limit 1
    `)[0] ?? null;
});
var listMyEnrollments_createServerFn_handler = createServerRpc({
	id: "3ac082722eb8b55437ca88234e12bb31fed102ded70831637b24dcd9ea1484e7",
	name: "listMyEnrollments",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => listMyEnrollments.__executeServer(opts));
var listMyEnrollments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyEnrollments_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select e.id, e.course_id, e.status, e.created_at, e.approved_at,
             c.slug, c.title
      from enrollments e
      join courses c on c.id = e.course_id
      where e.user_id = ${context.userId}
      order by e.created_at desc
    `;
});
var submitPayment_createServerFn_handler = createServerRpc({
	id: "e4cd8527d4bccac7c9209747c91b7c88b6f47cc8acfc431a15e02fd5463b225d",
	name: "submitPayment",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => submitPayment.__executeServer(opts));
var submitPayment = createServerFn({ method: "POST" }).validator(object({
	courseId: number(),
	network: string().min(2),
	senderName: string().min(2).max(120),
	momoNumber: string().min(8).max(20),
	txnId: string().min(4).max(80),
	notes: string().max(400).optional()
})).middleware([authMiddleware]).handler(submitPayment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const course = await sql`
      select id, coming_soon from courses where id = ${data.courseId} limit 1
    `;
	if (!course[0] || course[0].coming_soon) throw new Error("This course is not open for payment yet.");
	const existing = await sql`
      select id, status from enrollments
      where user_id = ${context.userId} and course_id = ${data.courseId}
      limit 1
    `;
	let enrollmentId;
	if (existing[0]?.status === "active") return {
		ok: true,
		status: "active"
	};
	if (existing[0]) {
		enrollmentId = existing[0].id;
		await sql`
        update enrollments set status = 'pending'
        where id = ${enrollmentId} and user_id = ${context.userId}
      `;
	} else enrollmentId = (await sql`
        insert into enrollments (user_id, course_id, status)
        values (${context.userId}, ${data.courseId}, 'pending')
        returning id
      `)[0].id;
	await sql`
      insert into payments (
        user_id, course_id, enrollment_id, network, sender_name, momo_number, txn_id, notes, status
      ) values (
        ${context.userId}, ${data.courseId}, ${enrollmentId},
        ${data.network}, ${data.senderName}, ${data.momoNumber}, ${data.txnId},
        ${data.notes ?? null}, 'pending'
      )
    `;
	return {
		ok: true,
		status: "pending"
	};
});
var getLessonForLearner_createServerFn_handler = createServerRpc({
	id: "1d84d26e7010098ce5c3675ab710f8a31e5b0399be2c974188e6d9df00e0d677",
	name: "getLessonForLearner",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => getLessonForLearner.__executeServer(opts));
var getLessonForLearner = createServerFn({ method: "GET" }).validator(object({
	courseSlug: string(),
	lessonSlug: string()
})).middleware([authMiddleware]).handler(getLessonForLearner_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const course = (await sql`
      select id, slug, title, subtitle, description, audience, price_ghs,
             duration_label, lesson_count, coming_soon
      from courses where slug = ${data.courseSlug} limit 1
    `)[0];
	if (!course) return { error: "not_found" };
	if ((await sql`
      select status from enrollments
      where user_id = ${context.userId} and course_id = ${course.id}
      limit 1
    `)[0]?.status !== "active") return {
		error: "locked",
		course
	};
	const lessons = await sql`
      select id, slug, title, summary, duration_min, sort_order, content
      from lessons where course_id = ${course.id}
      order by sort_order asc
    `;
	const lesson = lessons.find((l) => l.slug === data.lessonSlug) ?? lessons[0];
	if (!lesson) return { error: "not_found" };
	const progress = await sql`
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
		completedIds: progress.filter((p) => p.completed_at).map((p) => p.lesson_id)
	};
});
var markLessonComplete_createServerFn_handler = createServerRpc({
	id: "8c40699df6da72daf1cfaf75ca021cbd9b72339fcd3b44be19f2212a0b374799",
	name: "markLessonComplete",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => markLessonComplete.__executeServer(opts));
var markLessonComplete = createServerFn({ method: "POST" }).validator(object({
	lessonId: number(),
	courseId: number()
})).middleware([authMiddleware]).handler(markLessonComplete_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select status from enrollments
      where user_id = ${context.userId} and course_id = ${data.courseId}
      limit 1
    `)[0]?.status !== "active") throw new Error("No active access.");
	await sql`
      insert into lesson_progress (user_id, lesson_id, completed_at, last_viewed_at)
      values (${context.userId}, ${data.lessonId}, now(), now())
      on conflict (user_id, lesson_id)
      do update set completed_at = coalesce(lesson_progress.completed_at, now()), last_viewed_at = now()
    `;
	return { ok: true };
});
var getAdminFlag_createServerFn_handler = createServerRpc({
	id: "67e0fc520281a327a8a889e90e8c2013d64f8d2c315c1b63a4484617f65db4cd",
	name: "getAdminFlag",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => getAdminFlag.__executeServer(opts));
var getAdminFlag = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminFlag_createServerFn_handler, async ({ context }) => {
	return { isAdmin: await isAdminUser(context.userId) };
});
var listPendingPayments_createServerFn_handler = createServerRpc({
	id: "89847c448499d515ee6c2e5e98bfc5f66f2d705c85445bc71823ecabcd52c79c",
	name: "listPendingPayments",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => listPendingPayments.__executeServer(opts));
var listPendingPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPendingPayments_createServerFn_handler, async ({ context }) => {
	if (!await isAdminUser(context.userId)) throw new Error("Forbidden");
	return (await getSql())`
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
var reviewPayment_createServerFn_handler = createServerRpc({
	id: "f2b335076772f80d12e43ac17154da2707aa91bfc45b7c4e45dd33b6430731de",
	name: "reviewPayment",
	filename: "src/lib/server/safelearn.ts"
}, (opts) => reviewPayment.__executeServer(opts));
var reviewPayment = createServerFn({ method: "POST" }).validator(object({
	paymentId: number(),
	enrollmentId: number(),
	decision: _enum(["active", "rejected"])
})).middleware([authMiddleware]).handler(reviewPayment_createServerFn_handler, async ({ context, data }) => {
	if (!await isAdminUser(context.userId)) throw new Error("Forbidden");
	const sql = await getSql();
	await sql`
      update payments set status = ${data.decision}
      where id = ${data.paymentId}
    `;
	if (data.decision === "active") await sql`
        update enrollments
        set status = 'active', approved_at = now()
        where id = ${data.enrollmentId}
      `;
	else await sql`
        update enrollments
        set status = 'rejected'
        where id = ${data.enrollmentId}
      `;
	return { ok: true };
});
//#endregion
export { getAdminFlag_createServerFn_handler, getCourseBySlug_createServerFn_handler, getLessonForLearner_createServerFn_handler, getMyEnrollment_createServerFn_handler, listCourses_createServerFn_handler, listMyEnrollments_createServerFn_handler, listPendingPayments_createServerFn_handler, markLessonComplete_createServerFn_handler, reviewPayment_createServerFn_handler, submitPayment_createServerFn_handler };
