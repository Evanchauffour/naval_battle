import VerifyEmail from "../../../components/auth/VerifyEmail";

export default async function Page({
  searchParams,
}: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return <VerifyEmail token={token ?? null} />;
}
