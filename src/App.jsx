import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { useState } from "react";
import { Experience } from "./components/Experience";
import LinksPage from "./components/LinksPage";

function App() {
  const [showLinksPage, setShowLinksPage] = useState(false);

  if (showLinksPage) {
    return <LinksPage setShowLinksPage={setShowLinksPage} />;
  }

  return (
    <>
      <Canvas>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={20} damping={0.5}>
          <Experience setShowLinksPage={setShowLinksPage} />
        </ScrollControls>
        <EffectComposer>
          <Noise opacity={0.3} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
