import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileContent from "../../../../../components/profile/ProfileContent";

export default async function UserProfilePage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params;
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect('/signin');
  }

  let userStats = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user-stats/${username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      userStats = await response.json();
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);
  }

  if (!userStats) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center py-10">
          <p className="text-muted-foreground">Utilisateur non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <ProfileContent userStats={userStats} />
    </div>
  );
}

