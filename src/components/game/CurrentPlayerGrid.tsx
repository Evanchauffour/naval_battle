"use client";

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier, restrictToParentElement } from '@dnd-kit/modifiers';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Boat from './Boat';
import GridItemDraggable from './GridItemDraggable';

export interface Boat {
  id: number;
  width: number;
  height: number;
  img: string;
  coordinates: {
    left: number;
    top: number;
  }[];
}

export default function CurrentPlayerGrid() {
  const gridSize = 32;
  const [currentUserGrid] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);


  const [boats, setBoats] = useState<Boat[]>([
    {
      id: 0,
      width: 5,
      height: 1,
      img: '/boats/boat5.png',
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }, { left: 3, top: 1 }, { left: 4, top: 1 }, { left: 5, top: 1 }],
    },
    {
      id: 1,
      width: 1,
      height: 4,
      img: '/boats/boat4.png',
      coordinates: [{ left: 1, top: 1 }, { left: 1, top: 2 }, { left: 1, top: 3 }, { left: 1, top: 4 }],
    },
    {
      id: 2,
      width: 3,
      height: 1,
      img: '/boats/boat3.png',
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }, { left: 3, top: 1 }],
    },
    {
      id: 3,
      width: 3,
      height: 1,
      img: '/boats/boat3.png',
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }, { left: 3, top: 1 }],
    },
    {
      id: 4,
      width: 2,
      height: 1,
      img: '/boats/boat2.png',
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }],
    },
  ])

  const [isLoading, setIsLoading] = useState(true);
  const [isValidate, setIsValidate] = useState(false);
  const snapToGridModifier = createSnapModifier(gridSize);

  const isOverlapping = (boats: Boat[], newBoatCoordinates?: { left: number; top: number }[]) => {
    const allCoordinates = boats.flatMap(boat => boat.coordinates);
    const coordinatesToCheck = newBoatCoordinates || allCoordinates;

    return coordinatesToCheck.some((coordinate) => {
      return allCoordinates.some((existingCoordinate) => {
        return coordinate.left === existingCoordinate.left && coordinate.top === existingCoordinate.top;
      });
    });
  }

  const generateRandomCoordinates = useCallback((boatHeight: number, boatWidth: number, existingBoats: Boat[]) => {
      const maxAttempts = 1000;
      let attempts = 0;

      while (attempts < maxAttempts) {
        const left = Math.floor(Math.random() * (10 - boatWidth));
        const top = Math.floor(Math.random() * (10 - boatHeight));

        if (left + boatWidth <= 10 && top + boatHeight <= 10) {
          const newBoatCoordinates = determineBoatCoordinates(boatHeight, boatWidth, left, top);

          if (!isOverlapping(existingBoats, newBoatCoordinates)) {
            return newBoatCoordinates;
          }
        }

        attempts++;
      }

      console.warn(`Impossible de placer le bateau ${boatWidth}x${boatHeight} après ${maxAttempts} tentatives`);
      return determineBoatCoordinates(boatHeight, boatWidth, 1, 1);
  }, []);

  const determineBoatCoordinates = (boatHeight: number, boatWidth: number, left: number, top: number) => {
    const coordinates = [];
    for(let i = 0; i < boatHeight; i++) {
      for(let j = 0; j < boatWidth; j++) {
        coordinates.push({ left: j + left, top: i + top });
      }
    }
    return coordinates;
  }

  const regenerateBoats = useCallback(() => {
    setIsLoading(true);
    setBoats((prev) => {
      const boatsWithCoordinates: Boat[] = [];
      for (let i = 0; i < prev.length; i++) {
        const boat = prev[i];
        const existingBoats = boatsWithCoordinates;
        boatsWithCoordinates.push({
          ...boat,
          coordinates: generateRandomCoordinates(boat.height, boat.width, existingBoats),
        });
      }
      return boatsWithCoordinates;
    });
    setIsLoading(false);
  }, [generateRandomCoordinates]);

  useEffect(() => {
    regenerateBoats();
  }, [regenerateBoats]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const data = over.data?.current as { row?: number; col?: number } | undefined;
    const activeId = active?.id;
    if (data && typeof data.row === 'number' && typeof data.col === 'number' && typeof activeId === 'number') {
      setBoats((prev) => {
        const newLeft = Number(data.col);
        const newTop = Number(data.row);

        const targetBoat = prev.find(boat => boat.id === activeId);
        if (!targetBoat) return prev;

        if (newLeft + targetBoat.width - 1 <= 10 && newTop + targetBoat.height - 1 <= 10) {
          const newCoordinates = determineBoatCoordinates(targetBoat.height, targetBoat.width, newLeft, newTop);

          const otherBoats = prev.filter(boat => boat.id !== activeId);

          if (!isOverlapping(otherBoats, newCoordinates)) {
            return prev.map((boat) => {
              if (boat.id === activeId) {
                return {
                  ...boat,
                  coordinates: newCoordinates
                };
              }
              return boat;
            });
          }
        }

        return prev;
      });
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin" />
    </div>;
  }

  return (
    <div className='flex flex-col gap-6'>
    <div className='w-fit rounded-md bg-gray-700 backdrop-blur-md border border-white/10 shadow-2xl p-6'>
      <div
        className='grid relative'
        style={{ gridTemplateColumns: `repeat(10, ${gridSize}px)` }}
      >
        <DndContext modifiers={[snapToGridModifier, restrictToParentElement]} onDragEnd={handleDragEnd}>
        {currentUserGrid.map((row, rowIndex) => (
          row.map((_, colIndex) => (
            <GridItemDraggable key={`cell-${rowIndex}-${colIndex}`} index={rowIndex * 10 + colIndex} row={rowIndex} col={colIndex} gridSize={gridSize} />
          ))
        ))}
        {boats.map((boat) => (
          <Boat
            key={boat.id}
            boatData={boat}
            gridSize={gridSize}
            disabled={isValidate}
          />
        ))}
        </DndContext>
      </div>
      {isValidate && (
      <div className='absolute top-0 left-0 bg-black/60 w-full h-full rounded-md z-10 flex flex-col items-center justify-center gap-4'>
        <Loader2 className="animate-spin text-white" />
        <p className='text-white'>En attente de la validation de l&apos;autre joueur</p>
      </div>
      )}
    </div>
    <div className="flex flex-col gap-2">
      {!isValidate && (
      <Button variant={"outline"} className="cursor-pointer" onClick={regenerateBoats} disabled={isLoading}>
        {isLoading ? "Génération..." : "Regénérer les bateaux"}
      </Button>
      )}
      <Button className="cursor-pointer" onClick={() => setIsValidate(true)} disabled={isValidate}>
        Valider
      </Button>
      {isValidate && (
      <Button className="cursor-pointer" onClick={() => setIsValidate(false)}>
        Annuler
      </Button>
      )}
    </div>
  </div>
  )
}
