import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, x as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as Copy, c as Check } from "./_libs/lucide-react.mjs";
import { a as PAYMENT, o as SUPPORT, r as Route$2, s as formatGhs } from "./_ssr/router-BiSK-nju.mjs";
import { i as Shell, n as Button, o as useCurrentUserState } from "./_ssr/shell-PsOrZJA6.mjs";
import { i as getMyEnrollment, n as getCourseBySlug, u as submitPayment } from "./_ssr/safelearn-Bnnd0Z2g.mjs";
import { t as Input } from "./_ssr/input-BpQWoyA4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-96XMEPsf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CourseDetail() {
	const { slug } = Route$2.useParams();
	const { user, isPending } = useCurrentUserState();
	const [course, setCourse] = (0, import_react.useState)(null);
	const [lessons, setLessons] = (0, import_react.useState)([]);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [senderName, setSenderName] = (0, import_react.useState)("");
	const [momoNumber, setMomoNumber] = (0, import_react.useState)("");
	const [txnId, setTxnId] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [formError, setFormError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getCourseBySlug({ data: { slug } }).then((res) => {
			if (!res) {
				setMissing(true);
				return;
			}
			setCourse(res.course);
			setLessons(res.lessons);
		});
	}, [slug]);
	(0, import_react.useEffect)(() => {
		if (!user || !course) return;
		getMyEnrollment({ data: { courseId: course.id } }).then((row) => setStatus(row?.status ?? null)).catch(() => setStatus(null));
	}, [user, course]);
	async function copyNumber() {
		try {
			await navigator.clipboard.writeText(PAYMENT.number);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {}
	}
	async function onPay(e) {
		e.preventDefault();
		if (!course) return;
		setFormError(null);
		setBusy(true);
		try {
			const res = await submitPayment({ data: {
				courseId: course.id,
				network: PAYMENT.network,
				senderName,
				momoNumber,
				txnId,
				notes: notes || void 0
			} });
			setStatus(res.status);
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Could not submit");
		} finally {
			setBusy(false);
		}
	}
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Course not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/courses",
				children: "Back to courses"
			})
		})]
	}) });
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 animate-pulse rounded-xl bg-sand" })
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium uppercase tracking-[0.16em] text-pine",
				children: course.audience
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: course.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-xl text-muted leading-relaxed",
				children: course.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-10 space-y-3",
				children: lessons.map((lesson, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-line bg-surface px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: [
								"Lesson ",
								i + 1,
								" · ",
								lesson.duration_min,
								" min"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: lesson.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: lesson.summary
						})
					]
				}, lesson.id))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-xl bg-surface p-5 shadow-card sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tabular-nums",
					children: formatGhs(course.price_ghs)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "One-time · unlimited access"
				}),
				status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-good",
							children: "Your access is active."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/learn/$slug/$lessonId",
								params: {
									slug: course.slug,
									lessonId: lessons[0]?.slug ?? "gis-as-dss"
								},
								children: "Continue learning"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: SUPPORT.whatsappUrl,
							className: "inline-flex h-11 items-center justify-center rounded-md border border-line text-sm",
							children: "Open WhatsApp support"
						})
					]
				}) : status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md bg-sand px-3 py-2 text-warn",
						children: "Payment received for review. You will get access after it is confirmed — usually the same day."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "text-pine hover:underline",
						children: "Check access status"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-lg border border-line p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: ["Pay with ", PAYMENT.network]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-muted",
							children: ["Name: ", PAYMENT.accountName]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl tabular-nums tracking-tight",
								children: PAYMENT.numberDisplay
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void copyNumber(),
								className: "inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm text-pine",
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied" : "Copy"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-muted",
							children: [
								"Send exactly ",
								formatGhs(PAYMENT.priceGhs),
								", then submit the transaction ID below."
							]
						})
					]
				}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-5 h-40 animate-pulse rounded-md bg-sand" }) : !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Sign in to submit payment"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onPay,
					className: "mt-5 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Name on the Mobile Money"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: senderName,
								onChange: (e) => setSenderName(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Your MoMo number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: momoNumber,
								onChange: (e) => setMomoNumber(e.target.value),
								required: true,
								inputMode: "tel"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Transaction ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: txnId,
								onChange: (e) => setTxnId(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Note (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: notes,
								onChange: (e) => setNotes(e.target.value)
							})]
						}),
						formError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-bad",
							children: formError
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Sending…" : "I have paid — submit"
						})
					]
				})] })
			]
		})]
	}) });
}
//#endregion
export { CourseDetail as component };
