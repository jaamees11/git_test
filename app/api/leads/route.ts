import { NextRequest, NextResponse } from 'next/server'
import { scoreLead, LABELS } from '@/lib/score'
import getDb from '@/lib/db'
import nodemailer from 'nodemailer'

async function sendEmailAlert(lead: Record<string, unknown>) {
  if (!process.env.SMTP_HOST || !process.env.ALERT_EMAIL) return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const grade = lead.grade as string
  const score = lead.score as number
  const gradeEmoji = grade === 'Hot' ? '🔥' : grade === 'Warm' ? '☀️' : '❄️'
  const callAdvice =
    grade === 'Hot'
      ? 'HOT lead — call within the hour for best conversion!'
      : grade === 'Warm'
      ? 'WARM lead — aim to call within 24 hours.'
      : 'COLD lead — follow up by email or call when convenient.'

  const bill = LABELS.electricity_bill[lead.electricity_bill as keyof typeof LABELS.electricity_bill] || (lead.electricity_bill as string)
  const subject = `${gradeEmoji} ${grade} Lead (${score}/100): ${lead.name} — ${bill}`

  const text = `
NEW SOLAR LEAD — ${grade.toUpperCase()} (Score: ${score}/100)

Name:    ${lead.name}
Phone:   ${lead.phone}
Email:   ${lead.email}
Suburb:  ${lead.suburb}

─── Their Situation ─────────────────────────────────────
Home ownership:  ${LABELS.owns_home[lead.owns_home as keyof typeof LABELS.owns_home] || lead.owns_home}
Quarterly bill:  ${bill}
Roof type:       ${LABELS.roof_type[lead.roof_type as keyof typeof LABELS.roof_type] || lead.roof_type}
Timeline:        ${LABELS.timeline[lead.timeline as keyof typeof LABELS.timeline] || lead.timeline}
Battery:         ${LABELS.interested_in_battery[lead.interested_in_battery as keyof typeof LABELS.interested_in_battery] || lead.interested_in_battery}
${lead.message ? `\nMessage:\n"${lead.message}"\n` : ''}
─── Next Step ───────────────────────────────────────────
${callAdvice}

Submitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}
  `.trim()

  await transporter.sendMail({
    from: `"Solar Leads" <${process.env.SMTP_USER}>`,
    to: process.env.ALERT_EMAIL,
    subject,
    text,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const required = [
      'name', 'phone', 'email', 'suburb',
      'owns_home', 'electricity_bill', 'roof_type',
      'timeline', 'interested_in_battery',
    ]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const { score, grade } = scoreLead(body)

    const db = getDb()
    const result = db.prepare(`
      INSERT INTO leads
        (name, phone, email, suburb, owns_home, electricity_bill, roof_type, timeline, interested_in_battery, message, score, grade)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      body.name.trim(),
      body.phone.trim(),
      body.email.trim().toLowerCase(),
      body.suburb.trim(),
      body.owns_home,
      body.electricity_bill,
      body.roof_type,
      body.timeline,
      body.interested_in_battery,
      (body.message || '').trim(),
      score,
      grade,
    )

    // Fire-and-forget — don't block the response on email delivery
    sendEmailAlert({ ...body, score, grade, id: result.lastInsertRowid }).catch(console.error)

    return NextResponse.json({ success: true, score, grade })
  } catch (err) {
    console.error('Lead submission error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all()
  return NextResponse.json(leads)
}
