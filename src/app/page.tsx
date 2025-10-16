import SciFiBackgroundNormal from "@/components/background/bg-normal";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <SciFiBackgroundNormal>
        <h1 className="text-3xl font-bold underline">
          Hello E-Budget Project!
        </h1>
        <p>เริ่มกันเลย</p>
      </SciFiBackgroundNormal>
    </div>
  );
}
