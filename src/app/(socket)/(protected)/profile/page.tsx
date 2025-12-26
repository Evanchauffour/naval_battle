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
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center py-10">
          <p className="text-muted-foreground">Chargement des statistiques...</p>
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
