import React, { useState } from 'react';
import { ExternalLink, Radio, PlayCircle, Loader2 } from 'lucide-react';

interface AudioEmbedProps {
  url: string;
  title: string;
  isIvoox?: boolean;
}

export const AudioEmbed: React.FC<AudioEmbedProps> = ({ url, title, isIvoox = false }) => {
  const [loaded, setLoaded] = useState(false);

  // If it's Ivoox, use the direct player URL
  // If it's SoundCloud, construct the official SoundCloud widget embed URL
  let embedUrl = url;
  const isSoundCloud = url.includes('soundcloud.com');

  if (isSoundCloud) {
    embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      url
    )}&color=%2327ae60&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
  }

  const isEmbeddable = isIvoox || isSoundCloud;

  return (
    <div className="w-full my-3">
      {isEmbeddable ? (
        <div className="relative rounded-xl overflow-hidden bg-stone-900/40 border border-white/10 shadow-inner">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 text-[#f4f1e6] gap-2 py-8 z-10">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              <span className="text-xs font-mono">Audio erreproduzitzailea kargatzen...</span>
            </div>
          )}
          <iframe
            src={embedUrl}
            width="100%"
            height={isSoundCloud ? '166' : '200'}
            frameBorder="0"
            scrolling="no"
            loading="lazy"
            allow="autoplay"
            title={`Audio: ${title}`}
            onLoad={() => setLoaded(true)}
            className="w-full block rounded-xl"
          />
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-stone-900/50 border border-white/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f4f1e6]">{title}</p>
              <p className="text-xs text-white/60">Audio fitxategia kanpoko erreproduzitzailean</p>
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#f4f1e6] text-[#264333] font-semibold text-xs rounded-lg hover:bg-white transition-all shadow cursor-pointer shrink-0"
          >
            <PlayCircle className="w-4 h-4" />
            Audioa ireki
          </a>
        </div>
      )}

      {/* External link helper */}
      <div className="mt-2 flex items-center justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#f4f1e6]/70 hover:text-[#f4f1e6] underline underline-offset-2 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3 h-3" />
          Ireki beste pestaina batean
        </a>
      </div>
    </div>
  );
};
