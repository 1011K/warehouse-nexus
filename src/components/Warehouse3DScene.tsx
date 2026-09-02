import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ZoneId, LiveKpiData } from '../data/simulation';
import { BASE_KPIS } from '../data/simulation';

export interface Agent3D {
  id: string;
  x: number;
  y: number;
  z: number;
  label?: string;
  color?: string;
  type?: 'truck' | 'pallet' | 'amr' | 'agv' | 'forklift' | 'crane' | 'box';
  stopped?: boolean;
}

interface Warehouse3DSceneProps {
  isActive?: boolean;
  focusedZone?: ZoneId | null;
  cameraPreset?: 'overview' | 'receiving' | 'storage' | 'asrs' | 'picking' | 'packing' | 'dispatch';
  highlights?: ZoneId[];
  isDigitalTwin?: boolean;
  showAisleCBlocked?: boolean;
  showQuarantine?: boolean;
  agents?: Agent3D[];
  routePath?: [number, number, number][];
  routeColor?: string;
  kpiOverlay?: Partial<LiveKpiData>;
  storyTitle?: string;
  storyDetail?: string;
}

export default function Warehouse3DScene({
  isActive = true,
  focusedZone = null,
  cameraPreset = 'overview',
  highlights = [],
  isDigitalTwin = false,
  showAisleCBlocked = false,
  showQuarantine = true,
  agents = [],
  routePath,
  routeColor = '#1d6ff0',
  kpiOverlay,
  storyTitle,
  storyDetail,
}: Warehouse3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(32, 28, 32));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const agentsGroupRef = useRef<THREE.Group | null>(null);
  const routeLineRef = useRef<THREE.Line | null>(null);

  const kpis: LiveKpiData = { ...BASE_KPIS, ...kpiOverlay };

  // Setup Three.js 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDigitalTwin ? '#0f141d' : '#f4f2ec');
    sceneRef.current = scene;

    // Fog for spatial depth
    scene.fog = new THREE.FogExp2(isDigitalTwin ? '#0f141d' : '#f4f2ec', 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(32, 28, 32);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDigitalTwin ? 0.4 : 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDigitalTwin ? 0.6 : 1.2);
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const d = 40;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Ground Floor Plane
    const floorGeo = new THREE.PlaneGeometry(80, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDigitalTwin ? '#151c28' : '#eae7de',
      roughness: 0.6,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ground Floor Grid Lines
    const grid = new THREE.GridHelper(80, 40, isDigitalTwin ? 0x0891b2 : 0xc0bcae, isDigitalTwin ? 0x1e293b : 0xd8d4c6);
    grid.position.y = 0.02;
    scene.add(grid);

    // Build 3D Warehouse Architecture
    buildWarehouse3D(scene, isDigitalTwin, highlights, showAisleCBlocked, showQuarantine);

    // Group for dynamic 3D agents
    const agentsGroup = new THREE.Group();
    scene.add(agentsGroup);
    agentsGroupRef.current = agentsGroup;

    // Animation Loop
    let animId: number;
    const animate = () => {
      if (!isActive) return;
      animId = requestAnimationFrame(animate);

      // Smooth Camera lerping
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 0.04);
        const currentLook = new THREE.Vector3();
        cameraRef.current.getWorldDirection(currentLook);
        cameraRef.current.lookAt(
          THREE.MathUtils.lerp(cameraRef.current.position.x - currentLook.x * 10, targetCamLook.current.x, 0.04),
          THREE.MathUtils.lerp(cameraRef.current.position.y - currentLook.y * 10, targetCamLook.current.y, 0.04),
          THREE.MathUtils.lerp(cameraRef.current.position.z - currentLook.z * 10, targetCamLook.current.z, 0.04)
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDigitalTwin, highlights, showAisleCBlocked, showQuarantine, isActive]);

  // Update Camera Presets / Focus
  useEffect(() => {
    if (cameraPreset === 'receiving' || focusedZone === 'receiving') {
      targetCamPos.current.set(-22, 14, 18);
      targetCamLook.current.set(-22, 0, 0);
    } else if (cameraPreset === 'storage' || focusedZone === 'storage') {
      targetCamPos.current.set(-5, 18, 16);
      targetCamLook.current.set(-5, 0, 0);
    } else if (cameraPreset === 'asrs' || focusedZone === 'asrs') {
      targetCamPos.current.set(8, 16, 14);
      targetCamLook.current.set(8, 0, 0);
    } else if (cameraPreset === 'picking' || focusedZone === 'picking') {
      targetCamPos.current.set(18, 12, 12);
      targetCamLook.current.set(18, 0, -4);
    } else if (cameraPreset === 'packing' || focusedZone === 'packing') {
      targetCamPos.current.set(18, 12, 10);
      targetCamLook.current.set(18, 0, 6);
    } else if (cameraPreset === 'dispatch' || focusedZone === 'dispatch') {
      targetCamPos.current.set(28, 14, 16);
      targetCamLook.current.set(28, 0, 0);
    } else {
      // Overview
      targetCamPos.current.set(34, 30, 34);
      targetCamLook.current.set(0, 0, 0);
    }
  }, [cameraPreset, focusedZone]);

  // Update 3D Agents in Scene
  useEffect(() => {
    const group = agentsGroupRef.current;
    if (!group) return;

    // Clear existing agents
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    agents.forEach(a => {
      const color = a.color ?? '#1d6ff0';

      if (a.type === 'truck') {
        const truck = create3DTruck(color);
        truck.position.set(a.x, a.y + 0.1, a.z);
        group.add(truck);
      } else if (a.type === 'amr' || a.type === 'agv') {
        const amr = create3DAMR(color, a.stopped);
        amr.position.set(a.x, a.y + 0.1, a.z);
        group.add(amr);
      } else if (a.type === 'crane') {
        const crane = create3DCrane(color);
        crane.position.set(a.x, a.y + 0.1, a.z);
        group.add(crane);
      } else {
        // Pallet or Box
        const pallet = create3DPallet(color);
        pallet.position.set(a.x, a.y + 0.2, a.z);
        group.add(pallet);
      }
    });
  }, [agents]);

  // Draw 3D Route Curve
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (routeLineRef.current) {
      scene.remove(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (routePath && routePath.length > 1) {
      const points = routePath.map(p => new THREE.Vector3(p[0], p[1] + 0.15, p[2]));
      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const material = new THREE.LineBasicMaterial({ color: routeColor, linewidth: 4 });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      routeLineRef.current = line;
    }
  }, [routePath, routeColor]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Story Overlay Banner at top left */}
      {storyTitle && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(255, 255, 255, 0.94)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'blur(6px)',
          maxWidth: '420px',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="chip chip--blue" style={{ fontSize: '9px' }}>STORY OBJECT: IN-07 / PLT-204 / ORD-2040</span>
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: 'var(--navy)' }}>{storyTitle}</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5 }}>{storyDetail}</p>
        </div>
      )}

      {/* Live KPI HUD Overlay at top right */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.94)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 14px',
        boxShadow: 'var(--shadow-md)',
        backdropFilter: 'blur(6px)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>DIST</span>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--navy)' }}>{kpis.travelDistance}m</span>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>PICK TIME</span>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--navy)' }}>{kpis.pickTime}s</span>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>QUEUE</span>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: kpis.queueLength > 10 ? 'var(--red)' : 'var(--navy)' }}>{kpis.queueLength}</span>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>THROUGHPUT</span>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--green)' }}>{kpis.throughput}/h</span>
        </div>
        <div style={{ marginLeft: '6px', alignSelf: 'center' }}>
          <span className="chip chip--cyan" style={{ fontSize: '8px', padding: '2px 5px' }}>ILLUSTRATIVE SIMULATION</span>
        </div>
      </div>
    </div>
  );
}

// ── Helpers to Build 3D Warehouse Architecture ───────────────────────
function buildWarehouse3D(scene: THREE.Scene, isDigitalTwin: boolean, _highlights?: ZoneId[], showAisleCBlocked?: boolean, showQuarantine?: boolean) {
  const rackMat = new THREE.MeshStandardMaterial({ color: isDigitalTwin ? '#0891b2' : '#334155', roughness: 0.4 });
  const boxMatA = new THREE.MeshStandardMaterial({ color: '#1d6ff0', roughness: 0.5 });
  const boxMatB = new THREE.MeshStandardMaterial({ color: '#0891b2', roughness: 0.5 });
  
  // 1. Storage Racks (Aisles A, B, C)
  [-12, -4, 4].forEach(x => {
    [-12, -4, 4, 12].forEach(z => {
      // Rack uprights
      const uprightGeo = new THREE.BoxGeometry(0.3, 8, 0.3);
      const u1 = new THREE.Mesh(uprightGeo, rackMat); u1.position.set(x - 2.5, 4, z); scene.add(u1);
      const u2 = new THREE.Mesh(uprightGeo, rackMat); u2.position.set(x + 2.5, 4, z); scene.add(u2);

      // Horizontal Shelf Beams
      [2, 4.5, 7].forEach(y => {
        const beamGeo = new THREE.BoxGeometry(5.2, 0.2, 0.3);
        const beam = new THREE.Mesh(beamGeo, rackMat);
        beam.position.set(x, y, z);
        scene.add(beam);

        // Pallet Boxes on Racks
        const boxGeo = new THREE.BoxGeometry(1.4, 1.2, 1.4);
        const box1 = new THREE.Mesh(boxGeo, boxMatA);
        box1.position.set(x - 1.2, y + 0.7, z);
        box1.castShadow = true;
        scene.add(box1);

        const box2 = new THREE.Mesh(boxGeo, boxMatB);
        box2.position.set(x + 1.2, y + 0.7, z);
        box2.castShadow = true;
        scene.add(box2);
      });
    });
  });

  // 2. High-Bay AS/RS Crane Tower Structure
  const asrsX = 12;
  const towerGeo = new THREE.BoxGeometry(0.4, 14, 0.4);
  [-4, 4].forEach(z => {
    const t = new THREE.Mesh(towerGeo, rackMat);
    t.position.set(asrsX, 7, z);
    scene.add(t);
  });
  const railGeo = new THREE.BoxGeometry(0.3, 0.3, 16);
  const rail = new THREE.Mesh(railGeo, rackMat);
  rail.position.set(asrsX, 13.8, 0);
  scene.add(rail);

  // 3. Roller Conveyor Belt System
  const conveyorMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.3 });
  const convGeo = new THREE.BoxGeometry(12, 0.4, 1.2);
  const conv1 = new THREE.Mesh(convGeo, conveyorMat);
  conv1.position.set(18, 1, -2);
  scene.add(conv1);

  // 4. Packing Benches
  const benchMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.4 });
  const benchGeo = new THREE.BoxGeometry(4, 1.2, 2.5);
  const bench = new THREE.Mesh(benchGeo, benchMat);
  bench.position.set(18, 0.6, 6);
  scene.add(bench);

  // 5. Dock Doors at Receiving & Dispatch
  const doorMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2 });
  const doorGeo = new THREE.BoxGeometry(0.2, 6, 4);
  const door1 = new THREE.Mesh(doorGeo, doorMat); door1.position.set(-30, 3, -8); scene.add(door1);
  const door2 = new THREE.Mesh(doorGeo, doorMat); door2.position.set(-30, 3, 8);  scene.add(door2);
  const door3 = new THREE.Mesh(doorGeo, doorMat); door3.position.set(30, 3, -8);  scene.add(door3);
  // 6. 3D Quarantine Zone Enclosure
  if (showQuarantine) {
    const qFenceMat = new THREE.MeshStandardMaterial({ color: '#dc2626', transparent: true, opacity: 0.35 });
    const qFenceGeo = new THREE.BoxGeometry(6, 2, 6);
    const qFence = new THREE.Mesh(qFenceGeo, qFenceMat);
    qFence.position.set(-24, 1, -10);
    scene.add(qFence);
  }

  // 7. 3D Aisle C Obstruction Marker
  if (showAisleCBlocked) {
    const obsMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.2 });
    const obsGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const obs = new THREE.Mesh(obsGeo, obsMat);
    obs.position.set(0, 1.25, 0);
    obs.castShadow = true;
    scene.add(obs);
  }
}

// ── 3D Mesh Creators for Vehicles & Objects ────────────────────────────
function create3DTruck(colorStr: string): THREE.Group {
  const group = new THREE.Group();
  const matCab = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3 });
  const matBody = new THREE.MeshStandardMaterial({ color: colorStr, roughness: 0.4 });
  const matWheel = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.8 });

  // Trailer body
  const bodyGeo = new THREE.BoxGeometry(8, 4, 3);
  const body = new THREE.Mesh(bodyGeo, matBody);
  body.position.set(0, 2.2, 0);
  body.castShadow = true;
  group.add(body);

  // Cab
  const cabGeo = new THREE.BoxGeometry(2.5, 3, 2.8);
  const cab = new THREE.Mesh(cabGeo, matCab);
  cab.position.set(4.5, 1.7, 0);
  cab.castShadow = true;
  group.add(cab);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
  wheelGeo.rotateX(Math.PI / 2);
  [-2.5, 0, 3.5].forEach(x => {
    [-1.6, 1.6].forEach(z => {
      const wheel = new THREE.Mesh(wheelGeo, matWheel);
      wheel.position.set(x, 0.6, z);
      group.add(wheel);
    });
  });

  return group;
}

function create3DAMR(colorStr: string, stopped?: boolean): THREE.Group {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: stopped ? '#dc2626' : colorStr, roughness: 0.3 });
  const domeMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1 });

  const bodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 24);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.3;
  body.castShadow = true;
  group.add(body);

  const domeGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.set(0, 0.7, 0);
  group.add(dome);

  return group;
}

function create3DCrane(colorStr: string): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: colorStr, roughness: 0.3 });
  const geo = new THREE.BoxGeometry(2, 1, 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.5;
  mesh.castShadow = true;
  group.add(mesh);
  return group;
}

function create3DPallet(colorStr: string): THREE.Group {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.7 });
  const boxMat = new THREE.MeshStandardMaterial({ color: colorStr, roughness: 0.4 });

  const woodGeo = new THREE.BoxGeometry(1.6, 0.2, 1.6);
  const wood = new THREE.Mesh(woodGeo, woodMat);
  wood.position.y = 0.1;
  wood.castShadow = true;
  group.add(wood);

  const boxGeo = new THREE.BoxGeometry(1.4, 1.2, 1.4);
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.y = 0.8;
  box.castShadow = true;
  group.add(box);

  return group;
}