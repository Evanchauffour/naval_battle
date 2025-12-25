import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../app/actions/user";
import { getUserStats } from "../../../../app/actions/user-stats";
import ProfileContent from "../../../../components/profile/ProfileContent";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const userStats = await getUserStats();

  if (!user) {
    redirect('/signin');
  }

  if (!userStats) {
    return (
      <div className="w-full max-w-6xl mx-auto py-10">
        <div className="text-gray-900 text-center">
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      <ProfileContent userStats={userStats} />
    </div>
  );
}
