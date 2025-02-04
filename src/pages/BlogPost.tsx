import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, MessageSquare, Eye } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { AnimatedSection } from '../components/AnimatedSection';
import { getPost, createComment } from '../lib/api';
import type { Post, Comment } from '../types';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState({ name: '', email: '', content: '' });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (slug) {
          const data = await getPost(slug);
          setPost(data);
        }
      } catch (err) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (post?.id) {
        const newComment = await createComment(post.id, comment);
        setPost(prev => prev ? {
          ...prev,
          comments: [...(prev.comments || []), newComment],
        } : null);
        setComment({ name: '', email: '', content: '' });
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMMM d, yyyy');
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

  if (loading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <article className="max-w-4xl mx-auto">
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author?.name}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {post.views} views
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {post.comments?.length || 0} comments
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {post.title}
              </h1>

              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Author Bio */}
        <AnimatedSection delay={0.2}>
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6">
              <img
                src={post.author?.image}
                alt={post.author?.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {post.author?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {post.author?.specialty} • {post.author?.experience} years of experience
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {post.author?.bio}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Comments Section */}
        <AnimatedSection delay={0.3}>
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Comments ({post.comments?.length || 0})
            </h2>

            <form onSubmit={handleCommentSubmit} className="mb-12">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={comment.name}
                    onChange={e => setComment({ ...comment, name: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={comment.email}
                    onChange={e => setComment({ ...comment, email: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment.content}
                  onChange={e => setComment({ ...comment, content: e.target.value })}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Comment
              </motion.button>
            </form>

            <div className="space-y-8">
              {post.comments?.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {comment.name}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </article>
    </div>
  );
}

