'use client';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import Papa from 'papaparse';
import { useRef, useState } from 'react';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { countryCSVRowIF } from '~/src/interface/country3166.interface';
import { ISO3166Country } from '~/zenstack/models';
import { ISO3166CountryUI } from '~/src/types/ui-types/country';
import { Toast, ToastMessage } from 'primereact/toast';
interface LoadCounutriesProps {
  orgId: string;
  userId: string;
}

export default function LoadCountriesUI({
  orgId,
  userId,
}: LoadCounutriesProps) {
  const client = useClientQueries(schema);
  const createCountries = client.iSO3166Country.useCreateManyAndReturn({
    optimisticUpdate: true,
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast | null>(null);
  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };

  const handleUpload = async (event: FileUploadHandlerEvent) => {
    const file = event.files?.[0];

    if (!file) return;
    console.log(`file is ${JSON.stringify(file, null, 2)}`);
    setLoading(true);
    Papa.parse<countryCSVRowIF>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: async (results) => {
        try {
          const rows = results.data;
          // console.log(`rows ${JSON.stringify(rows, null, 2)}`);

          // Basic validation example
          const cleaned: ISO3166CountryUI[] = rows.map((row) => {
            console.log(`row ${JSON.stringify(row, null, 2)}`);
            return {
              name: row.name.trim(),
              alpha2: row.alpha2.trim(),
              alpha3: row.alpha3.trim(),
              countryCode: row.countryCode.trim(),
              iso3166: row.iso3166.trim(),
              region: row.region.trim(),
              subRegion: row.subRegion.trim(),
              intermediateRegion: row.intermediateRegion.trim(),
              intermediateRegionCode: row.intermediateRegionCode.trim(),
              userId: userId,
            };
          });
          console.log(`records read ${cleaned.length}`);
          const created = await createCountries.mutateAsync({
            data: cleaned,
            skipDuplicates: true,
          });
          showToast(
            'error',
            'No Fiscal rule selected',
            'Fiscal Rule not found. Please check your entry',
            false,
          );
          console.log(`created ${JSON.stringify(created, null, 2)}`);
        } catch (err) {
          console.error(
            `error parsing FileUpload ${JSON.stringify(err, null, 2)}`,
          );
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
      <Toast ref={toast} position='top-right' />
      <FileUpload
        name='csv'
        accept='.csv'
        customUpload
        uploadHandler={handleUpload}
        auto
        maxFileSize={10000000}
        chooseLabel='Upload Currencies'
      />

      {/* {loading && <p>Processing...</p>} */}
    </div>
  );
}
