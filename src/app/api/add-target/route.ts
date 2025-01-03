import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Initialize Supabase client
const supabase = createClient(
  'https://waqrbekdrzjhfayngtod.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhcXJiZWtkcnpqaGZheW5ndG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDc2OTMsImV4cCI6MjA1MTM4MzY5M30.VckHGYOuHWXJNoqsyPv7dLkJ0jbd08xIGpY02OzHfM8',
);

// Initialize Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'koikai254@gmail.com',
    pass: 'uxrn deno vclh vqus',
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, target_amount } = body;

    if (!email || !name || !target_amount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Insert data into Supabase
    const { error } = await supabase
      .from('weekly_targets')
      .insert([{ email, name, target_amount, current_week: 1 }]);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Send email
    const mailOptions = {
      from: 'koikai254@gmail.com',
      to: email,
      subject: 'Welcome to Your Weekly Savings Challenge!',
      text: `Hi ${name},\n\nWelcome to the 52 Weeks Savings Challenge! 🎉\n\nWe’re excited to be part of your journey to financial growth! Your savings target for Week 1 is Ksh ${target_amount}. You’ve got this!\n\nAs part of the challenge, we’ll be sending you weekly reminders every Thursday at 1:00 PM to keep you on track. Let’s make every week count!\n\nKeep up the great work and stay motivated!\n\nBest regards,\nThe 52 Weeks Savings Challenge Team`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Target added and email sent.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
