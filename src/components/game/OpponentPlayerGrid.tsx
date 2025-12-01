"use client";

import { useEffect, useState } from 'react';
import { useSocket } from '../../hook/useSocket';
import { BoatInterface } from './Game';
import GridItemGame from './GridItemGame';

export default function OpponentPlayerGrid({ boatsList, selectedCells, gameId, currentPlayerId, isDisabled }: { boatsList: BoatInterface[], selectedCells: { left: number; top: number }[], gameId: string, currentPlayerId: string, isDisabled: boolean }) {
  const { socket } = useSocket();
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

  const [coordinatesSelected, setCoordinatesSelected] = useState<{ left: number; top: number }[]>(selectedCells);


  const [boats, setBoats] = useState<BoatInterface[]>(boatsList)

  useEffect(() => {
    setBoats(boatsList);
    setCoordinatesSelected(selectedCells);
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
    if (isDisabled) return;
    setCoordinatesSelected(prev => [...prev, { left: colIndex, top: rowIndex }]);

    socket?.emit('set-player-selected-cells', { gameId, playerId: currentPlayerId, cells: { left: colIndex, top: rowIndex }, isPlayAgain: isBoatHit(rowIndex, colIndex) });
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[rowIndex][colIndex] = isBoatHit(rowIndex, colIndex) ? 1 : 2;
      return newGrid;
    })
  }

  return (
    <div className='flex flex-col gap-6'>
    <div className='w-fit rounded-md shadow-2xl'>
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
              isDisabled={isDisabled}
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
