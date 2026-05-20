import { RestApiHandler } from '@zenstackhq/server/api';
import { NextResponse } from 'next/server';
import { schema } from '~/zenstack/schema';

const restHandler = new RestApiHandler({
  schema,
  endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/model`,
  // modelNameMapping: { User: 'users', Post: 'posts' }, // must match your CRUD route
});

export async function GET() {
  const spec = await restHandler.generateSpec({
    title: 'Rationes-Charitatas Data API',
    version: '1.0.0',
    description: 'Data schema',
    respectAccessPolicies: true, // adds 403 responses for models with access policies
  });
  return NextResponse.json(spec);
}
