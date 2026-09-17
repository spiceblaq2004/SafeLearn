export function LessonBody({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);
  return (
    <div className="space-y-4 text-[0.98rem] leading-relaxed text-fg">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h3 key={i} className="pt-2 font-display text-xl tracking-tight">
              {block.replace(/^## /, "")}
            </h3>
          );
        }
        if (block.includes("\n- ") || block.startsWith("- ")) {
          const items = block
            .split("\n")
            .filter((l) => l.startsWith("- "))
            .map((l) => l.slice(2));
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-fg">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\. /.test(block) || block.includes("\n1. ") || /^\d+\. /m.test(block)) {
          const items = block
            .split("\n")
            .filter((l) => /^\d+\. /.test(l))
            .map((l) => l.replace(/^\d+\. /, ""));
          if (items.length) {
            return (
              <ol key={i} className="list-decimal space-y-1 pl-5">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          }
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
