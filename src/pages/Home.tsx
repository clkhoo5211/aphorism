import { useEffect, useState } from 'react';
import { PostCard } from '../components/PostCard';
import { getBlogPostsUntilToday, type BlogPost } from '../utils/blogLogic';
import { motion } from 'framer-motion';

export const Home = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const data = getBlogPostsUntilToday();
    setPosts(data);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 space-y-4 text-center"
      >
        <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Daily Buffer Synchronized
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">
          DIGITAL <span className="text-cyan-400">WISDOM</span> INTERFACE
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
          Processing timeless insights through a modern tech lens. Every segment is verified,
          deterministic, and synchronized with the current temporal cycle.
        </p>
      </motion.div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </section>
    </>
  );
};
