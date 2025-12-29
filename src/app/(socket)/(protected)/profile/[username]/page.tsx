import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../../app/actions/user";
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

  // Récupérer l'utilisateur connecté
  const currentUser = await getCurrentUser();

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

  // Vérifier si c'est le profil de l'utilisateur connecté
  const isOwnProfile = currentUser ? (
    (currentUser.username && currentUser.username === username) ||
    (currentUser.name && currentUser.name === username) ||
    (userStats.user && currentUser.id === userStats.user.id)
  ) : false;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <ProfileContent
        userStats={userStats}
        isOwnProfile={isOwnProfile}
        profileUser={isOwnProfile && currentUser ? {
          username: currentUser.username || currentUser.name || '',
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email || '',
        } : undefined}
      />
    </div>
  );
}

