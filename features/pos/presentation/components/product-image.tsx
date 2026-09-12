"use client";
import { useState } from "react";
import { Coffee } from "@phosphor-icons/react";
import Image from "next/image";

export function ProductImage({
  src,
  name,
  className = "",
}: {
  src: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className={`grid place-items-center bg-surface-alt text-muted ${className}`}
        role="img"
        aria-label={name}
      >
        <Coffee size={36} />
      </div>
    );
  return (
    <Image
      src={src}
      alt={name}
      width={600}
      height={600}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
