import { createCategoryAction } from "../../actions/actions";
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

export default function AddCategoryCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Add Category</CardTitle>
        <CardDescription>Create a category to group transactions</CardDescription>
      </CardHeader>

      <form action={createCategoryAction}>
        <CardContent>
          <div className="flex flex-col gap-4">

            {/* Category Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Food, Rent, Salary..."
                required
              />
            </div>

            {/* Category Color */}
            <div className="grid gap-2">
              <Label htmlFor="color">Color (optional)</Label>
              <Input
                id="color"
                name="color"
                type="color"
              />
            </div>

          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Create Category
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
