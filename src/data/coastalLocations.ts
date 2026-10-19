export interface TalukInfo {
  name: string;
  district: 'Dakshina Kannada' | 'Udupi';
  kannadaName: string;
  majorCrops: string[];
  apmcMandi: string;
}

export const COASTAL_TALUKS: TalukInfo[] = [
  {
    name: 'Mangalore',
    district: 'Dakshina Kannada',
    kannadaName: 'ಮಂಗಳೂರು',
    majorCrops: ['Coconut', 'Vegetables', 'Cashew', 'Jasmine'],
    apmcMandi: 'Mangalore APMC (Baikampady)',
  },
  {
    name: 'Bantwal',
    district: 'Dakshina Kannada',
    kannadaName: 'ಬಂಟ್ವಾಳ',
    majorCrops: ['Arecanut (Adike)', 'Black Pepper', 'Banana', 'Coconut'],
    apmcMandi: 'Bantwal Sub-Market / Mangalore APMC',
  },
  {
    name: 'Puttur',
    district: 'Dakshina Kannada',
    kannadaName: 'ಪುತ್ತೂರು',
    majorCrops: ['Arecanut (Chali)', 'Black Pepper', 'Cocoa', 'Cashew'],
    apmcMandi: 'Puttur APMC / CAMPCO Terminal',
  },
  {
    name: 'Belthangady',
    district: 'Dakshina Kannada',
    kannadaName: 'ಬೆಳ್ತಂಗಡಿ',
    majorCrops: ['Rubber', 'Arecanut', 'Paddy (Boiled Rice)', 'Spices'],
    apmcMandi: 'Belthangady APMC',
  },
  {
    name: 'Sullia',
    district: 'Dakshina Kannada',
    kannadaName: 'ಸುಳ್ಯ',
    majorCrops: ['Arecanut', 'Rubber', 'Black Pepper', 'Honey'],
    apmcMandi: 'Sullia APMC',
  },
  {
    name: 'Moodbidri',
    district: 'Dakshina Kannada',
    kannadaName: 'ಮೂಡುಬಿದಿರೆ',
    majorCrops: ['Pineapple', 'Cashew', 'Coconut', 'Vegetables'],
    apmcMandi: 'Moodbidri Sub-Market',
  },
  {
    name: 'Kadaba',
    district: 'Dakshina Kannada',
    kannadaName: 'ಕಡಬ',
    majorCrops: ['Rubber', 'Arecanut', 'Cocoa', 'Pepper'],
    apmcMandi: 'Puttur APMC',
  },
  {
    name: 'Udupi',
    district: 'Udupi',
    kannadaName: 'ಉಡುಪಿ',
    majorCrops: ['Mattu Gulla (Brinjal)', 'Coconut', 'Paddy', 'Vegetables'],
    apmcMandi: 'Udupi APMC (Adi Udupi)',
  },
  {
    name: 'Kundapura',
    district: 'Udupi',
    kannadaName: 'ಕುಂದಾಪುರ',
    majorCrops: ['Red Rice (Matta)', 'Cashew', 'Coconut', 'Bende'],
    apmcMandi: 'Kundapura APMC',
  },
  {
    name: 'Karkala',
    district: 'Udupi',
    kannadaName: 'ಕಾರ್ಕಳ',
    majorCrops: ['Arecanut', 'Cashew', 'Pepper', 'Ginger'],
    apmcMandi: 'Karkala APMC',
  },
  {
    name: 'Kaup',
    district: 'Udupi',
    kannadaName: 'ಕಾಪು',
    majorCrops: ['Mattu Gulla (GI)', 'Shankarpura Jasmine (GI)', 'Coconut'],
    apmcMandi: 'Udupi APMC',
  },
  {
    name: 'Brahmavara',
    district: 'Udupi',
    kannadaName: 'ಬ್ರಹ್ಮಾವರ',
    majorCrops: ['Paddy', 'Sugarcane', 'Sweet Potato', 'Vegetables'],
    apmcMandi: 'Brahmavara Sub-Market',
  },
  {
    name: 'Byndoor',
    district: 'Udupi',
    kannadaName: 'ಬೈಂದೂರು',
    majorCrops: ['Cashew', 'Coconut', 'Arecanut', 'Groundnut'],
    apmcMandi: 'Kundapura APMC',
  },
  {
    name: 'Hebri',
    district: 'Udupi',
    kannadaName: 'ಹೆಬ್ರಿ',
    majorCrops: ['Black Pepper', 'Arecanut', 'Wild Forest Honey', 'Cardamom'],
    apmcMandi: 'Karkala APMC',
  },
];
