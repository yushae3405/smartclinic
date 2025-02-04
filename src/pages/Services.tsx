import { motion } from 'framer-motion';
import { Stethoscope, Heart, Brain, Eye, Bluetooth as Tooth, ChevronFirst as FirstAid } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { getServices, seedServices } from '../lib/api';
import type { Service } from '../types';

const iconComponents = {
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Tooth,
  FirstAid
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        let data = await getServices();
        
        // If no services exist, seed the database
        if (!data || data.length === 0) {
          data = await seedServices();
        }
        
        setServices(data || []);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Comprehensive Healthcare Solutions for Every Need</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconComponents[service.icon as keyof typeof iconComponents];
            return (
              <AnimatedSection key={service.id || index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                      {IconComponent && <IconComponent className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-lg">{service.description}</p>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      )}
    </div>
  );
}