import { Rocket, Zap, Users, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export interface InitiativeCardProps {
  initiative: {
    _id: string;
    title: string;
    slug: string;
    tag: string;
    shortDescription: string;
    description: string;
    iconName?: string;
    highlights?: string[];
    metrics?: { value: string; label: string }[];
  };
}

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-sky-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-emerald-400" />;
      default:
        return <Compass className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="group rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
      <div className="space-y-4">
        {/* Icon & Tag */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
            {getIcon(initiative.iconName)}
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
            {initiative.tag}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
            {initiative.title}
          </h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {initiative.shortDescription}
          </p>
        </div>

        {/* Highlights */}
        {initiative.highlights && initiative.highlights.length > 0 && (
          <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-300">
            {initiative.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Metrics Grid */}
        {initiative.metrics && initiative.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
            {initiative.metrics.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="block text-base font-bold text-white">{m.value}</span>
                <span className="block text-[11px] text-slate-400">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
        <Link
          href="/initiatives"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors"
        >
          <span>Learn More About Cohorts</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
