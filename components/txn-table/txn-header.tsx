"use client";
import { useState } from "react";
import CreateTxnForm from "./create-txn";

export function TxnHeader() {
  const [open, setOpen] = useState(false);
  return <CreateTxnForm open={open} setOpen={setOpen} />;
}
