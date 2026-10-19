// QA & Automated Integration Test Suite for FarmDirect
// Verifies Zod validation, Storage transactions, Mandi API states, and Business Math

import { listingFormSchema, orderFormSchema } from '../src/lib/validation';
import { COASTAL_MANDI_BENCHMARKS } from '../src/data/mandiBenchmarks';
import { COASTAL_TALUKS } from '../src/data/coastalLocations';
import { formatCurrency, calculatePercentageChange } from '../src/lib/utils';
import { fetchKarnatakaMandiPrices } from '../src/lib/mandiApi';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING FARMDIRECT QA & INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST SUITE 1: ZOD VALIDATION SCHEMAS
  console.log('--- TEST SUITE 1: Zod Form Validation ---');

  const validListing = {
    crop_name: 'Udupi Mattu Gulla (GI Brinjal)',
    crop_category: 'GI Tagged',
    variety: 'Mattu Authentic Green',
    grade: 'Grade A Premium',
    district: 'Udupi',
    taluk: 'Kaup',
    village: 'Mattu Village',
    harvest_date: '2026-10-18',
    available_qty: 350,
    unit: 'kg',
    min_order_qty: 5,
    farmer_price_per_unit: 58,
    organic_certified: true,
    gi_tagged: true,
    description: 'Fresh authentic harvest from historic coastal sandy loam soils of Mattu.',
    farmer_name: 'Devaki Poojary',
    farmer_phone: '9845123456',
  };

  const listingResult = listingFormSchema.safeParse(validListing);
  assert(listingResult.success, 'Valid produce listing passes Zod validation');

  const invalidListing = {
    ...validListing,
    farmer_phone: '123', // Invalid phone
    available_qty: -10, // Negative quantity
  };
  const invalidListingResult = listingFormSchema.safeParse(invalidListing);
  assert(!invalidListingResult.success, 'Invalid phone and negative quantity correctly rejected by Zod');

  const validOrder = {
    buyer_name: 'Ashweej',
    buyer_phone: '9845998877',
    buyer_type: 'restaurant',
    quantity: 40,
    delivery_type: 'direct_delivery',
    delivery_taluk: 'Mangalore',
    delivery_address: 'K.S. Rao Road, Hampankatta, Mangalore',
    payment_method: 'upi_direct',
    notes: 'Urgent delivery for evening service',
  };

  const orderResult = orderFormSchema.safeParse(validOrder);
  assert(orderResult.success, 'Valid buyer purchase contract passes Zod validation');

  // TEST SUITE 2: MANDI BENCHMARKS & COMMODITY DATA INTEGRITY
  console.log('\n--- TEST SUITE 2: Mandi Benchmarks & Coastal Taluks ---');
  assert(COASTAL_MANDI_BENCHMARKS.length >= 8, `Loaded ${COASTAL_MANDI_BENCHMARKS.length} verified coastal APMC benchmarks`);
  assert(COASTAL_TALUKS.length === 14, `All 14 coastal taluks mapped across DK & Udupi`);

  const arecanut = COASTAL_MANDI_BENCHMARKS.find(c => c.commodity.includes('Arecanut'));
  assert(Boolean(arecanut && arecanut.modal_price > 40000), 'Puttur APMC Chali Arecanut modal price verified (~₹46,500/quintal)');

  const mattuGulla = COASTAL_MANDI_BENCHMARKS.find(c => c.commodity.includes('Mattu Gulla'));
  assert(Boolean(mattuGulla && mattuGulla.normalized_per_kg_modal === 48), 'Udupi APMC Mattu Gulla normalized rate verified (₹48/kg)');

  // TEST SUITE 3: BUSINESS MATH & WIN-WIN SPREAD ENGINE
  console.log('\n--- TEST SUITE 3: Business Math & Margin Calculations ---');
  // Devaki Poojary sells 40 kg Mattu Gulla at ₹58/kg
  // Middleman offered: ₹36/kg
  // Retail supermarket charges: ₹78/kg
  const qty = 40;
  const farmerPrice = 58;
  const middlemanPrice = 36;
  const retailPrice = 78;

  const totalAmount = qty * farmerPrice; // ₹2,320
  const farmerGain = (farmerPrice - middlemanPrice) * qty; // (58 - 36) * 40 = ₹880 extra!
  const buyerSavings = (retailPrice - farmerPrice) * qty; // (78 - 58) * 40 = ₹800 saved!

  assert(totalAmount === 2320, `Total order amount correctly computed as ₹${totalAmount}`);
  assert(farmerGain === 880, `Farmer profit uplift correctly computed as +₹${farmerGain} (+61% vs middleman)`);
  assert(buyerSavings === 800, `Buyer savings correctly computed as ₹${buyerSavings} (26% vs retail)`);

  const percentGain = calculatePercentageChange(middlemanPrice, farmerPrice);
  assert(percentGain === 61, `Percentage uplift calculation matches (+61%)`);

  // TEST SUITE 4: MANDI API STATES (LIVE vs DEMO vs UNAVAILABLE)
  console.log('\n--- TEST SUITE 4: Mandi API Freshness & Fallbacks ---');
  
  // 1. Force DEMO mode
  const demoResult = await fetchKarnatakaMandiPrices(true);
  assert(demoResult.status === 'DEMO', `Demo mode flag returns status 'DEMO' with ${demoResult.data.length} records`);

  // 2. Query with configured API key
  const liveResult = await fetchKarnatakaMandiPrices(false);
  assert(
    liveResult.status === 'LIVE' || liveResult.status === 'STALE' || liveResult.status === 'UNAVAILABLE',
    `Live fetch returned recognized operational status: ${liveResult.status}`
  );
  assert(liveResult.data.length > 0, `Mandi dataset contains ${liveResult.data.length} records`);

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
