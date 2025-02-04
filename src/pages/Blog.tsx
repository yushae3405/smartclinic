import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Eye } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { AnimatedSection } from '../components/AnimatedSection';
import { getPosts, seedPosts } from '../lib/api';
import type { Post } from '../types';

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['Health Tips', 'Medical Research', 'Patient Care', 'Technology'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let data = await getPosts(selectedCategory !== 'all' ? selectedCategory : undefined);
        
        // If no posts exist, seed the database
        if (!data || data.length === 0) {
          data = await seedPosts();
        }
        
        setPosts(data || []);
      } catch (err) {
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Medical Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Insights from Our Medical Experts</p>
      </motion.div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
            }`}
          >
            All Posts
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <AnimatedSection key={post.id} delay={index * 0.1}>
              <Link to={`/blog/${post.slug}`}>
                <motion.article
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views} views
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {post.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={post.author?.image}
                          alt={post.author?.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {post.author?.name}
                        </span>
                      </div>
                      <span className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                        <Tag className="w-4 h-4 mr-1" />
                        {post.category}
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}