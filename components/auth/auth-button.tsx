import { auth } from "@/auth";
import { SignIn } from "./sign-in";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import { SignOut } from "./sign-out";

export default async function AuthButton() {
    const session = await auth();
    if (!session) return <SignIn />;
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="h-9 w-9 rounded-full overflow-hidden">
                            <AvatarImage
                                src={session.user?.image ?? undefined}
                                alt={session.user?.name ?? "User avatar"}
                                className="h-full w-full object-cover"
                            />
                            <AvatarFallback className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                                {session.user?.name?.[0] ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                    <DropdownMenuItem>
                        <SignOut />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}