import { useDroppable } from "@dnd-kit/core";
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from "react";

export default function GridItemDraggable({ index, row, col, gridSize, isHit, isMiss, isDead }: { index: number; row: number; col: number; gridSize: number; isHit: boolean; isMiss: boolean; isDead: boolean }) {
  const { setNodeRef } = useDroppable({
    id: index,
    data: { row, col },
  });
  const [isMissAnimationEnded, setIsMissAnimationEnded] = useState(false);
  const [isHitAnimationEnded, setIsHitAnimationEnded] = useState(false);
  const [missLottie, setMissLottie] = useState<DotLottie | null>(null);
  const [hitLottie, setHitLottie] = useState<DotLottie | null>(null);

  console.log(isHit, isMiss, isDead);


  useEffect(() => {
    if (!missLottie) return;
    const handleComplete = () => setIsMissAnimationEnded(true);
    missLottie.addEventListener("complete", handleComplete);
    return () => {
      missLottie.removeEventListener("complete", handleComplete);
    };
  }, [missLottie]);

  useEffect(() => {
    if (!hitLottie) return;
    const handleComplete = () => setIsHitAnimationEnded(true);
    hitLottie.addEventListener("complete", handleComplete);
    return () => {
      hitLottie.removeEventListener("complete", handleComplete);
    };
  }, [hitLottie]);

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-md border border-white/20 transition-all duration-200 flex items-center justify-center`}
      style={{ width: gridSize, height: gridSize }}
      onClick={() => {
        if (isMiss && !isMissAnimationEnded) {
          missLottie?.stop();
          setIsMissAnimationEnded(true);
        }
      }}
    >
      {isMiss &&
        <>
          {!isMissAnimationEnded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <DotLottieReact
                src="/tap.json"
                autoplay
                loop={false}
                dotLottieRefCallback={setMissLottie}
              />
            </div>
          )}
          {isMissAnimationEnded && <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"><div className="w-1 h-1 bg-white rounded-full" /></div>}
        </>
      }
      {isHit &&
        <>
        {!isHitAnimationEnded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <DotLottieReact
            src="/red_explosion.json"
            autoplay
            loop={false}
            dotLottieRefCallback={setHitLottie}
          />
        </div>
        )}
        {isHitAnimationEnded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <DotLottieReact
              src="/smoke.json"
              autoplay
              loop
            />
          </div>
        )
        }
        </>
      }
      {isDead &&
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <DotLottieReact
            src="/flame.json"
            autoplay
            loop
          />
        </div>
      }
  </div>
  )
}
