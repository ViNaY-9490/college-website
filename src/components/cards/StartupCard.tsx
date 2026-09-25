import Image from 'next/image';
import { ExternalLink, Award, CheckCircle, Users } from 'lucide-react';

export interface StartupCardProps {
  startup: {
    _id: string;
    name: string;
    slug: string;
    tagline: string;
    logo: string;
    category: string;
    stage: string;
    problem: string;
    solution: string;
    founders?: { name: string; role: string }[];
    website?: string;
    achievements?: string[];
  };
}

export default function StartupCard({ startup }: StartupCardProps) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Early Traction':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Validation':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Prototype':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    }
  };

  return (
    <div className="group rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
      <div className="space-y-4">
        {/* Header: Logo, Name, Category, Stage */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
              <Image
                src={startup.logo}
                alt={startup.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {startup.name}
              </h3>
              <span className="text-xs text-slate-400">{startup.category}</span>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStageColor(
              startup.stage
            )}`}
          >
            {startup.stage}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          {startup.tagline}
        </p>

        {/* Problem & Solution Accordion/Brief */}
        <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-rose-400/90 uppercase tracking-wider text-[10px]">
              Problem:{' '}
            </span>
            <span>{startup.problem}</span>
          </div>
          <div>
            <span className="font-semibold text-emerald-400/90 uppercase tracking-wider text-[10px]">
              Solution:{' '}
            </span>
            <span>{startup.solution}</span>
          </div>
        </div>

        {/* Founders */}
        {startup.founders && startup.founders.length > 0 && (
          <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-300">
              {startup.founders.map((f) => f.name).join(', ')}
            </span>
          </div>
        )}

        {/* Achievements */}
        {startup.achievements && startup.achievements.length > 0 && (
          <div className="space-y-1">
            {startup.achievements.slice(0, 2).map((ach, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-amber-300/90">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{ach}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Website link */}
      {startup.website && (
        <div className="pt-4 mt-2 border-t border-white/5">
          <a
            href={startup.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
