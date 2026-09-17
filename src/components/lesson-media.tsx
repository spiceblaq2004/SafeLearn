import { youtubeId } from "@/lib/safelearn";

export function LessonMedia({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-sand/50 px-4 py-8 text-center text-sm text-muted">
        Video will appear here when this lesson is uploaded.
      </div>
    );
  }

  const yt = youtubeId(url);
  if (yt) {
    return (
      <div className="overflow-hidden rounded-lg border border-line bg-ink">
        <iframe
          title="Lesson video"
          src={`https://www.youtube.com/embed/${yt}`}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return (
      <video
        className="aspect-video w-full rounded-lg border border-line bg-ink"
        src={url}
        controls
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex h-11 items-center justify-center rounded-lg border border-line text-sm text-pine hover:bg-sand"
    >
      Open lesson recording
    </a>
  );
}
