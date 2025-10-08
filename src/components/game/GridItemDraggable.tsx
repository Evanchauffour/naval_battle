import { useDroppable } from "@dnd-kit/core";
import { Bone, Circle, X } from "lucide-react";

export default function GridItemDraggable({ index, row, col, gridSize, isHit, isMiss, isDead }: { index: number; row: number; col: number; gridSize: number; isHit: boolean; isMiss: boolean; isDead: boolean }) {
  const { setNodeRef } = useDroppable({
    id: index,
    data: { row, col },
  });
  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center`}
      style={{ width: gridSize, height: gridSize }}
    >
      {isMiss && <Circle className="text-blue-500 size-4"/>}
      {isHit && <X className="text-red-500 size-4"/>}
      {isDead && <Bone className="text-gray-500 size-4"/>}
  </div>
  )
}
