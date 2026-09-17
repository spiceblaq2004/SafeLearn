import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as formatGhs } from "./router-BiSK-nju.mjs";
import { i as Shell, n as Button } from "./shell-PsOrZJA6.mjs";
import { a as listCourses } from "./safelearn-Bnnd0Z2g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses-Bvt2WveI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoursesPage() {
	const [courses, setCourses] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listCourses().then(setCourses).catch(() => setCourses([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium uppercase tracking-[0.16em] text-pine",
				children: "Catalogue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: "Courses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-muted",
				children: "Start with Decision Support in ArcGIS. More Fire Safety GIS modules will open when they are ready."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 md:grid-cols-2",
				children: courses === null ? [0, 1].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-sand" }, k)) : courses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex flex-col rounded-xl bg-surface p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: course.duration_label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-pine",
								children: course.coming_soon ? "Soon" : formatGhs(course.price_ghs)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-2xl tracking-tight",
							children: course.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: course.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: course.audience
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: course.coming_soon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: true,
								variant: "secondary",
								children: "Not open yet"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/courses/$slug",
									params: { slug: course.slug },
									children: "View course"
								})
							})
						})
					]
				}, course.id))
			})
		]
	}) });
}
//#endregion
export { CoursesPage as component };
