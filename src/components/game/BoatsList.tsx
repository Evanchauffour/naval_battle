"use client"

import Boat from "./Boat";

export default function BoatsList() {

  const gridSize = 32;
  const boats: { id: number; width: number; height: number }[] = [
    {
      id: 0,
      width: gridSize * 5,
      height: gridSize,
    },
    {
      id: 1,
      width: gridSize ,
      height: gridSize * 4,
    },
    {
      id: 2,
      width: gridSize * 3,
      height: gridSize,
    },
    {
      id: 3,
      width: gridSize * 3,
      height: gridSize,
    },
    {
      id: 4,
      width: gridSize * 2,
      height: gridSize,
    },
  ];

  const boatsClasses = (id: number) => {
    switch (id) {
      case 0:
        return 'col-span-5 row-span-1';
      case 1:
        return 'col-span-1 row-span-4';
      case 2:
        return 'col-span-3 row-span-1';
      case 3:
        return 'col-span-3 row-span-1';
      case 4:
        return 'col-span-2 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="grid rounded-2xl p-4 bg-gray-700 backdrop-blur-md border border-white/10 shadow-2xl" style={{ gridTemplateColumns: `repeat(5, ${gridSize}px)`, gridAutoRows: `${gridSize}px` }}>
      {boats.map((boat) => (
        <Boat
          className={boatsClasses(boat.id)}
          key={boat.id}
          height={boat.height}
          width={boat.width}
          left={0}
          top={0}
          index={boat.id}
          gridSize={gridSize}
        />
      ))}
    </div>
  )
}
