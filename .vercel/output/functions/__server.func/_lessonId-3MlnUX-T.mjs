import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, x as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as Circle, s as CircleCheck } from "./_libs/lucide-react.mjs";
import { n as Route } from "./_ssr/router-BiSK-nju.mjs";
import { i as Shell, n as Button, o as useCurrentUserState, r as RedirectToSignIn } from "./_ssr/shell-PsOrZJA6.mjs";
import { c as markLessonComplete, r as getLessonForLearner } from "./_ssr/safelearn-Bnnd0Z2g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_lessonId-3MlnUX-T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LessonBody({ content }) {
	const blocks = content.split(/\n{2,}/);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4 text-[0.98rem] leading-relaxed text-fg",
		children: blocks.map((block, i) => {
			if (block.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "pt-2 font-display text-xl tracking-tight",
				children: block.replace(/^## /, "")
			}, i);
			if (block.includes("\n- ") || block.startsWith("- ")) {
				const items = block.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc space-y-1 pl-5 text-fg",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
				}, i);
			}
			if (/^\d+\. /.test(block) || block.includes("\n1. ") || /^\d+\. /m.test(block)) {
				const items = block.split("\n").filter((l) => /^\d+\. /.test(l)).map((l) => l.replace(/^\d+\. /, ""));
				if (items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "list-decimal space-y-1 pl-5",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
				}, i);
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: block }, i);
		})
	});
}
function LearnPage() {
	const { slug, lessonId } = Route.useParams();
	const { user, isPending } = useCurrentUserState();
	const [state, setState] = (0, import_react.useState)({ kind: "load" });
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getLessonForLearner({ data: {
			courseSlug: slug,
			lessonSlug: lessonId
		} }).then((res) => {
			if ("error" in res && res.error === "locked" && res.course) {
				setState({
					kind: "locked",
					course: res.course
				});
				return;
			}
			if ("error" in res && res.error === "not_found") {
				setState({ kind: "missing" });
				return;
			}
			if (res.error === null && res.course && res.lesson && res.lessons) setState({
				kind: "ok",
				course: res.course,
				lesson: res.lesson,
				lessons: res.lessons,
				completedIds: res.completedIds
			});
		});
	}, [
		user,
		slug,
		lessonId
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-5xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-sand" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (state.kind === "load") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-5xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-sand" })
	}) });
	if (state.kind === "missing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Lesson not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/courses",
				children: "Courses"
			})
		})]
	}) });
	if (state.kind === "locked") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Access is locked"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-muted",
				children: [
					"Pay for ",
					state.course.title,
					" and wait for confirmation to open the lessons."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/courses/$slug",
					params: { slug: state.course.slug },
					children: "Go to payment"
				})
			})
		]
	}) });
	const done = state.completedIds.includes(state.lesson.id);
	const idx = state.lessons.findIndex((l) => l.id === state.lesson.id);
	const next = state.lessons[idx + 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr] sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:sticky lg:top-6 lg:self-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wide text-muted",
				children: state.course.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-3 grid gap-1",
				children: state.lessons.map((lesson, i) => {
					const active = lesson.slug === state.lesson.slug;
					const complete = state.completedIds.includes(lesson.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/learn/$slug/$lessonId",
						params: {
							slug,
							lessonId: lesson.slug
						},
						className: `flex items-start gap-2 rounded-md px-2 py-2 text-sm ${active ? "bg-sand text-fg" : "text-muted hover:text-fg"}`,
						children: [complete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 size-4 shrink-0 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-[11px] uppercase tracking-wide",
							children: ["Lesson ", i + 1]
						}), lesson.title] })]
					}, lesson.id);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl bg-surface p-5 shadow-card sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs uppercase tracking-wide text-muted",
					children: [state.lesson.duration_min, " minutes"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: state.lesson.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: state.lesson.summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-lg border border-dashed border-line bg-sand/50 px-4 py-8 text-center text-sm text-muted",
					children: "Instructor video for this lesson will play here once your recordings are uploaded."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonBody, { content: state.lesson.content })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: done || saving,
						onClick: async () => {
							setSaving(true);
							try {
								await markLessonComplete({ data: {
									lessonId: state.lesson.id,
									courseId: state.course.id
								} });
								setState({
									...state,
									completedIds: [.../* @__PURE__ */ new Set([...state.completedIds, state.lesson.id])]
								});
							} finally {
								setSaving(false);
							}
						},
						children: done ? "Completed" : "Mark complete"
					}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/learn/$slug/$lessonId",
							params: {
								slug,
								lessonId: next.slug
							},
							children: "Next lesson"
						})
					}) : null]
				})
			]
		})]
	}) });
}
//#endregion
export { LearnPage as component };
