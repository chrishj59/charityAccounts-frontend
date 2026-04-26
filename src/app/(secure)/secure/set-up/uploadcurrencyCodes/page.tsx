'use client';

import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
export default function UploadPage() {
  const uploadCurrencyHandler = async (event: FileUploadHandlerEvent) => {
    const file = event.files[0];

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/currency', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      Currency Uplpoad
      <FileUpload
        name='csv'
        accept='.csv'
        customUpload
        uploadHandler={uploadCurrencyHandler}
        auto
        chooseLabel='Upload Currency CSV'
      />
    </div>
  );
}
