import { Users, Calendar, Rocket, Award, Shield, CheckCircle } from 'lucide-react';

interface ImpactMetricsProps {
  stats?: {
    activeMembers: string;
    eventsHosted: string;
    startupsSupported: string;
    mentorsConnected: string;
  };
}

export default function ImpactMetrics({
  stats = {
    activeMembers: '150+',
    eventsHosted: '35+',
    startupsSupported: '14+',
    mentorsConnected: '40+',
  },
}: ImpactMetricsProps) {
  const metrics = [
    {
      value: stats.activeMembers,
      label: 'Student Innovators',
      description: 'Active campus builders across departments',
      icon: Users,
      color: 'text-amber-400',
      border: 'hover:border-amber-400/30',
    },
    {
      value: stats.eventsHosted,
      label: 'Events & Hackathons',
      description: 'Conferences, speaker talks & coding marathons',
      icon: Calendar,
      color: 'text-sky-400',
      border: 'hover:border-sky-400/30',
    },
    {
      value: stats.startupsSupported,
      label: 'Startups Supported',
      description: 'Incubated from prototype to traction',
      icon: Rocket,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-400/30',
    },
    {
      value: stats.mentorsConnected,
      label: 'Industry Mentors',
      description: 'Founders, angel investors & alumni leaders',
      icon: Award,
      color: 'text-purple-400',
      border: 'hover:border-purple-400/30',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#07080b] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-[#0c1017] border border-white/10 ${item.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${item.color}`}>
                    {item.value}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">{item.label}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
