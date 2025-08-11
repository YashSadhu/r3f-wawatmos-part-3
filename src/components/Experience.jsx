import {
  Float,
  PerspectiveCamera,
  useScroll,
  Text,
  Image,
  Html,
  Cloud,
} from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { gsap } from "gsap";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";

// --- HELPER: FADE MATERIAL ---
// This function is used to make the line and clouds fade in the distance
export const fadeOnBeforeCompile = (shader) => {
  shader.uniforms.uFadeDistance = { value: 200 };
  shader.uniforms.uOrigin = { value: new THREE.Vector3() };
  shader.vertexShader =
    `
    uniform float uFadeDistance;
    uniform vec3 uOrigin;
    varying float vFinalFade;
    ` + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <project_vertex>",
    `
    #include <project_vertex>
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vFinalFade = 1.0 - clamp(distance(worldPosition.xyz, uOrigin) / uFadeDistance, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    `
  );
  shader.fragmentShader =
    `
    varying float vFinalFade;
    ` + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace(
    "vec4 diffuseColor = vec4( diffuse, opacity );",
    "vec4 diffuseColor = vec4( diffuse, opacity * vFinalFade );"
  );
};

// --- COMPONENT: AIRPLANE ---
// A simple placeholder for the airplane model
const Airplane = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 0.2, 0.5]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};


// --- COMPONENT: BACKGROUND ---
// Manages the gradient background colors
const Background = ({ backgroundColors }) => {
  const colorA = useMemo(() => new THREE.Color(backgroundColors.current.colorA), []);
  const colorB = useMemo(() => new THREE.Color(backgroundColors.current.colorB), []);

  useFrame(() => {
    colorA.set(backgroundColors.current.colorA);
    colorB.set(backgroundColors.current.colorB);
  });

  return (
    <mesh scale={1000}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `}
        fragmentShader={`
          uniform vec3 colorA;
          uniform vec3 colorB;
          varying vec3 vWorldPosition;
          void main() {
            vec3 normalizedPosition = normalize(vWorldPosition);
            float t = (normalizedPosition.y + 1.0) / 2.0;
            vec3 finalColor = mix(colorA, colorB, t);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
        uniforms={{
          colorA: { value: colorA },
          colorB: { value: colorB },
        }}
        side={THREE.BackSide}
      />
    </mesh>
  );
};


// --- MAIN EXPERIENCE COMPONENT ---
export const Experience = () => {
  // --- CONSTANTS & CONFIG ---
  const LINE_NB_POINTS = 1000;
  const CURVE_DISTANCE = 250;
  const CURVE_AHEAD_CAMERA = 0.008;
  const CURVE_AHEAD_AIRPLANE = 0.02;
  const AIRPLANE_MAX_ANGLE = 35;
  const FRICTION_DISTANCE = 50; // Increased distance for smoother transitions near text

  // --- CURVE DEFINITION ---
  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
    ],
    []
  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
  }, [curvePoints]);

  // --- PORTFOLIO CONTENT ---
  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[1].x - 3,
          curvePoints[1].y,
          curvePoints[1].z + 50
        ),
        content: (
          <div className="w-[300px] md:w-[500px] p-4 bg-white/20 backdrop-blur-md rounded-lg text-white text-center">
            <h1 className="text-2xl md:text-4xl font-bold">Hi, I'm Yashkumar Sadhu</h1>
            <p className="mt-4 text-sm md:text-base">
              Creative developer and storyteller, crafting digital experiences that blend innovation with narrative.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <a href="https://drive.google.com/drive/folders/1zHvTX9ayMYKXl8AjZApwklEWbsIESgAI" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors">
                📁 View Portfolio
              </a>
              <a href="mailto:yashsadhu1605@gmail.com" className="px-4 py-2 bg-transparent border border-white text-white rounded-lg font-bold hover:bg-white/20 transition-colors">
                💬 Get in Touch
              </a>
            </div>
          </div>
        ),
      },
      {
        cameraRailDist: 2.5,
        position: new Vector3(
          curvePoints[2].x + 20,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        content: (
          <div className="w-[350px] md:w-[600px] p-6 bg-white/20 backdrop-blur-md rounded-lg text-white">
            <h2 className="text-3xl font-bold text-center">Featured Projects</h2>
            <p className="text-center text-sm mb-6">Turning ideas into impactful digital solutions</p>
            <div className="space-y-4">
              {/* Project 1 */}
              <div className="p-4 bg-black/30 rounded-lg">
                <h3 className="text-xl font-bold">📚 Web Application: NeedItBuildIt</h3>
                <p className="mt-2 text-sm">A powerful story management platform designed for writers. Organize timelines, sort events, and manage complex narratives with an intuitive interface.</p>
                <a href="https://needitbuildit.site/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-bold hover:underline">Visit Project →</a>
              </div>
              {/* Project 2 */}
              <div className="p-4 bg-black/30 rounded-lg">
                <h3 className="text-xl font-bold">✨ Creative Portfolio</h3>
                <p className="mt-2 text-sm">A comprehensive collection of my creative work, including tech content, research documents, and innovative projects.</p>
                <a href="https://drive.google.com/drive/folders/1zHvTX9ayMYKXl8AjZApwklEWbsIESgAI" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-bold hover:underline">View Portfolio →</a>
              </div>
            </div>
          </div>
        )
      },
      {
        cameraRailDist: -2,
        position: new Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        content: (
          <div className="w-[350px] md:w-[600px] p-6 bg-white/20 backdrop-blur-md rounded-lg text-white">
            <h2 className="text-3xl font-bold text-center">Fun Experiments</h2>
            <p className="text-center text-sm mb-6">Exploring technology and user experience</p>
            <div className="space-y-4">
               {/* Experiment 1 */}
              <div className="p-4 bg-black/30 rounded-lg">
                <h3 className="text-xl font-bold">Your Life in Weeks</h3>
                <p className="mt-2 text-sm">A thought-provoking visualization showing time lived and ahead, with heartbeats and life statistics.</p>
                <a href="https://tubular-begonia-4c5989.netlify.app/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-bold hover:underline">Life Visualization →</a>
              </div>
              {/* Experiment 2 */}
              <div className="p-4 bg-black/30 rounded-lg">
                <h3 className="text-xl font-bold">BuzzLoop</h3>
                <p className="mt-2 text-sm">A dual-mode social app exploring addictive design vs ethical engagement, revealing dopamine triggers and notification psychology.</p>
                <a href="https://eclectic-sunshine-4f0f7e.netlify.app/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-bold hover:underline">BuzzLoop Demo →</a>
              </div>
            </div>
          </div>
        )
      },
       {
        cameraRailDist: 1,
        position: new Vector3(
          curvePoints[4].x + 10,
          curvePoints[4].y,
          curvePoints[4].z - 20
        ),
        content: (
          <div className="w-[300px] md:w-[500px] p-6 bg-white/20 backdrop-blur-md rounded-lg text-white text-center">
            <h2 className="text-3xl font-bold">Let's Connect</h2>
            <p className="mt-2 mb-6">Ready to create something amazing together?</p>
            <div className="flex flex-col items-center space-y-3">
              <a href="mailto:yashsadhu1605@gmail.com" className="font-bold hover:underline">📧 yashsadhu1605@gmail.com</a>
              <a href="https://twitter.com/yashsadhu09" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">𝕏 @yashsadhu09</a>
              <a href="https://linkedin.com/in/yash-sadhu" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">💼 yash-sadhu</a>
            </div>
             <p className="text-xs mt-8 opacity-70">© 2025 Yashkumar Sadhu. Crafted with passion and creativity.</p>
          </div>
        )
      },
    ];
  }, [curvePoints]);

  // --- CLOUDS DEFINITION ---
  const clouds = useMemo(
    () => [
      // You can add many more clouds here to fill the scene
      { position: new Vector3(-3.5, -3.2, -7) },
      { position: new Vector3(3.5, -4, -10) },
      { scale: [4, 4, 4], position: new Vector3(-18, 0.2, -68), rotation: new Euler(-Math.PI / 5, Math.PI / 6, 0) },
      { scale: [2.5, 2.5, 2.5], position: new Vector3(10, -1.2, -52) },
      { scale: [4, 4, 4], position: new Vector3(curvePoints[1].x + 10, curvePoints[1].y - 4, curvePoints[1].z + 64) },
      { scale: [3, 3, 3], position: new Vector3(curvePoints[1].x - 20, curvePoints[1].y + 4, curvePoints[1].z + 28), rotation: new Euler(0, Math.PI / 7, 0) },
      { scale: [3, 3, 3], position: new Vector3(curvePoints[2].x + 6, curvePoints[2].y - 7, curvePoints[2].z + 50) },
      { scale: [2, 2, 2], position: new Vector3(curvePoints[2].x - 2, curvePoints[2].y + 4, curvePoints[2].z - 26) },
      { scale: [4, 4, 4], position: new Vector3(curvePoints[3].x - 20, curvePoints[3].y - 5, curvePoints[3].z - 8), rotation: new Euler(Math.PI, 0, Math.PI / 5) },
      { scale: [5, 5, 5], position: new Vector3(curvePoints[3].x + 0, curvePoints[3].y - 5, curvePoints[3].z - 98), rotation: new Euler(0, Math.PI / 3, 0) },
      { scale: [3, 3, 3], position: new Vector3(curvePoints[4].x + 24, curvePoints[4].y - 6, curvePoints[4].z - 42), rotation: new Euler(Math.PI / 4, 0, Math.PI / 5) },
      { scale: [3, 3, 3], position: new Vector3(curvePoints[7].x - 12, curvePoints[7].y + 5, curvePoints[7].z + 120), rotation: new Euler(Math.PI / 4, Math.PI / 6, 0) },
    ],
    [curvePoints]
  );

  // --- LINE SHAPE ---
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);
    return shape;
  }, []);

  // --- REFS & HOOKS ---
  const cameraGroup = useRef();
  const cameraRail = useRef();
  const airplane = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);
  const tl = useRef();
  const backgroundColors = useRef({
    colorA: "#3535cc",
    colorB: "#abaadd",
  });

  // --- ANIMATION TIMELINE ---
  useLayoutEffect(() => {
    tl.current = gsap.timeline();

    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#6f35cc",
      colorB: "#ffad30",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#424242",
      colorB: "#ffcc00",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#81318b",
      colorB: "#55ab8f",
    });

    tl.current.pause();
  }, []);

  // --- FRAME LOOP ---
  useFrame((state, delta) => {
    // SCROLL OFFSET
    const scrollOffset = Math.max(0, scroll.offset);

    // CAMERA RAIL & FRICTION
    let friction = 1;
    let resetCameraRail = true;
    
    textSections.forEach((section) => {
      const distance = section.position.distanceTo(cameraGroup.current.position);
      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new Vector3(
          (1 - distance / FRICTION_DISTANCE) * section.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta * 2); // Faster lerp
        resetCameraRail = false;
      }
    });

    if (resetCameraRail) {
      const targetCameraRailPosition = new Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    // LERPED SCROLL
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    // CAMERA MOVEMENT
    const curPoint = curve.getPoint(lerpedScrollOffset);
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );
    const currentLookAt = cameraGroup.current.getWorldDirection(new THREE.Vector3());
    const targetLookAt = new THREE.Vector3().subVectors(curPoint, lookAtPoint).normalize();
    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(cameraGroup.current.position.clone().add(lookAt));

    // AIRPLANE ROTATION
    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);
    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));
    tangent.applyAxisAngle(new THREE.Vector3(0, 1, 0), -nonLerpLookAt.rotation.y);

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;
    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4;
    angleDegrees = Math.max(Math.min(angleDegrees, AIRPLANE_MAX_ANGLE), -AIRPLANE_MAX_ANGLE);
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

    // FADE SHADER UPDATE
    if (state.camera) {
        state.scene.traverse((obj) => {
            if (obj.material && obj.material.onBeforeCompile === fadeOnBeforeCompile && obj.material.uniforms && obj.material.uniforms.uOrigin) {
                obj.material.uniforms.uOrigin.value.copy(cameraGroup.current.position);
            }
        });
    }
  });


  // --- JSX ---
  return (
    <>
      <directionalLight position={[0, 3, 1]} intensity={0.2} />
      <ambientLight intensity={0.5} />
      
      <group ref={cameraGroup}>
        <Background backgroundColors={backgroundColors} />
        <group ref={cameraRail}>
          <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        </group>
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Airplane
              rotation-y={Math.PI / 2}
              scale={[0.2, 0.2, 0.2]}
              position-y={0.1}
            />
          </Float>
        </group>
      </group>

      {/* TEXT SECTIONS */}
      {textSections.map((section, index) => (
        <group position={section.position} key={index}>
            <Html transform center>
                {section.content}
            </Html>
        </group>
      ))}

      {/* USER IMAGE */}
      <Image
        url="https://i.ibb.co/Dg7S1FYb/Screenshot-2025-08-06-092707.png"
        scale={[8, 8]}
        position={[-3, 0, -12]}
        transparent
        opacity={0.8}
      />

      {/* LINE */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"white"}
            transparent
            opacity={0.7}
            envMapIntensity={2}
            onBeforeCompile={fadeOnBeforeCompile}
          />
        </mesh>
      </group>

      {/* CLOUDS */}
      {clouds.map((cloud, index) => (
         <Cloud 
            key={index}
            {...cloud}
            // Use the fade shader for clouds too
            onBeforeCompile={fadeOnBeforeCompile}
            opacity={0.8}
         />
      ))}
    </>
  );
};
