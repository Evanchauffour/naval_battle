import { Bone, Circle, X } from "lucide-react";


export default function GridItemGame({ gridSize, isHit, isMiss, isDead, select }: { gridSize: number; isHit: boolean; isMiss: boolean; isDead: boolean; select: () => void }) {
  return (
    <button
      className={`flex items-center justify-center relative rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
      style={{ width: gridSize, height: gridSize }}
      onClick={() => select()}
    >
      {isHit && <X className="text-red-500 size-4"/>}
      {isMiss && <Circle className="text-blue-500 size-4"/>}
      {isDead && <Bone className="text-gray-500 size-4"/>}
    </button>
  )
}


// useEffect(() => {
//   boats.forEach(boat => {
//     const isKilled = boat.coordinates.every(coord =>
//       coordinatesSelected.some(sel => {
//         sel.left === coord.left && sel.top === coord.top
//         console.log(sel.left, coord.left, sel.top, coord.top);

//       })
//     );
//     console.log(isKilled);

//     if(isKilled) {
//       setBoats(prev => {
//         const newBoats = [...prev]
//         newBoats.filter(newBoat => newBoat.id === boat.id)[0].isKilled = true
//         return newBoats
//       })
//       console.log(boats[0].isKilled);

//       setGrid(prev => {
//         const newGrid = [...prev];
//         boat.coordinates.forEach(coord => {
//           newGrid[coord.top][coord.left] = 3;
//         })
//         console.log(newGrid);
//         return newGrid;
//       })
//     }
//   })

// }, [coordinatesSelected]);
