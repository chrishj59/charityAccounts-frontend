'use client';

import { String } from 'aws-sdk/clients/apigateway';
import { Props } from 'recharts/types/component/Text';

type props = {
  orgId: string;
};
export default function CompanyCreatePage({ orgId }: props) {
  return <div>Client create company page called with org id {orgId}</div>;
}
