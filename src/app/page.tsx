'use client';

import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import '@/lib/env';

import UnderlineLink from '@/components/links/UnderlineLink';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Early return if form is not valid
    if (!email || !weeklyTarget || !consent) {
      setError('Please fill in all fields and consent to receiving emails.');
      return;
    }

    setLoading(true);
    setError(''); // Clear previous error

    try {
      const response = await axios.post('/api/add-target', {
        email,
        target_amount: weeklyTarget,
        name: email.split('@')[0], // Using the email prefix as the name (you can adjust this logic)
      });
      // Handle successful submission
      alert(response.data.message);

      // Reset form fields after successful submission
      setEmail('');
      setWeeklyTarget('');
      setConsent(false);
    } catch (err) {
      // Handle error response
      setError('There was an issue with your submission.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          {/* Add margin-top adjustments */}
          <h1 className='mt-2 text-2xl font-bold'>
            Welcome to the 52 Weeks Savings Challenge
          </h1>

          {/* Reduce spacing between the heading and paragraph */}
          <p className='mt-1 text-sm text-gray-800'>
            Start your journey towards financial growth by setting your weekly
            savings target. Each week, you'll save a bit more, and we’ll remind
            you to keep going!
          </p>
          <p className='mt-1 text-sm text-gray-800'>
            By submitting your email and target, you consent to receiving weekly
            reminder emails from us.
          </p>

          {/* Adjust form spacing */}
          <form
            className='space-y-4 w-full max-w-lg mx-auto mt-6'
            onSubmit={handleSubmit}
          >
            <div>
              {/* <label
      htmlFor="email"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Email Address
    </label> */}
              <label
                htmlFor='weeklyTarget'
                className='block text-sm font-medium text-left mb-2'
              >
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 
      focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor='weeklyTarget'
                className='block text-sm font-medium text-left mb-2'
              >
                Weekly Target (Ksh)
              </label>
              <input
                type='number'
                id='weeklyTarget'
                name='weeklyTarget'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 
      focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                placeholder='Enter your weekly savings target'
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(e.target.value)}
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='consent'
                className='border-gray-300 rounded'
                checked={consent}
                onChange={() => setConsent(!consent)}
                required
              />
              <label htmlFor='consent' className='text-sm text-gray-600'>
                I consent to receiving weekly reminder emails.
              </label>
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
              type='submit'
              className='px-6 py-3 font-medium text-white bg-blue-600 rounded-lg
            shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50'
              disabled={!consent || loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {/* Add a slight margin-top for better spacing */}
          <footer className='absolute bottom-2 text-gray-700'>
            © {new Date().getFullYear()} By{' '}
            <UnderlineLink href='https://theodorusclarence.com?ref=tsnextstarter'>
              52 Weeks Saving Challenge App
            </UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
