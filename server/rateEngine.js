// Rate calculation engine for SR Freight Logistics
// Based on international IATA / IMO freight standards & Hyderabad trade lanes

export function calculateFreightRate({
  mode = 'air',
  origin = 'Hyderabad (RGIA)',
  destination = 'Dubai (DXB)',
  weight = 10,
  length = 0,
  width = 0,
  height = 0,
  cargoType = 'general',
  containerType = '20ft',
}) {
  const actualWeightKg = Math.max(0.5, parseFloat(weight) || 1)
  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const h = parseFloat(height) || 0

  let volumetricWeightKg = 0
  let volumeCbm = 0

  if (l > 0 && w > 0 && h > 0) {
    volumeCbm = (l * w * h) / 1000000
    if (mode === 'courier') {
      volumetricWeightKg = (l * w * h) / 5000
    } else if (mode === 'air') {
      volumetricWeightKg = (l * w * h) / 6000
    } else {
      volumetricWeightKg = volumeCbm * 1000 // 1 CBM = 1000 kg standard maritime rule
    }
  }

  const chargeableWeightKg = Math.max(actualWeightKg, volumetricWeightKg)

  // Lane base rate multipliers (per kg or per CBM / container)
  const destLower = String(destination).toLowerCase()
  let laneZone = 'middle-east'
  let estimatedDays = '2 - 3 Days'

  if (destLower.includes('dubai') || destLower.includes('dxb') || destLower.includes('gulf') || destLower.includes('saudi') || destLower.includes('doha') || destLower.includes('uae')) {
    laneZone = 'middle-east'
    estimatedDays = mode === 'air' ? '1 - 2 Days' : mode === 'courier' ? '2 - 3 Days' : '10 - 14 Days'
  } else if (destLower.includes('australia') || destLower.includes('melbourne') || destLower.includes('sydney') || destLower.includes('perth') || destLower.includes('brisbane')) {
    laneZone = 'australia'
    estimatedDays = mode === 'air' ? '3 - 5 Days' : mode === 'courier' ? '3 - 4 Days' : '18 - 24 Days'
  } else if (destLower.includes('usa') || destLower.includes('america') || destLower.includes('chicago') || destLower.includes('new york') || destLower.includes('california') || destLower.includes('canada')) {
    laneZone = 'usa'
    estimatedDays = mode === 'air' ? '3 - 5 Days' : mode === 'courier' ? '4 - 5 Days' : '28 - 35 Days'
  } else if (destLower.includes('uk') || destLower.includes('london') || destLower.includes('germany') || destLower.includes('frankfurt') || destLower.includes('europe') || destLower.includes('rotterdam')) {
    laneZone = 'europe'
    estimatedDays = mode === 'air' ? '2 - 4 Days' : mode === 'courier' ? '3 - 4 Days' : '20 - 26 Days'
  } else if (destLower.includes('singapore') || destLower.includes('malaysia') || destLower.includes('china') || destLower.includes('asia') || destLower.includes('japan')) {
    laneZone = 'asia'
    estimatedDays = mode === 'air' ? '2 - 3 Days' : mode === 'courier' ? '2 - 4 Days' : '12 - 16 Days'
  } else {
    laneZone = 'worldwide'
    estimatedDays = mode === 'air' ? '3 - 6 Days' : mode === 'courier' ? '4 - 6 Days' : '22 - 30 Days'
  }

  // Base rates in INR
  let baseRatePerUnit = 0
  let isContainerRate = false

  if (mode === 'courier') {
    const courierRates = {
      'middle-east': 620,
      'australia': 840,
      'usa': 920,
      'europe': 780,
      'asia': 560,
      'worldwide': 890,
    }
    baseRatePerUnit = courierRates[laneZone] || 800
    // Discount for heavier courier shipments (>10kg)
    if (chargeableWeightKg > 20) baseRatePerUnit *= 0.85
    else if (chargeableWeightKg > 10) baseRatePerUnit *= 0.92
  } else if (mode === 'air') {
    const airRates = {
      'middle-east': 140,
      'australia': 340,
      'usa': 380,
      'europe': 290,
      'asia': 180,
      'worldwide': 360,
    }
    baseRatePerUnit = airRates[laneZone] || 320
    if (chargeableWeightKg > 500) baseRatePerUnit *= 0.82
    else if (chargeableWeightKg > 100) baseRatePerUnit *= 0.9
  } else if (mode === 'ocean_lcl') {
    const oceanLclRates = {
      'middle-east': 3200,
      'australia': 6500,
      'usa': 7800,
      'europe': 5400,
      'asia': 3100,
      'worldwide': 6200,
    }
    baseRatePerUnit = oceanLclRates[laneZone] || 5000 // per CBM
  } else if (mode === 'ocean_fcl') {
    isContainerRate = true
    const oceanFcl20Rates = {
      'middle-east': 95000,
      'australia': 165000,
      'usa': 210000,
      'europe': 155000,
      'asia': 85000,
      'worldwide': 180000,
    }
    const fclMultiplier = containerType === '40ft' ? 1.65 : containerType === 'reefer' ? 2.1 : 1.0
    baseRatePerUnit = (oceanFcl20Rates[laneZone] || 160000) * fclMultiplier
  }

  // Calculate base cost
  let freightCost = 0
  if (isContainerRate) {
    freightCost = baseRatePerUnit
  } else if (mode === 'ocean_lcl') {
    const billedCbm = Math.max(1, volumeCbm || (chargeableWeightKg / 1000))
    freightCost = billedCbm * baseRatePerUnit
  } else {
    freightCost = chargeableWeightKg * baseRatePerUnit
  }

  // Commodity surcharge factor
  let commodityMultiplier = 1.0
  let commodityNotes = 'Standard general merchandise handling'

  if (cargoType === 'pharma') {
    commodityMultiplier = 1.25
    commodityNotes = 'Temperature-controlled cold-chain validation & Pharma air terminal priority'
  } else if (cargoType === 'dgr') {
    commodityMultiplier = 1.4
    commodityNotes = 'IATA Dangerous Goods inspection, hazard labeling, and DG declaration'
  } else if (cargoType === 'perishable') {
    commodityMultiplier = 1.2
    commodityNotes = 'Expedited handling & dry-ice / cool-gel replenishment'
  } else if (cargoType === 'machinery') {
    commodityMultiplier = 1.15
    commodityNotes = 'Heavy-lift crane / forklift handling & industrial wooden crating inspection'
  } else if (cargoType === 'documents') {
    commodityMultiplier = 0.9
    commodityNotes = 'High-security tamper-proof document pouch & signature verification'
  }

  freightCost *= commodityMultiplier

  // Additional ancillary estimates (Customs documentation + Terminal handling)
  const customsDocFee = mode === 'courier' ? 450 : mode === 'air' ? 2500 : 4500
  const terminalHandling = mode === 'courier' ? 300 : mode === 'air' ? Math.round(chargeableWeightKg * 4.5) : 3500
  const fuelSurcharge = Math.round(freightCost * 0.08) // ~8% fuel surcharge

  const totalEstimateInr = Math.round(freightCost + customsDocFee + terminalHandling + fuelSurcharge)
  const totalEstimateUsd = Math.round(totalEstimateInr / 86) // Approximate USD conversion

  return {
    mode,
    origin,
    destination,
    laneZone,
    actualWeightKg,
    volumetricWeightKg: Math.round(volumetricWeightKg * 10) / 10,
    chargeableWeightKg: Math.round(chargeableWeightKg * 10) / 10,
    volumeCbm: Math.round(volumeCbm * 100) / 100,
    estimatedDays,
    breakdown: {
      freightCharges: Math.round(freightCost),
      fuelSurcharge,
      customsDocumentation: customsDocFee,
      terminalHandling,
      commodityNotes,
    },
    totalEstimateInr,
    totalEstimateUsd,
    disclaimer: 'Estimates are indicative based on standard tariff and subject to actual dimensions, customs duty, and carrier spot schedule confirmation.',
  }
}
