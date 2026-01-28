import { Button } from "../ui/button";
import { signIn } from "@/auth";
export function SignIn({
  provider,
  redirect_url
  ,
  ...props
}: { provider?: string,redirect_url?:string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider,{redirectTo:redirect_url})
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  )
}