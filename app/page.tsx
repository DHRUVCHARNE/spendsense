import { auth } from "@/auth";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const session = await auth();
  if (!session) return (<div>
    <LandingPage />
  </div>);
  return (
    <div>
      Home
    </div>
  );
}
