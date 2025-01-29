import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { getDoctors } from '../lib/api';
import type { Doctor } from '../types';

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors(search, specialty);
        setDoctors(data);
        // Extract unique specialties for filter
        const uniqueSpecialties = Array.from(new Set(data.map(d => d.specialty)));
        setSpecialties(uniqueSpecialties);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(debounce);
  }, [search, specialty]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Experts</h1>
        <p className="text-xl text-gray-600">Meet Our Team of Specialized Doctors</p>
      </motion.div>

      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors by name..."
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Specialties</option>
            {specialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              No doctors found matching your criteria.
            </div>
          ) : (
            doctors.map((doctor, index) => (
              <AnimatedSection key={doctor.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative h-64">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                    <p className="text-blue-600 mb-2">{doctor.specialty}</p>
                    <p className="text-gray-600 mb-4">{doctor.experience} Years Experience</p>
                    <Link
                      to={`/appointments?doctorId=${doctor.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Appointment
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))
          )}
        </div>
      )}
    </div>
  );
}