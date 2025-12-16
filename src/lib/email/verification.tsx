import * as React from 'react';
import { Html } from '@react-email/components';
import { Text } from '@react-email/components';
import { Heading } from '@react-email/components';
import { Link } from '@react-email/components';

export function VerificationEmail({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  return (
    <Html>
      <Heading>Hello, {name} Please verify your email 👋</Heading>

      <Link href={url}>Click here to verify your email</Link>
      <Text>If you did not sign-up - please ignore this email</Text>
    </Html>
  );
}

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Heading>Hello, {name} 👋</Heading>
      <Text>Welcome to our platform. Glad to have you!</Text>
    </Html>
  );
}
