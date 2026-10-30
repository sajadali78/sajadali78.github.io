import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface Machine3DProps {
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  explodeAmount: number; // 0 to 1
  fluxIntensity: number; // 0 to 1
  showMeshWireframe: boolean;
  showFluxLines: boolean;
  skewEnabled: boolean;
  operatingMode: 'synchronous' | 'vernier';
  cutawayEnabled: boolean;
  rotorSpeedMultiplier: number;
  onPartSelect?: (partInfo: { name: string; spec: string; detail: string } | null) => void;
}

// Pre-allocated scratch math objects outside the render loop (Zero GC)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _ironBase = new THREE.Color(0x36424a);
const _fluxStops = [
  new THREE.Color(0x1d3a52),
  new THREE.Color(0x2f7f86),
  new THREE.Color(0x8fb27a),
  new THREE.Color(0xe3a64b),
  new THREE.Color(0xe2583a),
];

function sampleFluxColor(v: number, intensity: number, out: THREE.Color) {
  const clamped = Math.max(0, Math.min(1, v));
  const scaled = clamped * (fluxStopsCount - 1);
  const idx = Math.min(fluxStopsCount - 2, Math.floor(scaled));
  const frac = scaled - idx;
  out.copy(_fluxStops[idx]).lerp(_fluxStops[idx + 1], frac);
  out.lerp(_ironBase, 1 - intensity);
}
const fluxStopsCount = _fluxStops.length;

// Procedural Lamination Bump Texture (0.35mm M270-35A Electrical Steel Stack)
function createLaminationTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 2) {
    const shade = y % 4 === 0 ? 155 : 100;
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 256, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 12);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

// Procedural Soft Radial Contact Shadow Texture
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
  grad.addColorStop(0, 'rgba(5, 8, 10, 0.82)');
  grad.addColorStop(0.55, 'rgba(8, 12, 15, 0.42)');
  grad.addColorStop(1, 'rgba(18, 24, 28, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural Drafting Floor Grid Texture
function createDraftingGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#12181c';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = 'rgba(93, 107, 115, 0.22)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(208, 134, 74, 0.24)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

// Helper to build an extruded annular sector (tooth/yoke segment or magnet arc)
function createSectorGeometry(
  rInner: number,
  rOuter: number,
  angleSpan: number,
  depth: number,
  bevel = 0.012,
  curveSegments = 12
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const half = angleSpan / 2;
  shape.absarc(0, 0, rOuter, -half, half, false);
  shape.absarc(0, 0, rInner, half, -half, true);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments,
  });
  // Center along Z
  geo.translate(0, 0, -depth / 2);
  return geo;
}

export const MachineCanvas3D: React.FC<Machine3DProps> = (props) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const propsRef = useRef<Machine3DProps>(props);
  propsRef.current = props;

  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Hardware vs. Software WebGL detection per Three.js skill directive
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    const handleContextRestored = () => {
      setWebglFallback(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    // 2. Scene, Fog & Studio Environment Reflection (RoomEnvironment)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x12181c);
    scene.fog = new THREE.FogExp2(0x12181c, 0.042);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(...propsRef.current.cameraPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.6;
    controls.maxDistance = 11.0;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.target.set(...propsRef.current.cameraTarget);

    let userInteractingWithCamera = false;
    let cameraGoalActive = true;

    controls.addEventListener('start', () => {
      userInteractingWithCamera = true;
      cameraGoalActive = false;
    });
    controls.addEventListener('end', () => {
      userInteractingWithCamera = false;
    });

    // 4. Balanced 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x9bc0d9, 0x182228, 0.85);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1db, 2.3);
    keyLight.position.set(5.5, 7.5, 6.0);
    keyLight.castShadow = !isSoftwareGl;
    const d = 3.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 1.0;
    keyLight.shadow.camera.far = 20.0;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd0864a, 1.35);
    rimLight.position.set(-5.0, 3.5, -5.0);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x6b9bb8, 0.75);
    fillLight.position.set(-4.0, -2.0, 4.5);
    scene.add(fillLight);

    // 5. Procedural Textures & PBR Materials
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const lamTexture = createLaminationTexture(maxAniso);
    const shadowTexture = createContactShadowTexture();
    const gridTexture = createDraftingGridTexture(maxAniso);

    const disposables: { dispose: () => void }[] = [lamTexture, shadowTexture, gridTexture];

    // Ground plane & soft contact shadow grounding at y = -2.15
    const floorY = -2.15;
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      map: gridTexture,
      roughness: 0.85,
      metalness: 0.15,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = floorY;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const shadowGeo = new THREE.PlaneGeometry(5.6, 5.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = floorY + 0.02;
    scene.add(shadowPlane);

    disposables.push(floorGeo, floorMat, shadowGeo, shadowMat);

    // =========================================================================
    // COMPOSITE 10-PART PROCEDURAL DMDS-HRSVM MACHINE MODEL
    // World scale: 1 unit = 100 mm (so Stack Length = 1.0 unit, Outer Radius = 1.72 units)
    // =========================================================================
    const machineRoot = new THREE.Group();
    scene.add(machineRoot);

    const stackLen = 1.05; // 100 mm stack length
    const NS = 24; // Outer stator slots
    const NR = 24; // Hybrid rotor teeth
    const NPM = 12; // Surface-inset PMs
    const NFS = 6; // Rotor field winding slots
    const NIS = 12; // Inner stator slots

    // Materials with varied roughness & metalness across adjacent parts (>= 0.25 delta)
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1c252b,
      roughness: 0.68,
      metalness: 0.72,
    });
    const housingMat = new THREE.MeshStandardMaterial({
      color: 0x263138,
      roughness: 0.42,
      metalness: 0.84,
      bumpMap: lamTexture,
      bumpScale: 0.004,
    });
    const statorIronMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Tinted per-instance for B-field flux heatmap
      roughness: 0.26,
      metalness: 0.88,
      bumpMap: lamTexture,
      bumpScale: 0.008,
    });
    const rotorIronMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.24,
      metalness: 0.9,
      bumpMap: lamTexture,
      bumpScale: 0.008,
    });
    const innerStatorMat = new THREE.MeshStandardMaterial({
      color: 0x45545e,
      roughness: 0.3,
      metalness: 0.86,
      bumpMap: lamTexture,
      bumpScale: 0.006,
    });
    const copperMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // Tinted per phase A/B/C
      roughness: 0.18,
      metalness: 0.94,
      clearcoat: 0.45,
      clearcoatRoughness: 0.15,
    });
    const linerMat = new THREE.MeshStandardMaterial({
      color: 0xd8d0c1,
      roughness: 0.75,
      metalness: 0.08,
    });
    const pmNorthMat = new THREE.MeshPhysicalMaterial({
      color: 0xb54b3c,
      roughness: 0.32,
      metalness: 0.65,
      clearcoat: 0.3,
    });
    const pmSouthMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b6687,
      roughness: 0.32,
      metalness: 0.65,
      clearcoat: 0.3,
    });
    const shaftMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8d2d6,
      roughness: 0.14,
      metalness: 0.96,
      anisotropy: 0.75,
    });
    const bronzeBearingMat = new THREE.MeshStandardMaterial({
      color: 0xc29353,
      roughness: 0.28,
      metalness: 0.9,
    });

    disposables.push(
      pedestalMat,
      housingMat,
      statorIronMat,
      rotorIronMat,
      innerStatorMat,
      copperMat,
      linerMat,
      pmNorthMat,
      pmSouthMat,
      shaftMat,
      bronzeBearingMat
    );

    const clickableMeshes: THREE.Object3D[] = [];

    // PART 1: Precision Testbed Pedestal & Cradle Base (flush with floorY = -2.15)
    const pedestalGroup = new THREE.Group();
    const basePlateGeo = new THREE.BoxGeometry(3.5, 0.16, 2.2);
    const basePlate = new THREE.Mesh(basePlateGeo, pedestalMat);
    basePlate.position.set(0, floorY + 0.08, 0);
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    pedestalGroup.add(basePlate);

    const saddleShape = new THREE.Shape();
    saddleShape.moveTo(-1.45, floorY + 0.16);
    saddleShape.lineTo(1.45, floorY + 0.16);
    saddleShape.lineTo(1.25, -1.55);
    saddleShape.absarc(0, 0, 1.9, -Math.PI * 0.28, -Math.PI * 0.72, true);
    saddleShape.lineTo(-1.25, -1.55);
    saddleShape.closePath();
    const saddleGeo = new THREE.ExtrudeGeometry(saddleShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    });
    saddleGeo.translate(0, 0, -0.11);

    const frontSaddle = new THREE.Mesh(saddleGeo, pedestalMat);
    frontSaddle.position.z = 0.42;
    frontSaddle.castShadow = true;
    frontSaddle.receiveShadow = true;
    const rearSaddle = new THREE.Mesh(saddleGeo, pedestalMat);
    rearSaddle.position.z = -0.42;
    rearSaddle.castShadow = true;
    rearSaddle.receiveShadow = true;
    pedestalGroup.add(frontSaddle, rearSaddle);
    machineRoot.add(pedestalGroup);
    disposables.push(basePlateGeo, saddleGeo);

    // PART 2: Finned Outer Housing Shell (3/4 cutaway arc so upper-right quadrant reveals interior)
    const housingGroup = new THREE.Group();
    const housingArcShape = new THREE.Shape();
    const cutStart = Math.PI * 0.42; // Cutaway top-right quadrant (0 to 75 deg)
    const cutEnd = Math.PI * 1.98;
    housingArcShape.absarc(0, 0, 1.9, cutStart, cutEnd, false);
    housingArcShape.absarc(0, 0, 1.72, cutEnd, cutStart, true);
    housingArcShape.closePath();
    const housingShellGeo = new THREE.ExtrudeGeometry(housingArcShape, {
      depth: stackLen + 0.14,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 2,
      curveSegments: 48,
    });
    housingShellGeo.translate(0, 0, -(stackLen + 0.14) / 2);
    const housingShell = new THREE.Mesh(housingShellGeo, housingMat);
    housingShell.castShadow = true;
    housingShell.receiveShadow = true;
    housingShell.userData = {
      name: 'Finned Aluminum Housing',
      spec: 'OD 424 mm · 40 Axial Fins · Cutaway View',
      detail: 'Encloses the 24-slot outer stator stack and conducts stator core heat to ambient air.',
    };
    clickableMeshes.push(housingShell);
    housingGroup.add(housingShell);

    // 32 Cooling Fins via InstancedMesh
    const finGeo = new THREE.BoxGeometry(0.045, 0.22, stackLen + 0.12);
    const finCount = 31;
    const finInstanced = new THREE.InstancedMesh(finGeo, housingMat, finCount);
    let finIdx = 0;
    for (let i = 0; i < 40; i++) {
      const a = (i * Math.PI * 2) / 40;
      if (a >= cutStart && a <= cutEnd && finIdx < finCount) {
        _dummy.position.set(Math.cos(a) * 2.0, Math.sin(a) * 2.0, 0);
        _dummy.rotation.set(0, 0, a - Math.PI / 2);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        finInstanced.setMatrixAt(finIdx++, _dummy.matrix);
      }
    }
    finInstanced.instanceMatrix.needsUpdate = true;
    finInstanced.computeBoundingSphere();
    housingGroup.add(finInstanced);
    machineRoot.add(housingGroup);
    disposables.push(housingShellGeo, finGeo);

    // PART 3: Outer Stator Laminated Core (24 Tooth/Yoke Sectors)
    const outerStatorGroup = new THREE.Group();
    const osYokeGeo = createSectorGeometry(1.6, 1.72, (Math.PI * 2) / NS + 0.005, stackLen, 0.01, 6);
    const osToothGeo = createSectorGeometry(1.21, 1.61, ((Math.PI * 2) / NS) * 0.46, stackLen, 0.008, 4);

    const osYokeInstanced = new THREE.InstancedMesh(osYokeGeo, statorIronMat, NS);
    const osToothInstanced = new THREE.InstancedMesh(osToothGeo, statorIronMat, NS);
    osYokeInstanced.castShadow = true;
    osYokeInstanced.receiveShadow = true;
    osToothInstanced.castShadow = true;
    osToothInstanced.receiveShadow = true;

    for (let i = 0; i < NS; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / NS;
      _dummy.position.set(0, 0, 0);
      _dummy.rotation.set(0, 0, a);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      osYokeInstanced.setMatrixAt(i, _dummy.matrix);
      osToothInstanced.setMatrixAt(i, _dummy.matrix);
      osYokeInstanced.setColorAt(i, _ironBase);
      osToothInstanced.setColorAt(i, _ironBase);
    }
    osYokeInstanced.instanceMatrix.needsUpdate = true;
    osToothInstanced.instanceMatrix.needsUpdate = true;
    osYokeInstanced.computeBoundingSphere();
    osToothInstanced.computeBoundingSphere();

    osToothInstanced.userData = {
      name: 'Outer Stator Laminated Core (24 Slots)',
      spec: 'OD 344 mm · ID 242 mm · 100 mm Stack',
      detail: '24-slot M270-35A silicon steel core carrying the primary 3-phase double-layer winding.',
    };
    clickableMeshes.push(osToothInstanced, osYokeInstanced);
    outerStatorGroup.add(osYokeInstanced, osToothInstanced);

    // PART 4: Outer Stator 24 Double-Layer Copper Coils, End-Windings & Slot Liners
    const outerCoilGeo = createSectorGeometry(1.25, 1.57, ((Math.PI * 2) / NS) * 0.44, stackLen + 0.16, 0.012, 4);
    const outerCoilInstanced = new THREE.InstancedMesh(outerCoilGeo, copperMat, NS);
    const wedgeGeo = createSectorGeometry(1.215, 1.24, ((Math.PI * 2) / NS) * 0.5, stackLen + 0.02, 0.003, 3);
    const wedgeInstanced = new THREE.InstancedMesh(wedgeGeo, linerMat, NS);

    const phaseColors = [
      new THREE.Color(0xd0864a), // Phase A: Enameled Copper
      new THREE.Color(0xb8a06a), // Phase B: Warm Brass-Gold
      new THREE.Color(0x9b5c3c), // Phase C: Deep Bronze-Copper
    ];

    for (let i = 0; i < NS; i++) {
      const slotAngle = -Math.PI / 2 + ((i + 0.5) * Math.PI * 2) / NS;
      _dummy.position.set(0, 0, 0);
      _dummy.rotation.set(0, 0, slotAngle);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      outerCoilInstanced.setMatrixAt(i, _dummy.matrix);
      wedgeInstanced.setMatrixAt(i, _dummy.matrix);

      const phaseIdx = Math.floor((i % 6) / 2);
      outerCoilInstanced.setColorAt(i, phaseColors[phaseIdx]);
    }
    outerCoilInstanced.instanceMatrix.needsUpdate = true;
    if (outerCoilInstanced.instanceColor) outerCoilInstanced.instanceColor.needsUpdate = true;
    outerCoilInstanced.computeBoundingSphere();
    wedgeInstanced.instanceMatrix.needsUpdate = true;
    wedgeInstanced.computeBoundingSphere();

    outerCoilInstanced.userData = {
      name: '3-Phase Double-Layer Stator Winding',
      spec: '24 Coils · 90% Slot Fill Factor · Nomex Liner & Wedge',
      detail: 'Double-layer distributed winding excited to produce either 2-pole or 4-pole rotating fields.',
    };
    clickableMeshes.push(outerCoilInstanced);
    outerStatorGroup.add(outerCoilInstanced, wedgeInstanced);
    machineRoot.add(outerStatorGroup);
    disposables.push(osYokeGeo, osToothGeo, outerCoilGeo, wedgeGeo);

    // PART 5, 6, 7: Hybrid Rotor Assembly (24 Teeth + 12 Surface-Inset PMs + 6 Field Winding Slots)
    const rotorGroup = new THREE.Group();
    const rotCoreGeo = createSectorGeometry(0.8, 1.11, (Math.PI * 2) / NR + 0.004, stackLen, 0.008, 5);
    const rotToothGeo = createSectorGeometry(1.09, 1.185, ((Math.PI * 2) / NR) * 0.52, stackLen, 0.006, 4);

    const rotCoreInstanced = new THREE.InstancedMesh(rotCoreGeo, rotorIronMat, NR);
    const rotToothInstanced = new THREE.InstancedMesh(rotToothGeo, rotorIronMat, NR);
    rotCoreInstanced.castShadow = true;
    rotToothInstanced.castShadow = true;

    for (let i = 0; i < NR; i++) {
      const a = (i * Math.PI * 2) / NR;
      _dummy.position.set(0, 0, 0);
      _dummy.rotation.set(0, 0, a);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      rotCoreInstanced.setMatrixAt(i, _dummy.matrix);
      rotToothInstanced.setMatrixAt(i, _dummy.matrix);
      rotCoreInstanced.setColorAt(i, _ironBase);
      rotToothInstanced.setColorAt(i, _ironBase);
    }
    rotCoreInstanced.instanceMatrix.needsUpdate = true;
    rotToothInstanced.instanceMatrix.needsUpdate = true;
    rotCoreInstanced.computeBoundingSphere();
    rotToothInstanced.computeBoundingSphere();

    rotCoreInstanced.userData = {
      name: 'Sandwiched Hybrid Rotor Core (24 Teeth)',
      spec: 'OD 237 mm · ID 160 mm · Dual 0.5 mm Airgaps',
      detail: 'Operates in high-speed Synchronous mode and low-speed Vernier magnetic-gearing mode (Zr = Zs + p).',
    };
    clickableMeshes.push(rotCoreInstanced, rotToothInstanced);
    rotorGroup.add(rotCoreInstanced, rotToothInstanced);

    // PART 6: 12 Surface-Inset Permanent Magnets (broken into 5 axial slices to visualize 4° helical skew!)
    const SKEW_SLICES = 5;
    const sliceDepth = stackLen / SKEW_SLICES;
    const pmSpan = ((Math.PI * 2) / NPM) * 0.72;
    const pmSliceGeo = createSectorGeometry(1.11, 1.182, pmSpan, sliceDepth - 0.006, 0.005, 6);

    const pmNorthInstanced = new THREE.InstancedMesh(pmSliceGeo, pmNorthMat, (NPM / 2) * SKEW_SLICES);
    const pmSouthInstanced = new THREE.InstancedMesh(pmSliceGeo, pmSouthMat, (NPM / 2) * SKEW_SLICES);

    pmNorthInstanced.userData = {
      name: 'NdFeB Permanent Magnet Array (North Poles)',
      spec: '12 Poles · 4.0° Helical Skew · 49.6% GA Area Reduction',
      detail: '4° skew suppresses slot harmonic interaction, cutting low-speed Vernier torque ripple from 73% to 27%.',
    };
    pmSouthInstanced.userData = {
      name: 'NdFeB Permanent Magnet Array (South Poles)',
      spec: '12 Poles · 4.0° Helical Skew · 49.6% GA Area Reduction',
      detail: 'Optimized via Genetic Algorithm in Ansys Maxwell to cut magnet volume by nearly 50%.',
    };
    clickableMeshes.push(pmNorthInstanced, pmSouthInstanced);
    rotorGroup.add(pmNorthInstanced, pmSouthInstanced);

    // PART 7: 6 Rotor Harmonic / DC Field Winding Coils
    const rotorFieldCoilGeo = createSectorGeometry(0.85, 1.05, ((Math.PI * 2) / NFS) * 0.24, stackLen + 0.12, 0.01, 4);
    const rotorFieldInstanced = new THREE.InstancedMesh(rotorFieldCoilGeo, copperMat, NFS);
    for (let i = 0; i < NFS; i++) {
      const a = ((i + 0.5) * Math.PI * 2) / NFS;
      _dummy.position.set(0, 0, 0);
      _dummy.rotation.set(0, 0, a);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      rotorFieldInstanced.setMatrixAt(i, _dummy.matrix);
      rotorFieldInstanced.setColorAt(i, phaseColors[i % 2]);
    }
    rotorFieldInstanced.instanceMatrix.needsUpdate = true;
    if (rotorFieldInstanced.instanceColor) rotorFieldInstanced.instanceColor.needsUpdate = true;
    rotorFieldInstanced.computeBoundingSphere();
    rotorGroup.add(rotorFieldInstanced);
    machineRoot.add(rotorGroup);
    disposables.push(rotCoreGeo, rotToothGeo, pmSliceGeo, rotorFieldCoilGeo);

    // PART 8 & 9: Inner Stator Laminated Core (12 Slots) & 12 Inner Excitation/Armature Coils
    const innerStatorGroup = new THREE.Group();
    const isYokeGeo = createSectorGeometry(0.44, 0.54, (Math.PI * 2) / NIS + 0.005, stackLen, 0.008, 5);
    const isToothGeo = createSectorGeometry(0.53, 0.775, ((Math.PI * 2) / NIS) * 0.48, stackLen, 0.006, 4);
    const isCoilGeo = createSectorGeometry(0.55, 0.75, ((Math.PI * 2) / NIS) * 0.44, stackLen + 0.14, 0.01, 4);

    const isYokeInstanced = new THREE.InstancedMesh(isYokeGeo, innerStatorMat, NIS);
    const isToothInstanced = new THREE.InstancedMesh(isToothGeo, innerStatorMat, NIS);
    const isCoilInstanced = new THREE.InstancedMesh(isCoilGeo, copperMat, NIS);

    for (let i = 0; i < NIS; i++) {
      const a = (i * Math.PI * 2) / NIS;
      _dummy.position.set(0, 0, 0);
      _dummy.rotation.set(0, 0, a);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      isYokeInstanced.setMatrixAt(i, _dummy.matrix);
      isToothInstanced.setMatrixAt(i, _dummy.matrix);

      const coilAngle = ((i + 0.5) * Math.PI * 2) / NIS;
      _dummy.rotation.set(0, 0, coilAngle);
      _dummy.updateMatrix();
      isCoilInstanced.setMatrixAt(i, _dummy.matrix);
      isCoilInstanced.setColorAt(i, phaseColors[i % 3]);
    }
    isYokeInstanced.instanceMatrix.needsUpdate = true;
    isToothInstanced.instanceMatrix.needsUpdate = true;
    isCoilInstanced.instanceMatrix.needsUpdate = true;
    if (isCoilInstanced.instanceColor) isCoilInstanced.instanceColor.needsUpdate = true;
    isYokeInstanced.computeBoundingSphere();
    isToothInstanced.computeBoundingSphere();
    isCoilInstanced.computeBoundingSphere();

    isToothInstanced.userData = {
      name: 'Inner Stator Core & Winding (12 Slots)',
      spec: 'OD 155 mm · ID 88 mm · Brushless Excitation',
      detail: 'Stationary inner stator providing brushless harmonic excitation across the 0.5 mm inner airgap.',
    };
    clickableMeshes.push(isToothInstanced, isCoilInstanced);
    innerStatorGroup.add(isYokeInstanced, isToothInstanced, isCoilInstanced);
    machineRoot.add(innerStatorGroup);
    disposables.push(isYokeGeo, isToothGeo, isCoilGeo);

    // PART 10: Stepped Alloy Drive Shaft (LatheGeometry) & Bronze Bearings
    const shaftGroup = new THREE.Group();
    const lathePts = [
      new THREE.Vector2(0.0, -1.05),
      new THREE.Vector2(0.18, -1.05),
      new THREE.Vector2(0.18, -0.72),
      new THREE.Vector2(0.26, -0.72),
      new THREE.Vector2(0.26, 0.72),
      new THREE.Vector2(0.18, 0.72),
      new THREE.Vector2(0.18, 1.15),
      new THREE.Vector2(0.0, 1.15),
    ];
    const shaftGeo = new THREE.LatheGeometry(lathePts, 32);
    shaftGeo.rotateX(Math.PI / 2);
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.castShadow = true;
    shaftMesh.userData = {
      name: 'Stepped Alloy Drive Shaft & Bearings',
      spec: 'Ø 52 mm Core Journal · Precision Keyway',
      detail: 'Transmits mechanical torque from the sandwiched hybrid rotor assembly to the variable-speed load.',
    };
    clickableMeshes.push(shaftMesh);

    const bearingGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.14, 32);
    bearingGeo.rotateX(Math.PI / 2);
    const frontBearing = new THREE.Mesh(bearingGeo, bronzeBearingMat);
    frontBearing.position.z = 0.58;
    const rearBearing = new THREE.Mesh(bearingGeo, bronzeBearingMat);
    rearBearing.position.z = -0.58;
    shaftGroup.add(shaftMesh, frontBearing, rearBearing);
    machineRoot.add(shaftGroup);
    disposables.push(shaftGeo, bearingGeo);

    // PART 11: 3D Airgap Magnetic Flux Loops & FEA Mesh Wireframe Overlay
    const fluxLinesGroup = new THREE.Group();
    const fluxCurveMat = new THREE.LineBasicMaterial({
      color: 0xf2b705,
      transparent: true,
      opacity: 0.85,
    });
    const fluxLoopCount = 12;
    for (let i = 0; i < fluxLoopCount; i++) {
      const baseAngle = (i * Math.PI * 2) / fluxLoopCount;
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= 24; s++) {
        const u = s / 24;
        const theta = baseAngle + Math.sin(u * Math.PI * 2) * 0.22;
        const r = 1.198 + Math.cos(u * Math.PI * 2) * 0.16;
        const z = Math.sin(u * Math.PI) * 0.35 - 0.17;
        pts.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, z));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const loopLine = new THREE.LineLoop(lineGeo, fluxCurveMat);
      fluxLinesGroup.add(loopLine);
      disposables.push(lineGeo);
    }
    fluxLinesGroup.position.z = 0.56;
    machineRoot.add(fluxLinesGroup);
    disposables.push(fluxCurveMat);

    // FEA Triangulation Mesh Overlay (visible in Chapter 5 or when toggled)
    const feaWireGroup = new THREE.Group();
    const feaRingRadii = [0.44, 0.62, 0.78, 0.8, 1.0, 1.185, 1.21, 1.45, 1.72];
    const feaVerts: number[] = [];
    const segs = 48;
    for (let rIdx = 0; rIdx < feaRingRadii.length; rIdx++) {
      const r = feaRingRadii[rIdx];
      for (let s = 0; s < segs; s++) {
        const a1 = (s * Math.PI * 2) / segs;
        const a2 = ((s + 1) * Math.PI * 2) / segs;
        feaVerts.push(Math.cos(a1) * r, Math.sin(a1) * r, 0.55);
        feaVerts.push(Math.cos(a2) * r, Math.sin(a2) * r, 0.55);
        if (rIdx + 1 < feaRingRadii.length) {
          const rNext = feaRingRadii[rIdx + 1];
          const aMid = ((s + 0.5) * Math.PI * 2) / segs;
          feaVerts.push(Math.cos(a1) * r, Math.sin(a1) * r, 0.55);
          feaVerts.push(Math.cos(aMid) * rNext, Math.sin(aMid) * rNext, 0.55);
          feaVerts.push(Math.cos(a2) * r, Math.sin(a2) * r, 0.55);
          feaVerts.push(Math.cos(aMid) * rNext, Math.sin(aMid) * rNext, 0.55);
        }
      }
    }
    const feaGeo = new THREE.BufferGeometry();
    feaGeo.setAttribute('position', new THREE.Float32BufferAttribute(feaVerts, 3));
    const feaMat = new THREE.LineBasicMaterial({
      color: 0xd0864a,
      transparent: true,
      opacity: 0.52,
    });
    const feaLines = new THREE.LineSegments(feaGeo, feaMat);
    feaWireGroup.add(feaLines);
    machineRoot.add(feaWireGroup);
    disposables.push(feaGeo, feaMat);

    // Helper function to update PM 4-degree skew slices
    let currentSkewRad = THREE.MathUtils.degToRad(4.0);
    const updatePmSkewInstances = (skewRad: number) => {
      let nIdx = 0;
      let sIdx = 0;
      for (let i = 0; i < NPM; i++) {
        const baseA = (i * Math.PI * 2) / NPM;
        const isSouth = i % 2 === 1;
        for (let sl = 0; sl < SKEW_SLICES; sl++) {
          const zNorm = sl / (SKEW_SLICES - 1) - 0.5; // -0.5 to +0.5
          const zPos = zNorm * stackLen;
          const twistedA = baseA + zNorm * skewRad;
          _dummy.position.set(0, 0, zPos);
          _dummy.rotation.set(0, 0, twistedA);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          if (isSouth) {
            pmSouthInstanced.setMatrixAt(sIdx++, _dummy.matrix);
          } else {
            pmNorthInstanced.setMatrixAt(nIdx++, _dummy.matrix);
          }
        }
      }
      pmNorthInstanced.instanceMatrix.needsUpdate = true;
      pmSouthInstanced.instanceMatrix.needsUpdate = true;
    };
    updatePmSkewInstances(currentSkewRad);
    pmNorthInstanced.computeBoundingSphere();
    pmSouthInstanced.computeBoundingSphere();

    // Pre-compile shaders on hardware WebGL
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting on Click for Interactive 3D Component Inspection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Ignore orbit drag
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0 && hits[0].object.userData?.name) {
        propsRef.current.onPartSelect?.(hits[0].object.userData as {
          name: string;
          spec: string;
          detail: string;
        });
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Track last camera prop to trigger smooth transition when chapter changes
    let prevCamKey = propsRef.current.cameraPos.join(',') + '|' + propsRef.current.cameraTarget.join(',');

    // 6. Paced Animation Loop (60fps on GPU, fenced afterDraw on software WebGL)
    let frameId = 0;
    let isUnmounted = false;
    const clock = new THREE.Clock();

    let currentExplode = propsRef.current.explodeAmount;
    let currentFlux = propsRef.current.fluxIntensity;
    let rotorAngle = 0;
    let fieldWaveAngle = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isUnmounted) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (isUnmounted) return;
      const dt = Math.min(0.05, clock.getDelta());
      const p = propsRef.current;

      // Detect if target camera preset changed from chapter navigation
      const camKey = p.cameraPos.join(',') + '|' + p.cameraTarget.join(',');
      if (camKey !== prevCamKey) {
        prevCamKey = camKey;
        cameraGoalActive = true;
      }

      // Smoothly damp camera position & OrbitControls target when a preset is active
      if (cameraGoalActive && !userInteractingWithCamera) {
        _targetCamPos.set(p.cameraPos[0], p.cameraPos[1], p.cameraPos[2]);
        _targetLookAt.set(p.cameraTarget[0], p.cameraTarget[1], p.cameraTarget[2]);
        const alpha = 1 - Math.exp(-4.2 * dt);
        camera.position.lerp(_targetCamPos, alpha);
        controls.target.lerp(_targetLookAt, alpha);
        if (
          camera.position.distanceToSquared(_targetCamPos) < 0.0004 &&
          controls.target.distanceToSquared(_targetLookAt) < 0.0004
        ) {
          cameraGoalActive = false;
        }
      }
      controls.update();

      // Smoothly damp axial exploded-view separation
      currentExplode = THREE.MathUtils.damp(currentExplode, p.explodeAmount, 5.5, dt);
      housingGroup.position.z = -currentExplode * 1.15;
      outerStatorGroup.position.z = -currentExplode * 0.35;
      rotorGroup.position.z = currentExplode * 0.45;
      innerStatorGroup.position.z = currentExplode * 1.15;
      shaftGroup.position.z = currentExplode * 1.65;

      // Smoothly damp 4-degree skew angle on PM segments
      const targetSkewRad = THREE.MathUtils.degToRad(p.skewEnabled ? 4.0 : 0.0);
      if (Math.abs(currentSkewRad - targetSkewRad) > 0.0005) {
        currentSkewRad = THREE.MathUtils.damp(currentSkewRad, targetSkewRad, 6.0, dt);
        updatePmSkewInstances(currentSkewRad);
      }

      // Cutaway toggle (rotate housing slightly or toggle visibility)
      housingGroup.visible = p.cutawayEnabled;

      // Advance rotor & magnetic field wave according to Synchronous vs. Vernier mode
      const isVernier = p.operatingMode === 'vernier';
      // In Vernier mode, rotor rotates slower (geared down by 2.2x) while magnetic field wave rotates fast
      const baseOmega = (isVernier ? 0.35 : 0.95) * p.rotorSpeedMultiplier;
      const fieldOmega = (isVernier ? 1.65 : 0.95) * p.rotorSpeedMultiplier;
      rotorAngle += baseOmega * dt;
      fieldWaveAngle += fieldOmega * dt;

      rotorGroup.rotation.z = rotorAngle;
      shaftMesh.rotation.z = rotorAngle;
      fluxLinesGroup.rotation.z = fieldWaveAngle * 0.5;
      fluxLinesGroup.visible = p.showFluxLines;
      feaWireGroup.visible = p.showMeshWireframe;

      // Update per-instance B-field Flux Density Heatmap on Stator & Rotor Teeth
      currentFlux = THREE.MathUtils.damp(currentFlux, p.fluxIntensity, 5.0, dt);
      const polePairs = isVernier ? 10 : 2;
      for (let i = 0; i < NS; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / NS;
        const bVal = 0.18 + 0.82 * (0.5 + 0.5 * Math.cos(polePairs * (a - fieldWaveAngle)));
        sampleFluxColor(bVal, currentFlux, _color);
        osToothInstanced.setColorAt(i, _color);
        sampleFluxColor(bVal * 0.78, currentFlux, _color);
        osYokeInstanced.setColorAt(i, _color);
      }
      if (osToothInstanced.instanceColor) osToothInstanced.instanceColor.needsUpdate = true;
      if (osYokeInstanced.instanceColor) osYokeInstanced.instanceColor.needsUpdate = true;

      for (let i = 0; i < NR; i++) {
        const a = (i * Math.PI * 2) / NR + rotorAngle;
        const bVal = 0.22 + 0.78 * (0.5 + 0.5 * Math.cos(polePairs * (a - fieldWaveAngle)));
        sampleFluxColor(bVal * 0.9, currentFlux, _color);
        rotToothInstanced.setColorAt(i, _color);
        rotCoreInstanced.setColorAt(i, _color);
      }
      if (rotToothInstanced.instanceColor) rotToothInstanced.instanceColor.needsUpdate = true;
      if (rotCoreInstanced.instanceColor) rotCoreInstanced.instanceColor.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isUnmounted = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  if (webglFallback) {
    return (
      <div className="fixed inset-0 bg-[#12181c] flex items-center justify-center p-8">
        <div className="max-w-md text-center border border-[#36424a] bg-[#1b2328] p-6 rounded-xl">
          <p className="font-mono text-xs text-[#d0864a] mb-2">DMDS-HRSVM · 24-SLOT / 12-POLE</p>
          <h2 className="text-xl font-semibold text-[#e9e4da] mb-2">
            3D Electromagnetic Stage
          </h2>
          <p className="text-sm text-[#9aa5a8]">
            Interactive cross-section of Sajad Ali&apos;s Dual-Mode Dual-Stator Hybrid-Rotor Synchronous and Vernier Machine (100 mm stack, 0.5 mm dual airgaps, 4° skew).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden select-none"
      aria-label="Interactive 3D Dual-Stator Hybrid-Rotor Electrical Machine Viewport"
    />
  );
};
