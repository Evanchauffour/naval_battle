"use client";

import { useEffect, useState } from 'react';
import GridItemGame from './GridItemGame';

export interface Boat {
  id: number;
  width: number;
  height: number;
  img: string;
  isKilled: boolean;
  coordinates: {
    left: number;
    top: number;
  }[];
}

export default function OpponentPlayerGrid() {
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

  const [coordinatesSelected, setCoordinatesSelected] = useState<{ left: number; top: number }[]>([]);


  const [boats, setBoats] = useState<Boat[]>([
    {
      id: 0,
      width: 5,
      height: 1,
      img: '/boats/boat5.png',
      coordinates: [{ left: 1, top: 1 }, { left: 2, top: 1 }, { left: 3, top: 1 }, { left: 4, top: 1 }, { left: 5, top: 1 }],
      isKilled: false,
    },
    {
      id: 1,
      width: 1,
      height: 4,
      img: '/boats/boat4.png',
      coordinates: [{ left: 1, top: 9 }, { left: 2, top: 9 }, { left: 3, top: 9 }, { left: 4, top: 9 }],
      isKilled: false,
    },
    {
      id: 2,
      width: 3,
      height: 1,
      img: '/boats/boat3.png',
      coordinates: [{ left: 2, top: 5 }, { left: 3, top: 5 }, { left: 4, top: 5 }],
      isKilled: false,
    },
    {
      id: 3,
      width: 3,
      height: 1,
      img: '/boats/boat3.png',
      coordinates: [{ left: 7, top: 7 }, { left: 7, top: 8 }, { left: 7, top: 9 }],
      isKilled: false,
    },
    {
      id: 4,
      width: 2,
      height: 1,
      img: '/boats/boat2.png',
      coordinates: [{ left: 8, top: 8 }, { left: 9, top: 8 }],
      isKilled: false,
    },
  ])

  const isBoatHit = (rowIndex: number, colIndex: number) => {
    return boats.some(boat => boat.coordinates.some(coordinate => coordinate.left === colIndex && coordinate.top === rowIndex));
  }

  useEffect(() => {
    boats.forEach(boat => {
      const isKilled = boat.coordinates.every(coord =>
        coordinatesSelected.some(sel =>
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

  }, [coordinatesSelected, boats]);

  const handleClick = (rowIndex: number, colIndex: number) => {
    setCoordinatesSelected(prev => [...prev, { left: colIndex, top: rowIndex }]);
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[rowIndex][colIndex] = isBoatHit(rowIndex, colIndex) ? 1 : 2;
      return newGrid;
    })
  }

  return (
    <div className='flex flex-col gap-6'>
    <div className='w-fit rounded-md bg-gray-700 backdrop-blur-md border border-white/10 shadow-2xl p-6'>
      <div
        className='grid relative'
        style={{ gridTemplateColumns: `repeat(10, ${gridSize}px)` }}
      >
        {grid.map((row, rowIndex) => (
          row.map((value, colIndex) => (
            <GridItemGame
              key={`cell-${rowIndex}-${colIndex}`}
              gridSize={gridSize}
              isHit={value === 1}
              isMiss={value === 2}
              isDead={value === 3}
              select={() => {
                handleClick(rowIndex, colIndex);
              }}
            />
          ))
        ))}
      </div>
    </div>
  </div>
  )
}
