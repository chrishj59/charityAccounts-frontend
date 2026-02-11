'use client';

interface props {
  userId: string;
}
export default function CreateFund({ userId }: props) {
  return <div>Called create fund client page with userId {userId}</div>;
}
