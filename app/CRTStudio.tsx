"use client";

import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, Material, Texture } from "three";

const channels = [
  {
    id: "3qmLsiSIkbA",
    label: "Film 01",
    description: "Selected process film",
  },
  {
    id: "omSxURLrWiI",
    label: "Short 02",
    description: "Studio fragment",
  },
];

export default function CRTStudio() {
  const canvasMount = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [channel, setChannel] = useState(0);
  const [webglReady, setWebglReady] = useState(false);
  const [embedOrigin, setEmbedOrigin] = useState("");

  useEffect(() => {
    setEmbedOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let disposed = false;
    let destroy = () => { };

    void (async () => {
      const mount = canvasMount.current;
      if (disposed || !mount) return;

      const probe = document.createElement("canvas");
      const supportsWebGL = Boolean(
        probe.getContext("webgl2") || probe.getContext("webgl"),
      );
      if (!supportsWebGL) return;

      const THREE = await import("three");
      const { RoundedBoxGeometry } = await import(
        "three/examples/jsm/geometries/RoundedBoxGeometry.js"
      );

      if (disposed) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
      camera.position.set(0.28, 0.18, 8.45);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);
      setWebglReady(true);

      const geometries: BufferGeometry[] = [];
      const materials: Material[] = [];
      const textures: Texture[] = [];

      const rememberTexture = <T extends Texture,>(texture: T) => {
        textures.push(texture);
        return texture;
      };

      const rememberGeometry = <T extends BufferGeometry,>(geometry: T) => {
        geometries.push(geometry);
        return geometry;
      };
      const rememberMaterial = <T extends Material,>(material: T) => {
        materials.push(material);
        return material;
      };

      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 48;
      textureCanvas.height = 48;

      const textureContext = textureCanvas.getContext("2d");

      if (textureContext) {

        textureContext.fillStyle = "#c8c5bc";
        textureContext.fillRect(0, 0, 48, 48);

        for (let index = 0; index < 240; index += 1) {
          const lightness = 135 + Math.floor(Math.random() * 90);
          const alpha = 0.08 + Math.random() * 0.2;

          textureContext.fillStyle =
            `rgba(${lightness}, ${lightness}, ${lightness - 5}, ${alpha})`;

          textureContext.fillRect(
            Math.floor(Math.random() * 48),
            Math.floor(Math.random() * 48),
            Math.random() > 0.75 ? 2 : 1,
            1,
          );
        }

        for (let index = 0; index < 14; index += 1) {
          const y = Math.floor(Math.random() * 48);
          const x = Math.floor(Math.random() * 34);

          textureContext.fillStyle =
            Math.random() > 0.5
              ? "rgba(255,255,245,.2)"
              : "rgba(55,52,48,.16)";

          textureContext.fillRect(
            x,
            y,
            5 + Math.floor(Math.random() * 14),
            1,
          );
        }
      }

      const casingTexture = rememberTexture(
        new THREE.CanvasTexture(textureCanvas),
      );

      casingTexture.colorSpace = THREE.SRGBColorSpace;
      casingTexture.wrapS = THREE.RepeatWrapping;
      casingTexture.wrapT = THREE.RepeatWrapping;
      casingTexture.repeat.set(4, 3);

      casingTexture.magFilter = THREE.NearestFilter;
      casingTexture.minFilter = THREE.NearestFilter;
      casingTexture.generateMipmaps = false;
      casingTexture.needsUpdate = true;

      const bodyMaterial = rememberMaterial(
        new THREE.MeshStandardMaterial({
          color: 0xd8d3c7,
          map: casingTexture,

          metalness: 0.32,
          roughness: 0.52,

          bumpMap: casingTexture,
          bumpScale: 0.018,
        }),
      );
      const edgeMaterial = rememberMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x292a2a,
          roughness: 0.58,
          metalness: 0.14,
        }),
      );
      const slotMaterial = rememberMaterial(
        new THREE.MeshStandardMaterial({ color: 0x77766f, roughness: 0.9 }),
      );
      const blueMaterial = rememberMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x285cff,
          emissive: 0x173aab,
          emissiveIntensity: 0.55,
          roughness: 0.38,
        }),
      );

      const television = new THREE.Group();
      television.rotation.x = -0.035;
      television.rotation.y = -0.48;
      scene.add(television);

      const body = new THREE.Mesh(
        rememberGeometry(new RoundedBoxGeometry(4.8, 3.7, 2.7, 6, 0.2)),
        bodyMaterial,
      );
      body.position.set(0, 0.02, -0.36);
      body.castShadow = true;
      body.receiveShadow = true;
      television.add(body);

      const bezel = new THREE.Mesh(
        rememberGeometry(new RoundedBoxGeometry(3.62, 2.22, 0.24, 5, 0.15)),
        edgeMaterial,
      );
      bezel.position.set(-0.08, 0.47, 1.03);
      bezel.castShadow = true;
      television.add(bezel);

      const controlPanel = new THREE.Mesh(
        rememberGeometry(new RoundedBoxGeometry(3.82, 0.78, 0.2, 4, 0.07)),
        bodyMaterial,
      );
      controlPanel.position.set(-0.06, -1.03, 1.04);
      television.add(controlPanel);

      const cassetteSlot = new THREE.Mesh(
        rememberGeometry(new RoundedBoxGeometry(1.55, 0.28, 0.06, 3, 0.025)),
        edgeMaterial,
      );
      cassetteSlot.position.set(-0.73, -0.93, 1.17);
      television.add(cassetteSlot);

      const discSlot = new THREE.Mesh(
        rememberGeometry(new RoundedBoxGeometry(0.92, 0.22, 0.055, 3, 0.025)),
        edgeMaterial,
      );
      discSlot.position.set(0.88, -0.93, 1.17);
      television.add(discSlot);

      for (const side of [-1, 1]) {
        for (let index = 0; index < 12; index += 1) {
          const speakerSlot = new THREE.Mesh(
            rememberGeometry(new THREE.BoxGeometry(0.035, 0.11, 0.055)),
            slotMaterial,
          );
          speakerSlot.position.set(side * 2.05, 0.99 - index * 0.11, 1.12);
          television.add(speakerSlot);
        }
      }

      for (let index = 0; index < 10; index += 1) {
        const button = new THREE.Mesh(
          rememberGeometry(new THREE.CylinderGeometry(0.055, 0.055, 0.055, 18)),
          slotMaterial,
        );
        button.rotation.x = Math.PI / 2;
        button.position.set(-0.9 + index * 0.19, -1.29, 1.18);
        television.add(button);
      }

      for (let index = 0; index < 2; index += 1) {
        const dial = new THREE.Mesh(
          rememberGeometry(new THREE.CylinderGeometry(0.13, 0.13, 0.11, 32)),
          index === 1 ? blueMaterial : edgeMaterial,
        );
        dial.rotation.x = Math.PI / 2;
        dial.position.set(1.45 + index * 0.35, -1.29, 1.19);
        dial.castShadow = true;
        television.add(dial);
      }

      for (let index = 0; index < 8; index += 1) {
        const vent = new THREE.Mesh(
          rememberGeometry(new THREE.BoxGeometry(0.055, 0.5, 0.035)),
          slotMaterial,
        );
        vent.position.set(-0.46 + index * 0.14, 1.91, -0.38);
        vent.rotation.x = Math.PI / 2;
        vent.rotation.z = -0.34;
        television.add(vent);
      }

      const footGeometry = rememberGeometry(
        new RoundedBoxGeometry(0.7, 0.22, 0.62, 3, 0.08),
      );
      for (const x of [-1.45, 1.45]) {
        const foot = new THREE.Mesh(footGeometry, edgeMaterial);
        foot.position.set(x, -1.92, -0.56);
        television.add(foot);
      }

      const floorMaterial = rememberMaterial(
        new THREE.ShadowMaterial({ color: 0x111111, opacity: 0.15 }),
      );
      const floor = new THREE.Mesh(
        rememberGeometry(new THREE.PlaneGeometry(12, 10)),
        floorMaterial,
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -2.04;
      floor.receiveShadow = true;
      scene.add(floor);

      scene.add(new THREE.HemisphereLight(0xf7f5ed, 0x39435f, 2.15));
      const keyLight = new THREE.DirectionalLight(0xfff5e2, 3.5);
      keyLight.position.set(-4.5, 6, 6);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);

      const blueLight = new THREE.PointLight(0x285cff, 10, 11, 2);
      blueLight.position.set(3.6, 0.8, 4.2);
      scene.add(blueLight);

      const render = () => renderer.render(scene, camera);
      const resize = () => {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        render();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      resize();

      const staticMode = window.matchMedia(
        "(prefers-reduced-motion: reduce), (max-width: 600px)",
      ).matches;
      let frame = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        const elapsed = clock.getElapsedTime();
        television.position.y = Math.sin(elapsed * 0.7) * 0.025;
        television.rotation.z = Math.sin(elapsed * 0.42) * 0.002;
        render();
        frame = requestAnimationFrame(animate);
      };
      if (!staticMode) animate();

      destroy = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        textures.forEach((texture) => texture.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch(() => {
      if (!disposed) setWebglReady(false);
    });

    return () => {
      disposed = true;
      destroy();
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!stage.current || window.matchMedia("(max-width: 600px)").matches) return;
    const bounds = stage.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.current.style.setProperty("--tv-rotate-y", `${x * 6}deg`);
    stage.current.style.setProperty("--tv-rotate-x", `${y * -5}deg`);
  };

  const resetTilt = () => {
    stage.current?.style.setProperty("--tv-rotate-y", "0deg");
    stage.current?.style.setProperty("--tv-rotate-x", "0deg");
  };

  return (
    <div className="crt-studio">
      <div
        className={`crt-stage ${webglReady ? "is-webgl-ready" : "is-fallback"}`}
        ref={stage}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <div className="crt-fallback-shell" aria-hidden="true">
          <div className="crt-fallback-bezel" />
          <div className="crt-fallback-panel">
            <span>YF / CRT 01</span>
            <i /><i /><i /><i /><i /><i /><i /><i />
            <b /><b />
          </div>
          <div className="crt-fallback-feet"><i /><i /></div>
        </div>
        <div className="crt-canvas" ref={canvasMount} aria-hidden="true" />
        <div className="crt-screen">

          <iframe
            key={channels[channel].id}
            src={`https://www.youtube.com/embed/${channels[channel].id}?autoplay=1&mute=1&playsinline=1&rel=0`}
            title={`Yufei Jiao — ${channels[channel].label}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <div className="crt-scanlines" aria-hidden="true" />
          <div className="crt-glare" aria-hidden="true" />
        </div>

        <div className="crt-channel-controls" aria-label="Choose film channel">
          {channels.map((item, index) => (
            <button
              type="button"
              className={channel === index ? "is-active" : ""}
              onClick={() => setChannel(index)}
              aria-pressed={channel === index}
              key={item.id}
            >
              0{index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="crt-meta" aria-live="polite">
        <span>Channel 0{channel + 1}</span>
        <p>{channels[channel].description}</p>
        <span>Move to inspect · Press play</span>
      </div>
    </div>
  );
}
