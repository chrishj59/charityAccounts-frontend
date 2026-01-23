import SignInSignUp from '~/src/components/client/auth/signinSignup';

export default function Page() {
  return (
    <>
      <div className='w-screen'>
        <div className='flex place-content-center'>
          <SignInSignUp />
        </div>
      </div>
    </>
  );
}
