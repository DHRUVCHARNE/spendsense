import { createTxnAction } from "../actions/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddTxnCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record an income or expense</CardDescription>
      </CardHeader>

      {/* 🔥 THIS connects form → server action */}
      <form action={createTxnAction}>
        <CardContent>
          <div className="flex flex-col gap-4">

            {/* Amount in Paise */}
            <div className="grid gap-2">
              <Label htmlFor="amountPaise">Amount (₹)</Label>
              <Input
                id="amountPaise"
                name="amountPaise"
                type="number"
                placeholder="500"
                required
              />
            </div>

            {/* Transaction Type */}
            <div className="grid gap-2">
              <Label>Transaction Type</Label>
              <select name="txnType" className="border rounded p-2">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            {/* Category ID */}
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Category ID</Label>
              <Input
                id="categoryId"
                name="categoryId"
                placeholder="UUID (optional)"
              />
            </div>

            {/* Currency */}
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                placeholder="INR"
              />
            </div>

            {/* Payment Method */}
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <select name="paymentMethod" className="border rounded p-2">
                <option value="">Select (optional)</option>
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="NETBANKING">Net Banking</option>
                <option value="WALLET">Wallet</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CHEQUE">Cheque</option>
                <option value="EMI">EMI</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Dinner at cafe"
              />
            </div>

          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
