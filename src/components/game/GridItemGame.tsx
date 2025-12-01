import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useState } from "react";

export default function GridItemGame({ gridSize, isHit, isMiss, isDead, select, isDisabled }: { gridSize: number; isHit: boolean; isMiss: boolean; isDead: boolean; select: () => void; isDisabled: boolean }) {
  const [isMissAnimationEnded, setIsMissAnimationEnded] = useState(false);
  const [isHitAnimationEnded, setIsHitAnimationEnded] = useState(false);
  const [missLottie, setMissLottie] = useState<DotLottie | null>(null);
  const [hitLottie, setHitLottie] = useState<DotLottie | null>(null);

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
    <button
      className={`flex items-center justify-center relative rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
      style={{ width: gridSize, height: gridSize }}
      onClick={() => {
        if (isMiss && !isMissAnimationEnded) {
          missLottie?.stop();
          setIsMissAnimationEnded(true);
        }
        select();
      }}
      disabled={isDisabled}
    >
      {isMiss &&
        <>
          {!isMissAnimationEnded && (
            <DotLottieReact
              src="/tap.json"
              autoplay
              loop={false}
              dotLottieRefCallback={setMissLottie}
            />
          )}
          {isMissAnimationEnded && <div className="w-1 h-1 bg-white rounded-full" />}
        </>
      }
      {isHit &&
        <>
        {!isHitAnimationEnded && (
        <DotLottieReact
          src="/red_explosion.json"
          autoplay
          loop={false}
          dotLottieRefCallback={setHitLottie}
        />
        )}
        {isHitAnimationEnded && (
          <DotLottieReact
            src="/smoke.json"
            autoplay
            loop
          />
        )
        }
        </>
      }
      {isDead &&
        <DotLottieReact
          src="/flame.json"
          autoplay
          loop
        />
      }
    </button>
  )
}
