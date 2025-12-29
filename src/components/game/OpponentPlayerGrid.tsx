"use client";

import { useEffect, useState } from 'react';
import { useSocket } from '../../hook/useSocket';
import { BoatInterface } from './Game';
import GridItemGame from './GridItemGame';

export default function OpponentPlayerGrid({ boatsList, selectedCells, gameId, currentPlayerId, isDisabled, isYourTurn }: { boatsList: BoatInterface[], selectedCells: { left: number; top: number }[], gameId: string, currentPlayerId: string, isDisabled: boolean, isYourTurn?: boolean }) {
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
  const [hasEndedGame, setHasEndedGame] = useState(false);

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

    // Vérifier si tous les bateaux sont coulés
    const allBoatsKilled = boats.length > 0 && boats.every(boat => {
      return boat.coordinates.every(coord =>
        coordinatesSelected.some(sel =>
          sel.left === coord.left && sel.top === coord.top
        )
      );
    });

    if (allBoatsKilled && socket && !isDisabled && !hasEndedGame) {
      // Tous les bateaux de l'adversaire sont coulés, le joueur actuel a gagné
      setHasEndedGame(true);
      socket.emit('end-game', {
        gameId,
        winnerId: currentPlayerId
      });
    }

  }, [coordinatesSelected, boats, socket, gameId, currentPlayerId, isDisabled, hasEndedGame]);

  const handleClick = (rowIndex: number, colIndex: number) => {
    if (isDisabled) return;

    // Vérifier si cette case a déjà été sélectionnée
    const alreadySelected = coordinatesSelected.some(
      sel => sel.left === colIndex && sel.top === rowIndex
    );
    if (alreadySelected) return;

    const wasHit = isBoatHit(rowIndex, colIndex);

    // Vérifier si ce coup va couler un bateau
    const hitBoat = wasHit ? boats.find(boat =>
      boat.coordinates.some(coord => coord.left === colIndex && coord.top === rowIndex)
    ) : null;

    let willSinkBoat = false;
    if (hitBoat && wasHit && !hitBoat.isKilled) {
      // Vérifier si tous les coups de ce bateau seront touchés après ce coup
      const newSelectedCells = [...coordinatesSelected, { left: colIndex, top: rowIndex }];
      const allBoatCellsHit = hitBoat.coordinates.every(coord =>
        newSelectedCells.some(sel => sel.left === coord.left && sel.top === coord.top)
      );
      willSinkBoat = allBoatCellsHit;
    }

    setCoordinatesSelected(prev => [...prev, { left: colIndex, top: rowIndex }]);

    // Si c'est un hit mais que le bateau est coulé, on passe le tour (isPlayAgain: false)
    // Sinon, si c'est un hit, on rejoue (isPlayAgain: true)
    // Si c'est un miss, on passe le tour (isPlayAgain: false)
    const isPlayAgain = wasHit && !willSinkBoat;

    socket?.emit('set-player-selected-cells', { gameId, cells: { left: colIndex, top: rowIndex }, isPlayAgain });
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[rowIndex][colIndex] = wasHit ? 1 : 2;
      return newGrid;
    })
  }

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='w-fit rounded-lg shadow-2xl bg-card/30 backdrop-blur-sm border border-border overflow-hidden'>
        <div className="text-sm text-foreground bg-muted px-4 py-2 text-center font-semibold border-b border-border flex items-center justify-between">
          <span>Grille adverse</span>
          {isYourTurn !== undefined && (
            <span className="text-xs font-normal text-muted-foreground">
              {isYourTurn ? "Votre tour" : "Tour adverse"}
            </span>
          )}
        </div>
        <div className="p-3">
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
    </div>
  )
}
