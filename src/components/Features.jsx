import { Canvas } from "@react-three/fiber";
import StudioLights from "./three/StudioLights.jsx";
import { features, featureSequence } from "../constants/index.js";
import clsx from "clsx";
import { Suspense, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import MacbookModel from "./models/Macbook.jsx";
import { useMediaQuery } from "react-responsive";
import useMacbookStore from "../store/index.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ModelScroll = () => {
  const groupRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const { setTexture } = useMacbookStore();

  // Pre-load all feature videos during component mount
  useEffect(() => {
    const createdVideos = featureSequence.map((feature) => {
      const v = document.createElement("video");

      Object.assign(v, {
        src: feature.videoPath,
        muted: true,
        playsInline: true,
        preload: "auto",
        crossOrigin: "anonymous",
      });

      // start preloading
      try {
        v.load();
      } catch (e) {
        // ignore
      }

      return v;
    });

    return () => {
      // cleanup created video elements to release resources
      createdVideos.forEach((v) => {
        if (!v) return;

        try {
          v.pause();
        } catch (e) {}

        try {
          // clear src and remove attribute to help GC and free media resources
          v.src = "";
          if (v.removeAttribute) v.removeAttribute("src");
          if (typeof v.load === "function") v.load();
        } catch (e) {}
      });

      // null out references
      for (let i = 0; i < createdVideos.length; i++) createdVideos[i] = null;
    };
  }, []);

  useGSAP(() => {
    // 3D MODEL ROTATION ANIMATION
    const modelTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#f-canvas",
        start: "top top",
        end: "bottom  top",
        scrub: 1,
        pin: true,
      },
    });

    // SYNC THE FEATURE CONTENT
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#f-canvas",
        start: "top center",
        end: "bottom  top",
        scrub: 1,
      },
    });

    // 3D SPIN
    if (groupRef.current) {
      modelTimeline.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        ease: "power1.inOut",
      });
    }

    // Content & Texture Sync - build timeline dynamically from featureSequence
    featureSequence.forEach((entry, idx) => {
      const delay = typeof entry.delay === "number" ? entry.delay : 0;
      const boxClass = entry.boxClass || `.box${idx + 1}`;
      const videoPath = entry.videoPath || entry.video || entry.src;

      // call to update texture/video
      timeline.call(() => setTexture(videoPath));

      // animate corresponding box (preserve any per-entry delay)
      timeline.to(boxClass, { opacity: 1, y: 0, ...(delay ? { delay } : {}) });
    });
  }, []);

  return (
    <group ref={groupRef}>
      <Suspense
        fallback={
          <Html>
            <h1 className="text-white text-3xl uppercase">Loading...</h1>
          </Html>
        }
      >
        <MacbookModel scale={isMobile ? 0.05 : 0.08} position={[0, -1, 0]} />
      </Suspense>
    </group>
  );
};

const Features = () => {
  return (
    <section id="features">
      <h2>See it all in a new light.</h2>

      <Canvas id="f-canvas" camera={{}}>
        <StudioLights />
        <ambientLight intensity={0.5} />
        <ModelScroll />
      </Canvas>

      <div className="absolute inset-0">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={clsx("box", `box${index + 1}`, feature.styles)}
          >
            <img src={feature.icon} alt={feature.highlight} />
            <p>
              <span className="text-white">{feature.highlight}</span>
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
