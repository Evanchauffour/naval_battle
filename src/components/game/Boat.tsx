import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import { useEffect, useState } from "react";
import { BoatInterface } from "./Game";

export default function Boat({ boatData, className, gridSize, disabled }: { boatData: BoatInterface; className?: string; gridSize: number; disabled?: boolean }) {
  const [imgOrientation, setImgOrientation] = useState<"horizontal" | "vertical">("vertical");
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

  useEffect(() => {
    if (boatData.width > boatData.height) {
      setImgOrientation("horizontal");
    } else {
      setImgOrientation("vertical");
    }
    console.log(imgOrientation);
  }, [boatData.width, boatData.height]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`absolute rounded-md z-10 ${className}`}>
        <img
          src={imgOrientation === "horizontal" ? boatData.imgHorizontal : boatData.imgVertical }
          className={`w-full h-full object-contain brightness-50`}
        />
    </div>
  )
}
