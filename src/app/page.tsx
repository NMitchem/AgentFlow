'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/button';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Accelerate AI Development
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              &nbsp;Enterprise-Ready
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build, deploy, and manage AI agents at scale with enterprise-grade security and monitoring.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button asChild className="rounded-full px-8 py-6 text-lg">
              <Link href="/dashboard">
                Get Started
              </Link>
            </Button>
            <Button asChild className="rounded-full px-8 py-6 text-lg">
              <Link href="/dashboard">
                View Demo
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {/* Feature Cards */}
          {['Agent Orchestration', 'Model Monitoring', 'Data Pipelines'].map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              <p className="text-gray-600">Enterprise-grade infrastructure for AI agent development and deployment.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
