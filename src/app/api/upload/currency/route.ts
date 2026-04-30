import { NextResponse } from 'next/server';
// import Papa from 'papaparse';

type CsvRow = Record<string, string>;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const text = await file.text();

  // const result = Papa.parse<CsvRow>(text, {
  //   header: true,
  //   skipEmptyLines: true,
  // });

  return NextResponse.json({
    data: text, //result.data,
  });
}
