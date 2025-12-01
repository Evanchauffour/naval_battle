"use client";

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier, restrictToParentElement } from '@dnd-kit/modifiers';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { socket } from '../../lib/socket-io';
import { Button } from '../ui/button';
import Boat from './Boat';
import { BoatInterface, GameStatus } from './Game';
import GridItemDraggable from './GridItemDraggable';

export default function CurrentPlayerGrid({ boatsList, gameId, playerId, selectedCells, gameStatus }: { boatsList: BoatInterface[], gameId: string, playerId: string, selectedCells: { left: number; top: number }[], gameStatus: GameStatus }) {
  const gridSize = 32;
  const [grid, setGrid] = useState<number[][]>([
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


  const [boats, setBoats] = useState<BoatInterface[]>([
    {
      id: 0,
      width: 1,
      height: 5,
      imgHorizontal: '/boats/Boat5Horizontal.png',
      imgVertical: '/boats/boat5Vertical.png',
      isKilled: false,
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }, { left: 3, top: 1 }, { left: 4, top: 1 }, { left: 5, top: 1 }],
    },
    {
      id: 1,
      width: 1,
      height: 4,
      imgHorizontal: '/boats/boat4Horizontal.png',
      imgVertical: '/boats/boat4Vertical.png',
      isKilled: false,
      coordinates: [{ left: 1, top: 1 }, { left: 1, top: 2 }, { left: 1, top: 3 }, { left: 1, top: 4 }],
    },
    {
      id: 2,
      width: 1,
      height: 3,
      imgHorizontal: '/boats/boat3Horizontal.png',
      imgVertical: '/boats/boat3Vertical.png',
      isKilled: false,
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }, { left: 3, top: 1 }],
    },
    {
      id: 3,
      width: 1,
      height: 3,
      imgHorizontal: '/boats/boat3Horizontal.png',
      imgVertical: '/boats/boat3Vertical.png',
      isKilled: false,
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }, { left: 3, top: 1 }],
    },
    {
      id: 4,
      width: 1,
      height: 2,
      imgHorizontal: '/boats/boat2Horizontal.png',
      imgVertical: '/boats/boat2Vertical.png',
      isKilled: false,
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }],
    },
  ])

  const [isLoading, setIsLoading] = useState(false);
  const [isValidate, setIsValidate] = useState(false);
  const snapToGridModifier = createSnapModifier(gridSize);

  useEffect(() => {
    boats.forEach(boat => {
      const isKilled = boat.coordinates.every(coord =>
        selectedCells.some(sel =>
          sel.left === coord.left && sel.top === coord.top
        )
      );

      if (!isKilled || boat.isKilled) return;

      setBoats(prev =>
        prev.map(b =>
          b.id === boat.id ? { ...b, isKilled: true } : b
        )
      );

      setGrid(prev => {
        const newGrid = [...prev]
        boat.coordinates.forEach(({ top, left }) => {
          newGrid[top][left] = 3;
        });
        return newGrid;
      });
    })

  }, [selectedCells, boats]);

  useEffect(() => {
    if (boatsList.length > 0) {
      setBoats(boatsList);
    }
    selectedCells.forEach(cell => {
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[cell.top][cell.left] = isBoatHit(cell.top, cell.left) ? 1 : 2;
        return newGrid;
      })
    })
  }, [boatsList, selectedCells]);

  const isBoatHit = (rowIndex: number, colIndex: number) => {
    return boats.some(boat => boat.coordinates.some(coordinate => coordinate.left === colIndex && coordinate.top === rowIndex));
  }

  const isOverlapping = (boats: BoatInterface[], newBoatCoordinates?: { left: number; top: number }[]) => {
    const allCoordinates = boats.flatMap(boat => boat.coordinates);
    const coordinatesToCheck = newBoatCoordinates || allCoordinates;

    return coordinatesToCheck.some((coordinate) => {
      return allCoordinates.some((existingCoordinate) => {
        return coordinate.left === existingCoordinate.left && coordinate.top === existingCoordinate.top;
      });
    });
  }

  const generateRandomCoordinates = useCallback((boatHeight: number, boatWidth: number, existingBoats: BoatInterface[]) => {
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
    const boatsWithCoordinates: BoatInterface[] = [];
    for (let i = 0; i < boats.length; i++) {
      const boat = boats[i];
      const existingBoats = boatsWithCoordinates;
      boatsWithCoordinates.push({
        ...boat,
        coordinates: generateRandomCoordinates(boat.height, boat.width, existingBoats),
      });
    }
    setBoats(boatsWithCoordinates);
    setIsLoading(false);
  }, [generateRandomCoordinates]);

  useEffect(() => {
    if (gameStatus === "ORGANIZING_BOATS" && boatsList.length === 0) {
      regenerateBoats();
    }
  }, [gameStatus, regenerateBoats]);

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

  const handleValidate = () => {
    setIsValidate(!isValidate);
    socket.emit('set-player-ready', { gameId, playerId: playerId, boats: boats });
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin" />
    </div>;
  }

  return (
    <div className='flex flex-col gap-6'>
    <div className='w-fit rounded-md shadow-2xl'>
      <div
        className='grid relative'
        style={{ gridTemplateColumns: `repeat(10, ${gridSize}px)` }}
      >
        <DndContext modifiers={[snapToGridModifier, restrictToParentElement]} onDragEnd={handleDragEnd}>
        {grid.map((row, rowIndex) => (
          row.map((value, colIndex) => (
            <GridItemDraggable
              key={`cell-${rowIndex}-${colIndex}`}
              index={rowIndex * 10 + colIndex}
              row={rowIndex}
              col={colIndex}
              gridSize={gridSize}
              isHit={value === 1}
              isMiss={value === 2}
              isDead={value === 3}
            />
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
      {isValidate && gameStatus === "ORGANIZING_BOATS" && (
      <div className='absolute top-0 left-0 bg-black/60 w-full h-full rounded-md z-10 flex flex-col items-center justify-center gap-4'>
        <Loader2 className="animate-spin text-white" />
        <p className='text-white'>En attente de la validation de l&apos;autre joueur</p>
      </div>
      )}
    </div>
    {gameStatus === "ORGANIZING_BOATS" && (
      <div className="flex flex-col gap-2">
        {!isValidate && (
        <Button variant={"outline"} className="cursor-pointer" onClick={regenerateBoats} disabled={isLoading}>
          {isLoading ? "Génération..." : "Regénérer les bateaux"}
        </Button>
        )}
        <Button className="cursor-pointer" onClick={handleValidate} disabled={isValidate}>
          Valider
        </Button>
        {isValidate && (
        <Button className="cursor-pointer" onClick={() => setIsValidate(false)}>
          Annuler
        </Button>
        )}
      </div>
    )}
  </div>
  )
}
