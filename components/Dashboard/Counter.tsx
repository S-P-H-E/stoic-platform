import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { formatNumber, formatNumberCompact } from "@/utils/utils";

export default function Counter({
  value,
  direction = "up",
  compact
}: {
  value: number;
  direction?: "up" | "down";
  compact?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 280,
  });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value);
    }
  }, [motionValue, isInView, direction, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          if (compact)  {
            const formattedNumber = Math.abs(latest) >= 1000 ? formatNumberCompact(latest) : latest.toFixed(0);

            ref.current.textContent = formattedNumber;
          } else {
            const formattedNumber =
            Math.abs(latest) >= 1000 ? formatNumber(latest) : latest.toFixed(0);
          
            ref.current.textContent = formattedNumber;
          }
        }
      }),
    [springValue, compact]
  );

  return <span ref={ref} />;
}
