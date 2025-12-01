import Game from "../../../../components/game/Game";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="w-full h-full flex justify-center items-center bg-gradient-to-b from-blue-950 to-blue-900">
      <Game gameId={id} />
    </div>
  )
}
