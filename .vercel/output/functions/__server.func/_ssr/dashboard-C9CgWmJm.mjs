import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as SUPPORT } from "./router-BiSK-nju.mjs";
import { i as Shell, n as Button, o as useCurrentUserState, r as RedirectToSignIn } from "./shell-PsOrZJA6.mjs";
import { o as listMyEnrollments, t as getAdminFlag } from "./safelearn-Bnnd0Z2g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-C9CgWmJm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function statusLabel(status) {
	if (status === "active") return {
		label: "Active",
		className: "text-good"
	};
	if (status === "pending") return {
		label: "Awaiting confirmation",
		className: "text-warn"
	};
	return {
		label: "Not approved",
		className: "text-bad"
	};
}
function Dashboard() {
	const { user, isPending } = useCurrentUserState();
	const [rows, setRows] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		listMyEnrollments().then(setRows).catch(() => setRows([]));
		getAdminFlag().then((r) => setIsAdmin(r.isAdmin)).catch(() => setIsAdmin(false));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-sand" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: ["Signed in as ", user.primaryEmail ?? user.displayName]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl tracking-tight",
				children: "My access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "After Mobile Money is confirmed, a course moves from pending to active."
			}),
			isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				className: "mt-4 inline-flex text-sm text-pine hover:underline",
				children: "Open payment review"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4",
				children: rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-xl bg-sand" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "No courses yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Buy Decision Support with ArcGIS to get started."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/courses",
								children: "Browse courses"
							})
						})
					]
				}) : rows.map((row) => {
					const s = statusLabel(row.status);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "rounded-xl bg-surface p-5 shadow-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: row.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-1 text-sm ${s.className}`,
								children: s.label
							})] }), row.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/learn/$slug/$lessonId",
									params: {
										slug: row.slug,
										lessonId: "gis-as-dss"
									},
									children: "Open lessons"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/courses/$slug",
									params: { slug: row.slug },
									children: "View course"
								})
							})]
						})
					}, row.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: SUPPORT.whatsappUrl,
				className: "mt-8 inline-flex text-sm text-muted hover:text-fg",
				children: ["WhatsApp support · ", SUPPORT.whatsappDisplay]
			})
		]
	}) });
}
//#endregion
export { Dashboard as component };
