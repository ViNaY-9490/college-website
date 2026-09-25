import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags?: string[];
    readTime: string;
    publishedAt: string | Date;
    author: {
      name: string;
      role?: string;
      avatar?: string;
    };
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group relative flex flex-col rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
            <Link href={`/blogs/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author & Read Article */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-800 border border-white/10">
              <Image
                src={post.author?.avatar || '/brand/ecell-logo.png'}
                alt={post.author?.name || 'Author'}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-slate-300 line-clamp-1">
              {post.author?.name}
            </span>
          </div>

          <span className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 inline-flex items-center gap-1">
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
