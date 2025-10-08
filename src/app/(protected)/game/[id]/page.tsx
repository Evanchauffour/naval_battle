import Game from "../../../../components/game/Game";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-600">
      <Game gameId={id} />
    </div>
  )
}
