"use client";
import { useState } from "react";
import { createBrowserPosService } from "../composition";
import { PosProvider } from "./pos-provider";
import { PosShell } from "./pos-shell";

export default function PosApp() {
  const [service] = useState(createBrowserPosService);
  return (
    <PosProvider service={service}>
      <PosShell />
    </PosProvider>
  );
}
