import Image from 'next/image';
import { Mail } from 'lucide-react';
import { LinkedInIcon, GitHubIcon, TwitterIcon } from '@/components/ui/SocialIcons';

export interface TeamCardProps {
  member: {
    _id: string;
    name: string;
    role: string;
    category: string;
    department?: string;
    photo: string;
    bio?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      email?: string;
    };
  };
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="group rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
      {/* Avatar Image */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden mb-4 border border-white/10 group-hover:border-amber-400/50 transition-colors bg-white/5 flex items-center justify-center p-2 shadow-inner">
        <Image
          src={member.photo || '/ecell-assets/icons/team_member.png'}
          alt={member.name}
          fill
          sizes="128px"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
        {member.name}
      </h3>
      <p className="text-xs font-semibold text-amber-400 mt-0.5">{member.role}</p>
      {member.department && (
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{member.department}</p>
      )}

      {member.bio && (
        <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
          {member.bio}
        </p>
      )}

      {/* Social Handles */}
      {member.socialLinks && (
        <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-white/5">
          {member.socialLinks.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.github && (
            <a
              href={member.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.twitter && (
            <a
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} Twitter`}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.email && (
            <a
              href={`mailto:${member.socialLinks.email}`}
              aria-label={`${member.name} Email`}
              className="text-slate-400 hover:text-amber-400 p-1 rounded transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
