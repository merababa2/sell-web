import { isOpenNowKuwait } from "@/lib/format";
import Landing from "@/components/landing/landing";

export const dynamic = "force-dynamic";

export default function Home() {
  return <Landing openNow={isOpenNowKuwait()} />;
}
