import AppTopbar from '@/layout/AppTopbar';
import Layout from '@/layout/layout';
import { Toolbar } from 'primereact/toolbar';
interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  const startContent = <div></div>;

  const endContent = <div></div>;

  const centerContent = (
    <div className='flex flex-wrap align-items-center gap-3'>
      <span className=' font-bold text-primary-600 text-2xl'>
        Rationes Charitatis - authentication{' '}
      </span>
    </div>
  );

  return (
    <>
      <div className='flex justify-content-center  '>
        <Toolbar
          center={centerContent}
          className='bg-green-200 shadow-2'
          style={{
            borderRadius: '3rem',
            backgroundImage:
              'linear-gradient(to right, var(--teal-50), var(--teal-200))',
          }}
        />
      </div>
      <Layout>{children}</Layout>)
    </>
  );
}
