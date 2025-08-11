import { Float, Html, PerspectiveCamera, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";
import { Airplane } from "./Airplane";
import { Background } from "./Background";
import { Cloud } from "./Cloud";
import { TextSection } from "./TextSection";
import LinksPage from "./LinksPage";

const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 42;

export const Experience = () => {
  const [showLinksPage, setShowLinksPage] = useState(false);

  if (showLinksPage) {
    return <LinksPage />;
  }

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
  }, []);

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new Vector3(curvePoints[1].x - 3, curvePoints[1].y, curvePoints[1].z),
        title: "Hi, I'm Yashkumar Sadhu",
        subtitle: `Creative developer and storyteller.\nI craft digital experiences.\nI blend innovation with narrative.`,
      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(curvePoints[2].x + 2, curvePoints[2].y, curvePoints[2].z),
        title: "Featured Projects",
        subtitle: `Turning ideas into impactful digital solutions.`,
        links: [
          { text: "📖 Web Application: NeedItBuildIt", url: "https://needitbuildit.site/" },
          { text: "✨ Creative Portfolio", url: "https://drive.google.com/drive/folders/1zHvTX9ayMYKXl8AjZApwklEWbsIESgAI" }
        ]
      },
      {
        cameraRailDist: -1,
        position: new Vector3(curvePoints[3].x - 3, curvePoints[3].y, curvePoints[3].z),
        title: "Fun Experiments",
        subtitle: `Exploring human experience with interactive creations.`,
        links: [
          { text: "📊 Life Visualization", url: "https://tubular-begonia-4c5989.netlify.app/" },
          { text: "📱 BuzzLoop Demo", url: "https://eclectic-sunshine-4f0f7e.netlify.app/" }
        ]
      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(curvePoints[4].x + 3.5, curvePoints[4].y, curvePoints[4].z - 12),
        title: "Let's Connect",
        subtitle: `Ready to create something amazing?`,
        links: [
          { text: "📧 Email: yashsadhu1605@gmail.com", url: "mailto:yashsadhu1605@gmail.com" },
          { text: "𝕏 Twitter: @yashsadhu09", url: "https://x.com/yashsadhu09" },
          { text: "💼 LinkedIn: yash-sadhu", url: "https://linkedin.com/in/yash-sadhu" }
        ]
      },
    ];
  }, []);

  const clouds = useMemo(
    () => [
      { position: new Vector3(-3.5, -3.2, -7) },
      { position: new Vector3(3.5, -4, -10) },
      { scale: new Vector3(4, 4, 4), position: new Vector3(-18, 0.2, -68), rotation: new Euler(-Math.PI / 5, Math.PI / 6, 0) },
      { scale: new Vector3(2.5, 2.5, 2.5), position: new Vector3(10, -1.2, -52) },
    ],
    []
  );

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);
    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);
  const airplane = useRef();
  const tl = useRef();
  const backgroundColors = useRef({ colorA: "#3535cc", colorB: "#abaadd" });

  useFrame((_state, delta) => {
    const scrollOffset = Math.max(0, scroll.offset);
    let friction = 1;
    let resetCameraRail = true;
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(cameraGroup.current.position);
      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new Vector3((1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist, 0, 0);
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    let lerpedScrollOffset = THREE.MathUtils.lerp(lastScroll.current, scrollOffset, delta * friction);
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);
    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const curPoint = curve.getPoint(lerpedScrollOffset);
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    const lookAtPoint = curve.getPoint(Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1));
    const currentLookAt = cameraGroup.current.getWorldDirection(new THREE.Vector3());
    const targetLookAt = new THREE.Vector3().subVectors(curPoint, lookAtPoint).normalize();
    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(cameraGroup.current.position.clone().add(lookAt));

    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);
    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));
    tangent.applyAxisAngle(new THREE.Vector3(0, 1, 0), -nonLerpLookAt.rotation.y);

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;
    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4;
    if (angleDegrees < 0) angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    if (angleDegrees > 0) angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(airplane.current.rotation.x, airplane.current.rotation.y, angle)
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
  });

  useLayoutEffect(() => {
    tl.current = gsap.timeline();
    tl.current.to(backgroundColors.current, { duration: 1, colorA: "#6f35cc", colorB: "#ffad30" });
    tl.current.to(backgroundColors.current, { duration: 1, colorA: "#424242", colorB: "#ffcc00" });
    tl.current.to(backgroundColors.current, { duration: 1, colorA: "#81318b", colorB: "#55ab8f" });
    tl.current.pause();
  }, []);

  return (
    <>
      {/* Top-right link button */}
      <Html position={[0, 2, 0]} style={{ position: "fixed", top: "20px", right: "20px" }}>
        <button 
          onClick={() => setShowLinksPage(true)} 
          style={{ 
            padding: "10px 16px", 
            background: "linear-gradient(45deg, #667eea, #764ba2)", 
            color: "white", 
            border: "none", 
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}
        >
          Links
        </button>
      </Html>

      <directionalLight position={[0, 3, 1]} intensity={0.1} />
      <group ref={cameraGroup}>
        <Background backgroundColors={backgroundColors} />
        <group ref={cameraRail}>
          <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        </group>
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Airplane rotation-y={Math.PI / 2} scale={[0.2, 0.2, 0.2]} position-y={0.1} />
          </Float>
        </group>
      </group>

      {textSections.map((textSection, index) => (
        <TextSection {...textSection} key={index} />
      ))}

      {/* End of path link button */}
      <Html position={[0, -1, curvePoints[curvePoints.length - 1].z]}>
        <button 
          onClick={() => setShowLinksPage(true)} 
          style={{ 
            padding: "12px 20px", 
            background: "linear-gradient(45deg, #667eea, #764ba2)", 
            color: "white", 
            border: "none", 
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}
        >
          View All Links
        </button>
      </Html>

      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[shape, { steps: LINE_NB_POINTS, bevelEnabled: false, extrudePath: curve }]}
          />
          <meshStandardMaterial
            color={"white"}
            opacity={1}
            transparent
            envMapIntensity={2}
            onBeforeCompile={fadeOnBeforeCompile}
          />
        </mesh>
      </group>

      {clouds.map((cloud, index) => (
        <Cloud {...cloud} key={index} />
      ))}
    </>
  );
};
