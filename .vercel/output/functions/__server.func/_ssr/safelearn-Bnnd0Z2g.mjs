import { r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { c as createSsrRpc } from "./router-BiSK-nju.mjs";
import { t as authMiddleware } from "./middleware-Dnyh6ml0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/safelearn-Bnnd0Z2g.js
var listCourses = createServerFn({ method: "GET" }).handler(createSsrRpc("66ab8585fda95c6a77aafbdd61d468194dc1fc632c9e98019e76364b7b845d7b"));
var getCourseBySlug = createServerFn({ method: "GET" }).validator(object({ slug: string().min(1) })).handler(createSsrRpc("5b29e1d5c231ed85eea7bb5b496cc912c5c9b9785519a0bc831dfc8cc7a4007d"));
var getMyEnrollment = createServerFn({ method: "GET" }).validator(object({ courseId: number() })).middleware([authMiddleware]).handler(createSsrRpc("b3c0e7cecbdfbf93481c8267d9bf98367eb8f7921ad6d2995b3a4fa59efe7e63"));
var listMyEnrollments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3ac082722eb8b55437ca88234e12bb31fed102ded70831637b24dcd9ea1484e7"));
var submitPayment = createServerFn({ method: "POST" }).validator(object({
	courseId: number(),
	network: string().min(2),
	senderName: string().min(2).max(120),
	momoNumber: string().min(8).max(20),
	txnId: string().min(4).max(80),
	notes: string().max(400).optional()
})).middleware([authMiddleware]).handler(createSsrRpc("e4cd8527d4bccac7c9209747c91b7c88b6f47cc8acfc431a15e02fd5463b225d"));
var getLessonForLearner = createServerFn({ method: "GET" }).validator(object({
	courseSlug: string(),
	lessonSlug: string()
})).middleware([authMiddleware]).handler(createSsrRpc("1d84d26e7010098ce5c3675ab710f8a31e5b0399be2c974188e6d9df00e0d677"));
var markLessonComplete = createServerFn({ method: "POST" }).validator(object({
	lessonId: number(),
	courseId: number()
})).middleware([authMiddleware]).handler(createSsrRpc("8c40699df6da72daf1cfaf75ca021cbd9b72339fcd3b44be19f2212a0b374799"));
var getAdminFlag = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("67e0fc520281a327a8a889e90e8c2013d64f8d2c315c1b63a4484617f65db4cd"));
var listPendingPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("89847c448499d515ee6c2e5e98bfc5f66f2d705c85445bc71823ecabcd52c79c"));
var reviewPayment = createServerFn({ method: "POST" }).validator(object({
	paymentId: number(),
	enrollmentId: number(),
	decision: _enum(["active", "rejected"])
})).middleware([authMiddleware]).handler(createSsrRpc("f2b335076772f80d12e43ac17154da2707aa91bfc45b7c4e45dd33b6430731de"));
//#endregion
export { listCourses as a, markLessonComplete as c, getMyEnrollment as i, reviewPayment as l, getCourseBySlug as n, listMyEnrollments as o, getLessonForLearner as r, listPendingPayments as s, getAdminFlag as t, submitPayment as u };
