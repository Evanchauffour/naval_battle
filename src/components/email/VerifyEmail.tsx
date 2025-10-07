interface VerifyEmailProps {
  firstName: string;
  url: string;
}

export function VerifyEmail({ firstName, url }: VerifyEmailProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <p>Please click the link below to verify your email:</p>
      <a href={url}>Verify email</a>
    </div>
  );
}
