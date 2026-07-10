'use client';

import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import Papa from 'papaparse';
import { useState } from 'react';
import {
  currency4217RowIF,
  currencyCSVRowIF,
} from '~/src/interface/currency4217.interface';

export default function CurrencyUpload() {
  const [loading, setLoading] = useState(false);

  const handleUpload = (event: FileUploadHandlerEvent) => {
    const file = event.files?.[0];

    if (!file) return;

    setLoading(true);

    Papa.parse<currencyCSVRowIF>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: async (results) => {
        try {
          const rows = results.data;

          // Basic validation example
          const cleaned = rows.map((row) => {
            return {
              entity: row.Entity?.trim(),
              currency: row.Currency?.trim(),
              alphabeticCode: row.AlphabeticCode?.trim(),
              numericCode: Number(row.NumericCode)
                ? Number(row.NumericCode)
                : 0,
              minorUnit: row.MinorUnit?.trim(),
              withdrawalDate: row.WithdrawalDate?.trim(),
            };
          });

          // Send to API

          const res = await fetch('/api/upload/currency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleaned),
          });
          if (!res.ok) throw new Error('Upload failed');
          console.log('Saved successfully');
        } catch (err) {
          console.error('error parsing FileUpload');
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error('Parse error:', err);
        setLoading(false);
      },
    });
  };

  return (
    <div>
      <FileUpload
        name='csv'
        accept='.csv'
        customUpload
        uploadHandler={handleUpload}
        auto
        maxFileSize={10000000}
        chooseLabel='Upload Currencies'
      />

      {loading && <p>Processing...</p>}
    </div>
  );
}
