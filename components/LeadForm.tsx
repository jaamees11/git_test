'use client'

import { useState } from 'react'

interface FormData {
  name: string
  phone: string
  email: string
  suburb: string
  owns_home: string
  electricity_bill: string
  roof_type: string
  timeline: string
  interested_in_battery: string
  message: string
}

const EMPTY: FormData = {
  name: '', phone: '', email: '', suburb: '',
  owns_home: '', electricity_bill: '', roof_type: '',
  timeline: '', interested_in_battery: '', message: '',
}

export default function LeadForm() {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const phone = process.env.NEXT_PUBLIC_PHONE || '1800 XXX XXX'

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email is required'
    if (!form.suburb.trim()) e.suburb = 'Suburb is required'
    if (!form.owns_home) e.owns_home = 'Please select an option'
    if (!form.electricity_bill) e.electricity_bill = 'Please select an option'
    if (!form.roof_type) e.roof_type = 'Please select an option'
    if (!form.timeline) e.timeline = 'Please select an option'
    if (!form.interested_in_battery) e.interested_in_battery = 'Please select an option'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) {
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10 px-4">
        <div className="text-6xl mb-4">☀️</div>
        <h3 className="text-2xl font-bold text-[#0F2A4E] mb-3">
          Thanks! We'll be in touch soon.
        </h3>
        <p className="text-gray-500 mb-6">
          One of our local experts will call you shortly to discuss your free quote.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 inline-block">
          <p className="text-sm text-amber-800">
            Questions in the meantime? Call us on{' '}
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="font-bold hover:underline">
              {phone}
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Contact details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Your Contact Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Full Name"
            value={form.name}
            onChange={v => set('name', v)}
            placeholder="John Smith"
            error={errors.name}
          />
          <TextInput
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={v => set('phone', v)}
            placeholder="0400 000 000"
            error={errors.phone}
          />
          <TextInput
            label="Email Address"
            type="email"
            value={form.email}
            onChange={v => set('email', v)}
            placeholder="john@example.com"
            error={errors.email}
          />
          <TextInput
            label="Suburb"
            value={form.suburb}
            onChange={v => set('suburb', v)}
            placeholder="Maitland, Cessnock, Singleton..."
            error={errors.suburb}
          />
        </div>
      </div>

      {/* Qualifying questions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          About Your Home
        </h3>
        <div className="space-y-5">
          <SelectCards
            label="Do you own your home?"
            value={form.owns_home}
            onChange={v => set('owns_home', v)}
            error={errors.owns_home}
            options={[
              { value: 'outright', label: '🏡 Owns outright' },
              { value: 'mortgage', label: '🏦 Have a mortgage' },
              { value: 'renting', label: '🔑 Currently renting' },
              { value: 'other', label: '❓ Other / not sure' },
            ]}
          />
          <SelectCards
            label="Average quarterly electricity bill?"
            value={form.electricity_bill}
            onChange={v => set('electricity_bill', v)}
            error={errors.electricity_bill}
            options={[
              { value: 'over-600', label: '💸 Over $600' },
              { value: '300-600', label: '💰 $300–$600' },
              { value: '150-300', label: '💵 $150–$300' },
              { value: 'under-150', label: '🪙 Under $150' },
            ]}
          />
          <SelectCards
            label="What type of roof do you have?"
            value={form.roof_type}
            onChange={v => set('roof_type', v)}
            error={errors.roof_type}
            options={[
              { value: 'metal', label: '🏗️ Metal / Colorbond' },
              { value: 'tile', label: '🏠 Tile' },
              { value: 'flat', label: '▬ Flat / low pitch' },
              { value: 'unsure', label: '🤷 Not sure' },
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Your Timeline
        </h3>
        <div className="space-y-5">
          <SelectCards
            label="When are you looking to get solar?"
            value={form.timeline}
            onChange={v => set('timeline', v)}
            error={errors.timeline}
            options={[
              { value: 'asap', label: '🚀 As soon as possible' },
              { value: '1-3-months', label: '📅 Within 1–3 months' },
              { value: '3-6-months', label: '🗓️ Within 3–6 months' },
              { value: 'just-researching', label: '🔍 Just researching' },
            ]}
          />
          <SelectCards
            label="Interested in battery storage?"
            value={form.interested_in_battery}
            onChange={v => set('interested_in_battery', v)}
            error={errors.interested_in_battery}
            options={[
              { value: 'yes', label: '🔋 Yes, definitely!' },
              { value: 'maybe', label: '🤔 Maybe, tell me more' },
              { value: 'no', label: '☀️ Just solar panels' },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anything else you'd like us to know? <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          rows={3}
          placeholder="Shading issues, preferred system size, any questions..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Something went wrong. Please try again or call us directly on {phone}.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-amber-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors duration-150 shadow-lg"
      >
        {status === 'submitting' ? 'Sending...' : 'Get My Free Solar Quote →'}
      </button>

      <p className="text-xs text-center text-gray-400">
        No spam. We only contact you about your solar quote. 100% free, no obligation.
      </p>
    </form>
  )
}

function TextInput({
  label, value, onChange, placeholder, error, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; error?: string; type?: string
}) {
  return (
    <div data-error={error ? true : undefined}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function SelectCards({
  label, value, onChange, options, error,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; error?: string
}) {
  return (
    <div data-error={error ? true : undefined}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
              value === opt.value
                ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50/50'
            }`}
          >
            {value === opt.value && <span className="mr-1 text-amber-500">✓</span>}
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
