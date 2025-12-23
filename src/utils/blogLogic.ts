import { aphorisms } from '../data/aphorisms';

/**
 * Deterministically picks an aphorism for a given date.
 */
export function getAphorismForDate(date: Date): string {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const hash = hashString(dateString);
  const index = Math.abs(hash) % aphorisms.length;
  return aphorisms[index];
}

/**
 * A simple string hashing function.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export interface BlogPost {
  id: string;
  date: string;
  aphorism: string;
  title: string;
}

/**
 * Generates blog posts from a start date until today.
 */
export function getBlogPostsUntilToday(): BlogPost[] {
  const startDate = new Date('2025-01-01');
  const today = new Date();
  const posts: BlogPost[] = [];

  const current = new Date(startDate);
  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0];
    posts.push({
      id: dateStr,
      date: dateStr,
      aphorism: getAphorismForDate(new Date(current)),
      title: `Daily Reflections: ${dateStr}`,
    });
    current.setDate(current.getDate() + 1);
  }

  // Return reversed so newest is first
  return posts.reverse();
}
