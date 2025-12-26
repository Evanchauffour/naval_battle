import Room from "../../../../components/room/Room";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full p-4 sm:p-6">
      <Room roomId={id} />
    </div>
  )
}

