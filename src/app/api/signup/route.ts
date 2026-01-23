import { NextRequest, NextResponse } from 'next/server';
import { signupPost } from '~/src/types/signup';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as signupPost;

  console.log(`signup post body ${JSON.stringify(body)}`);

  return NextResponse.json(body);
}
