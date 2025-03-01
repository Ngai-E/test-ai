export interface CountryCode {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  {
    name: 'United States',
    code: 'US',
    dialCode: '+1',
    flag: '🇺🇸'
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    flag: '🇬🇧'
  },
  {
    name: 'Canada',
    code: 'CA',
    dialCode: '+1',
    flag: '🇨🇦'
  },
  {
    name: 'Australia',
    code: 'AU',
    dialCode: '+61',
    flag: '🇦🇺'
  },
  {
    name: 'Nigeria',
    code: 'NG',
    dialCode: '+234',
    flag: '🇳🇬'
  },
  {
    name: 'Ghana',
    code: 'GH',
    dialCode: '+233',
    flag: '🇬🇭'
  },
  {
    name: 'South Africa',
    code: 'ZA',
    dialCode: '+27',
    flag: '🇿🇦'
  },
  {
    name: 'Kenya',
    code: 'KE',
    dialCode: '+254',
    flag: '🇰🇪'
  },
  {
    name: 'India',
    code: 'IN',
    dialCode: '+91',
    flag: '🇮🇳'
  },
  {
    name: 'China',
    code: 'CN',
    dialCode: '+86',
    flag: '🇨🇳'
  },
  {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
    flag: '🇫🇷'
  },
  {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
    flag: '🇩🇪'
  },
  {
    name: 'Brazil',
    code: 'BR',
    dialCode: '+55',
    flag: '🇧🇷'
  },
  {
    name: 'Mexico',
    code: 'MX',
    dialCode: '+52',
    flag: '🇲🇽'
  },
  {
    name: 'Japan',
    code: 'JP',
    dialCode: '+81',
    flag: '🇯🇵'
  }
];
