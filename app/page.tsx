import LeadForm from '@/components/LeadForm'

const company = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Hunter Valley Solar'
const phone = process.env.NEXT_PUBLIC_PHONE || '1800 XXX XXX'
const telHref = `tel:${phone.replace(/\s/g, '')}`

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F2A4E] text-white py-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☀️</span>
          <span className="font-bold text-lg tracking-tight">{company}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={telHref} className="hidden sm:flex items-center gap-1 text-amber-400 font-semibold text-sm hover:text-amber-300 transition-colors">
            📞 {phone}
          </a>
          <a
            href="#quote-form"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Get Free Quote
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-16 bg-gradient-to-br from-[#0F2A4E] via-[#163760] to-[#0F2A4E] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              ⚡ NSW Solar Rebates Still Available in 2025
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Stop Overpaying<br />for Power.{' '}
              <span className="text-amber-400">Go Solar Today.</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Hunter Valley homeowners are saving an average of{' '}
              <strong className="text-white">$1,800+ per year</strong> after switching to solar.
              Get your free, no-obligation quote in 2 minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#quote-form"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl transition-colors"
              >
                Get My Free Quote →
              </a>
              <a
                href={telHref}
                className="border-2 border-white/30 hover:border-white text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
              >
                📞 Call Now
              </a>
            </div>
          </div>

          {/* Stats grid — desktop only */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { icon: '🏡', value: '500+', label: 'Homes Installed' },
              { icon: '💰', value: '$1,800+', label: 'Avg Annual Savings' },
              { icon: '🛡️', value: '25 Year', label: 'Panel Warranty' },
              { icon: '📍', value: 'Hunter Valley', label: 'Locally Based' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold text-amber-400">{s.value}</div>
                <div className="text-sm text-blue-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="bg-amber-500 py-3 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-white font-semibold text-sm">
          {['✅ Free no-obligation quote', '✅ CEC Accredited Installers', '✅ Quality Tier 1 Panels', '✅ 100% Local Team'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Benefits ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4E] mb-3">
              Why Hunter Valley Families Choose Solar
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Power bills in NSW are only going up. Solar is the investment that pays for itself.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💡',
                title: 'Slash Your Power Bill',
                body: 'Most homeowners cut electricity costs by 60–90%. Generate your own power during the day and watch the meter run backwards.',
              },
              {
                icon: '🏦',
                title: 'NSW Government Rebates',
                body: 'Take advantage of Small-scale Technology Certificates (STCs) — worth thousands in upfront discounts on your system.',
              },
              {
                icon: '📈',
                title: 'Boost Your Home Value',
                body: 'Buyers pay a premium for solar homes. Research shows solar adds up to $29,000 to property values in NSW.',
              },
              {
                icon: '🔋',
                title: 'Add Battery Storage',
                body: 'Store excess energy for the evening, be protected from blackouts, and reduce your grid reliance to near zero.',
              },
              {
                icon: '🌱',
                title: 'Better for the Planet',
                body: 'Reduce your household carbon footprint and make a real difference for the Hunter Valley\'s environment.',
              },
              {
                icon: '🛠️',
                title: 'Expert Local Installers',
                body: "We know the Hunter Valley's roofs, sun angles, and network requirements. No fly-in contractors — we're your neighbours.",
              },
            ].map(b => (
              <div key={b.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-lg font-bold text-[#0F2A4E] mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4E] mb-3">How It Works</h2>
          <p className="text-gray-500 mb-14 text-lg">From quote to installation in 3 simple steps</p>

          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                n: '1',
                title: 'Fill In the Form',
                body: 'Answer a few quick questions about your home and electricity use. Takes about 2 minutes.',
              },
              {
                n: '2',
                title: 'Get Your Custom Quote',
                body: "We design a system for your roof and usage, with projected savings and a clear payback timeline.",
              },
              {
                n: '3',
                title: 'Professional Installation',
                body: 'Our CEC-accredited team installs your system neatly and quickly. We handle all the paperwork.',
              },
            ].map(s => (
              <div key={s.n} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-amber-500 text-white text-xl font-extrabold rounded-full flex items-center justify-center shadow-lg mb-4">
                  {s.n}
                </div>
                <h3 className="text-lg font-bold text-[#0F2A4E] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NSW Rebate banner ── */}
      <section className="py-14 px-6 bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            ⚡ Don't Miss the NSW Solar Rebates
          </h2>
          <p className="text-green-100 mb-6 text-lg">
            The Small-scale Renewable Energy Scheme (SRES) provides significant upfront discounts that
            reduce your system cost. Rebate values decrease each year — act now to maximise your savings.
          </p>
          <a
            href="#quote-form"
            className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors inline-block"
          >
            Claim My Rebate — Get a Free Quote
          </a>
        </div>
      </section>

      {/* ── Lead form ── */}
      <section id="quote-form" className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4E] mb-3">
              Get Your Free Solar Quote
            </h2>
            <p className="text-gray-500 text-lg">
              2 minutes. No obligation. A local expert calls you with a tailored quote.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <LeadForm />
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
            <span>🔒 Your info is safe with us</span>
            <span>📞 We call — we don't spam</span>
            <span>✅ Zero obligation, 100% free</span>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#0F2A4E] text-center mb-12">
            What Hunter Valley Homeowners Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'John & Mary T.',
                suburb: 'Maitland',
                quote: "We were paying $680 a quarter. It's now barely $70. The payback was much faster than expected. Brilliant local team.",
              },
              {
                name: 'David K.',
                suburb: 'Cessnock',
                quote: "Explained everything clearly, no pushy sales tactics. Installation was done in a single day. Couldn't be happier.",
              },
              {
                name: 'Sarah M.',
                suburb: 'Singleton',
                quote: "We added a battery too and now we're virtually off the grid at night. Best investment we've ever made in this house.",
              },
            ].map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-amber-400 text-lg mb-3">★★★★★</div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">📍 {t.suburb}, NSW</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 px-6 bg-[#0F2A4E] text-white text-center">
        <h2 className="text-3xl font-extrabold mb-3">Ready to Start Saving?</h2>
        <p className="text-blue-200 mb-8 max-w-xl mx-auto">
          Get a free, no-obligation solar quote tailored to your Hunter Valley home.
          Speak to a local expert today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#quote-form"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            Get My Free Quote →
          </a>
          <a
            href={telHref}
            className="border-2 border-white/30 hover:border-white text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            📞 {phone}
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
        <p className="mb-1 text-white font-semibold">{company} — Hunter Valley, NSW</p>
        <p className="text-gray-500 text-xs">CEC Accredited · Licensed Electricians · Quality Tier 1 Panels</p>
        <p className="mt-4 text-xs text-gray-600">
          © {new Date().getFullYear()} {company}. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
