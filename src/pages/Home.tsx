import { motion } from 'framer-motion';
import { Calendar, Users, Activity } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Medical background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Welcome to SmartClinic
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8"
          >
            Your Health, Our Priority
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-50 transition-colors"
          >
            Book Appointment
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SmartClinic?</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.2}>
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-blue-600" />}
                title="Easy Scheduling"
                description="Book appointments online anytime, anywhere with our intuitive scheduling system."
              />
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <FeatureCard
                icon={<Users className="h-8 w-8 text-blue-600" />}
                title="Expert Doctors"
                description="Access to highly qualified and experienced medical professionals."
              />
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <FeatureCard
                icon={<Activity className="h-8 w-8 text-blue-600" />}
                title="Modern Facilities"
                description="State-of-the-art medical equipment and comfortable environment."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}