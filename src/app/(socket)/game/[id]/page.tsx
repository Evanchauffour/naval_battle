import Game from "../../../../components/game/Game";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="w-full h-screen flex justify-center items-center bg-background overflow-hidden">
      <Game gameId={id} />
    </div>
  )
}

