import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

const supabase = createClient(
  'https://waqrbekdrzjhfayngtod.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhcXJiZWtkcnpqaGZheW5ndG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDc2OTMsImV4cCI6MjA1MTM4MzY5M30.VckHGYOuHWXJNoqsyPv7dLkJ0jbd08xIGpY02OzHfM8',
);

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'koikai254@gmail.com',
    pass: 'uxrn deno vclh vqus',
  },
});

async function sendWeeklyReminder() {
  const { data, error } = await supabase
    .from('weekly_targets')
    .select('email, name, target_amount, current_week')
    .gt('current_week', 0);

  if (error) {
    return error;
  }

  for (const user of data) {
    const { email, name, target_amount, current_week } = user;
    const newTarget = target_amount * current_week;

    const mailOptions = {
      from: 'koikai254@gmail.com',
      to: email,
      subject: `Your Weekly Savings Challenge - Week ${current_week}`,
      text: `Hi ${name},\n\nThis week’s savings goal is Ksh ${newTarget}. Keep saving!\n\nBest regards,\nThe 52 Weeks Savings Challenge Team`,
    };

    try {
      await transporter.sendMail(mailOptions);

      const { error: updateError } = await supabase
        .from('weekly_targets')
        .update({ current_week: current_week + 1 })
        .eq('email', email);

      if (updateError) {
        return updateError;
      }
    } catch (mailError) {
      return mailError;
    }
  }
}

export async function GET() {
  await sendWeeklyReminder();
  return NextResponse.json({ message: 'Reminders sent successfully.' });
}
