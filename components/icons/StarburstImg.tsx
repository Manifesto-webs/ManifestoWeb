import Image from "next/image";
import type { StarburstId } from "@/types/project";

interface StarburstImgProps {
  id: StarburstId;
  className?: string;
  alt?: string;
  priority?: boolean;
}

const STARBURST_MAP: Record<StarburstId, string> = {
  "01": "/graphics/starburst-01-discovery.png",
  "02": "/graphics/starburst-02-order.png",
  "03": "/graphics/starburst-03-conceptualization.png",
  "04": "/graphics/starburst-04-creation.png",
  "05": "/graphics/starburst-05-launch.png",
};

export function StarburstImg({ id, className, alt = "", priority }: StarburstImgProps) {
  return (
    <Image
      src={STARBURST_MAP[id]}
      alt={alt}
      width={200}
      height={200}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
