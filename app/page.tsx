import { auth } from "@/auth";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay
  return "done";
}
  const session = await auth();
  if (!session) return (<div>
    <LandingPage />
  </div>);
   await getData();
  return (
    <div>
      Home
    </div>
  );
}
