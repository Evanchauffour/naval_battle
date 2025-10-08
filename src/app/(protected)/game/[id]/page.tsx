import CurrentPlayerGrid from "../../../../components/game/CurrentPlayerGrid";
import OpponentPlayerGrid from "../../../../components/game/OpponentPlayerGrid";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-600">
      <div className='flex justify-center items-start gap-14'>
        <CurrentPlayerGrid />
        <OpponentPlayerGrid />
      </div>
    </div>
  )
}
