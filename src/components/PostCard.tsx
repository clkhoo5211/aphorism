import { Calendar, Quote, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '../utils/blogLogic';

interface PostCardProps {
  post: BlogPost;
  index: number;
}

export const PostCard = ({ post, index }: PostCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-900/80 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0 group-hover:opacity-10 pointer-events-none">
        <Quote className="h-24 w-24 text-cyan-400" />
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-cyan-500/80 uppercase tracking-tighter">
        <Calendar className="h-3 w-3" />
        {post.date}
        <span className="mx-2 text-slate-700">|</span>
        <span className="text-slate-400">STATUS: VERIFIED</span>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
        {post.title}
      </h2>

      <div className="relative">
        <span className="absolute -left-2 top-0 text-cyan-500/20 italic font-serif text-4xl select-none">"</span>
        <p className="text-lg leading-relaxed text-slate-300 italic font-medium pt-2 pl-4">
          {post.aphorism}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-800/50">
        <div className="flex gap-4">
          <button className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        <button className="flex items-center gap-1 text-xs font-bold text-cyan-500/80 uppercase tracking-widest hover:text-cyan-400 transition-colors group/btn">
          RE-ENCODE
          <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Futuristic corner details */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-cyan-500/50 transition-all rounded-tl-xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-cyan-500/50 transition-all rounded-br-xl" />
    </motion.article>
  );
};
