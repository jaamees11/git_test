export interface LeadData {
  owns_home: string
  electricity_bill: string
  timeline: string
  interested_in_battery: string
}

export function scoreLead(data: LeadData): { score: number; grade: 'Hot' | 'Warm' | 'Cold' } {
  let score = 0

  // Home ownership — renters can't install, so zero points
  if (data.owns_home === 'outright' || data.owns_home === 'mortgage') score += 30

  // Quarterly electricity bill — bigger bill = bigger motivation
  if (data.electricity_bill === 'over-600') score += 30
  else if (data.electricity_bill === '300-600') score += 20
  else if (data.electricity_bill === '150-300') score += 10
  else score += 5

  // Timeline — readiness to buy
  if (data.timeline === 'asap') score += 30
  else if (data.timeline === '1-3-months') score += 20
  else if (data.timeline === '3-6-months') score += 10
  else score += 5

  // Battery interest — upsell signal
  if (data.interested_in_battery === 'yes') score += 10
  else if (data.interested_in_battery === 'maybe') score += 5

  const grade = score >= 70 ? 'Hot' : score >= 45 ? 'Warm' : 'Cold'
  return { score, grade }
}

export const LABELS = {
  owns_home: {
    outright: 'Owns outright',
    mortgage: 'Has a mortgage',
    renting: 'Renting',
    other: 'Other / not sure',
  },
  electricity_bill: {
    'over-600': 'Over $600 / quarter',
    '300-600': '$300–$600 / quarter',
    '150-300': '$150–$300 / quarter',
    'under-150': 'Under $150 / quarter',
  },
  roof_type: {
    metal: 'Metal / Colorbond',
    tile: 'Tile (terracotta or concrete)',
    flat: 'Flat / low pitch',
    other: 'Other',
    unsure: 'Not sure',
  },
  timeline: {
    asap: 'ASAP — ready to go!',
    '1-3-months': 'Within 1–3 months',
    '3-6-months': 'Within 3–6 months',
    'just-researching': 'Just researching',
  },
  interested_in_battery: {
    yes: 'Yes, definitely',
    maybe: 'Maybe, tell me more',
    no: 'No, just panels',
  },
}
