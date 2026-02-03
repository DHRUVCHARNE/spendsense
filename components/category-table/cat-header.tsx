"use client";
import { useState } from "react";
import CreateCatForm from "./create-cat";

export function CatHeader() {
  const [open, setOpen] = useState(false);
  return <CreateCatForm open={open} setOpen={setOpen} />;
}
