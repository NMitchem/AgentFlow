'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/button';

export default function DemoFlow() {
  const [results, setResults] = useState<string[]>([]);
  
  const runDemo = async () => {
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        body: JSON.stringify({ image_path: 'raccoon.jpeg' })
      });
      
      const data = await response.json();
      setResults([
        `Classification: ${data.classification}`,
        `Description: ${data.description}`,
        `Facts: ${data.facts.join('\n')}`
      ]);
    } catch (error) {
      console.error('Demo error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Interactive Demo</h1>
        <Button 
          onClick={runDemo}
          className="mb-8"
          whileHover={{ scale: 1.05 }}
        >
          Run Animal Analysis
        </Button>
        
        {results.map((result, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-md mb-4"
          >
            <pre className="whitespace-pre-wrap">{result}</pre>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 