export const timeOptions = ['AM', 'PM'].flatMap(amPm =>
  Array.from({ length: 12 }, (_, i) => (!i ? 12 : i)).flatMap(hour =>
    ['00', '30'].map(minute => ({
      value: `${`${(hour % 12) + (amPm === 'AM' ? 0 : 12)}`.padStart(2, '0')}${minute}`,
      label: `${hour}:${minute} ${amPm}`,
    }))
  )
);

export const currencyList = [
  {
    id: 'USD',
    name: 'United States Dollar',
    symbol: '$',
  },
  {
    id: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
  },
  {
    id: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
  },
  {
    id: 'GBP',
    name: 'Pound Sterling',
    symbol: '£',
  },
  {
    id: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
  },
];
