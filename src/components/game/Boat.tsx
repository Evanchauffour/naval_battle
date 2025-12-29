import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import { BoatInterface } from "./Game";

interface BoatProps {
  boatData: BoatInterface;
  className?: string;
  gridSize: number;
  disabled?: boolean;
  onRotate?: (boatId: number) => void;
}

export default function Boat({ boatData, className, gridSize, disabled, onRotate }: BoatProps) {
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

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    e.preventDefault();
    if (onRotate) {
      onRotate(boatData.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
      className={`absolute rounded-sm z-10 border-2 border-foreground bg-foreground/20 hover:bg-foreground/30 cursor-move transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${boatData.isKilled ? 'bg-destructive/30 border-destructive' : ''} ${className}`}
    />
  )
}
