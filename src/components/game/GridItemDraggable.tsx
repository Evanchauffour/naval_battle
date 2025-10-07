import { useDroppable } from "@dnd-kit/core";

export default function GridItemDraggable({ index, row, col, gridSize }: { index: number; row: number; col: number; gridSize: number }) {
  const { setNodeRef } = useDroppable({
    id: index,
    data: { row, col },
  });
  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
      style={{ width: gridSize, height: gridSize }}
    >
  </div>
  )
}
