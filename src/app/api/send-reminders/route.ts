/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
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
      from: process.env.EMAIL_USER!,
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
