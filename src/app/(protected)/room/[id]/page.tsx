import Room from "../../../../components/room/Room";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <div className="flex flex-col gap-4 w-[600px]">
        <p>Room id: {id}</p>
        <Room roomId={id} />
      </div>
    </div>
  )
}
