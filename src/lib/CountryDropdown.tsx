'use client';

import { useEffect, useState } from 'react';
import { countryList } from './countryList';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CountryDropdown({ value, onChange }: Props) {
  const [selected, setSelected] = useState(value || '+1');

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  return (
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="p-2 border rounded w-full"
    >
      {countryList.map((country, index) => (
        <option
          key={`${country.code}-${index}`}
          value={country.dial_code}
        >
          {country.name} ({country.dial_code})
        </option>
      ))}
    </select>
  );
}
