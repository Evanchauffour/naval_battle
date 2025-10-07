import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import type { Boat } from "./CurrentPlayerGrid";

export default function Boat({ boatData, className, gridSize, disabled }: { boatData: Boat; className?: string; gridSize: number; disabled?: boolean }) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    disabled,
    id: boatData.id,
  });
  const style = {
    left: boatData.coordinates[0].left * gridSize,
    top: boatData.coordinates[0].top * gridSize,
    width: boatData.width * gridSize,
    height: boatData.height * gridSize,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`absolute rounded-md bg-blue-500 border border-white ${className}`}
    />
  )
}
