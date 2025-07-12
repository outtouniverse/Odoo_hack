import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Star, TrendingUp, UserCheck, BookOpen, Award } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Teach Anything</span>
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Learn Anytime
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 sm:text-xl">
                Join our thriving community where skills are currency. Share what you know, learn what you need, and grow together.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Explore Skills
                </Link>
              </div>
              <div className="mt-8 text-sm text-gray-500">
                <span className="font-semibold text-gray-900">1000+</span> Skills shared by our community
              </div>
            </div>

            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="bg-white rounded-lg p-8 shadow-xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                    <UserCheck className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center space-y-4">
                    <div className="flex justify-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <p className="text-gray-600">Connecting learners worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">1200+</div>
              <div className="text-gray-600 mt-2">Skills Available</div>
              <p className="text-sm text-gray-500 mt-1">From programming to cooking, we have it all</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600 mt-2">Active Teachers</div>
              <p className="text-sm text-gray-500 mt-1">Expert practitioners ready to share</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">30K+</div>
              <div className="text-gray-600 mt-2">Students</div>
              <p className="text-sm text-gray-500 mt-1">Learners growing their skills daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How SkillSwap Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple, effective, and rewarding skill exchange
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-6">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Skills</h3>
              <p className="text-gray-600">
                Create your profile and list the skills you can teach. From photography to programming, every skill has value.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-6">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find & Connect</h3>
              <p className="text-gray-600">
                Browse through thousands of skills and connect with people who can teach you what you want to learn.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-6">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Exchange & Grow</h3>
              <p className="text-gray-600">
                Start skill swapping! Teach what you know in exchange for learning something new. Build your knowledge network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Your Skill Journey?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of learners and teachers in our vibrant community
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Join SkillSwap Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;