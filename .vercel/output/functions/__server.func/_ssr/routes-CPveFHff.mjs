import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Map, l as BookOpen, n as Smartphone, r as ShieldCheck, u as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as PAYMENT, i as APP_NAME, s as formatGhs } from "./router-BiSK-nju.mjs";
import { i as Shell, n as Button } from "./shell-PsOrZJA6.mjs";
import { a as listCourses } from "./safelearn-Bnnd0Z2g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPveFHff.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const [courses, setCourses] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listCourses().then(setCourses).catch(() => setCourses([]));
	}, []);
	const featured = courses.find((c) => !c.coming_soon);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-line bg-sand/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium uppercase tracking-[0.16em] text-pine",
						children: "UENR · Disaster management"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-xl font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl",
						children: "Learn ArcGIS the way the operations room uses it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 max-w-lg text-base leading-relaxed text-muted",
						children: [APP_NAME, " is a small tutorial studio for Fire Safety and Disaster Management students. One course, a clear price, unlimited access after you pay with Mobile Money."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/courses",
								children: ["View courses", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Create an account"
							})
						})]
					})
				] }), featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-surface p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted",
							children: ["Open now · ", formatGhs(featured.price_ghs)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl tracking-tight",
							children: featured.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: featured.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: featured.audience
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-6 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/courses/$slug",
								params: { slug: featured.slug },
								children: "Get access"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-sand" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6",
			children: [
				{
					icon: Map,
					title: "Spatial decisions",
					body: "Hazard, exposure, and capacity — mapped so a command team can choose, not guess."
				},
				{
					icon: BookOpen,
					title: "Five focused lessons",
					body: "Written walkthroughs that match the ArcGIS DSS course. Your recorded videos slot in as you publish them."
				},
				{
					icon: Smartphone,
					title: "Pay once on Telecel",
					body: `Send ${formatGhs(PAYMENT.priceGhs)} to ${PAYMENT.numberDisplay}. We unlock your account after we confirm the transfer.`
				}
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
						className: "size-5 text-pine",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-lg",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: item.body
					})
				]
			}, item.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-line bg-ink text-pine-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "One-time fee. Unlimited access."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-pine-fg/70",
						children: "No subscription. After approval you keep the lessons and can join the WhatsApp community for questions."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/courses",
						children: "See pricing"
					})
				})]
			})
		})
	] }) });
}
//#endregion
export { Home as component };
