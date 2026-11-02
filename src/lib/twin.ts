// Gemelo digital ilustrativo de un estadio en WebGL (Three.js). No representa un
// recinto real ni datos reales: es una pieza visual para explicar cómo cada área
// vería la operación en campo. Todo el movimiento es sintético.

import * as THREE from "three";

export type Layer = "ops" | "security" | "commercial" | "hospitality" | "civil" | "fan";
export const LAYERS: Layer[] = ["ops", "security", "commercial", "hospitality", "civil", "fan"];

export interface TwinLabel {
  id: string;
  layer: Layer;
  title: string;
  value: string;
  tone: "good" | "warn" | "bad" | "info";
  pos: THREE.Vector3;
  hero?: boolean;
}

export interface ProjectedLabel {
  id: string;
  x: number;
  y: number;
  alpha: number;
}

interface Options {
  mode: "hero" | "layers";
  lowPower: boolean;
  onLabels?: (labels: ProjectedLabel[]) => void;
}

// Paleta de maqueta: grafitos y grises sobre papel. El color sólo marca estado
// (ocre = atención, ladrillo = crítico, salvia = ruta libre).
const C = {
  cyan: new THREE.Color("#3a3936"),
  blue: new THREE.Color("#6b6a66"),
  ice: new THREE.Color("#2b2a28"),
  dim: new THREE.Color("#b8b5ad"),
  violet: new THREE.Color("#1b1b1a"),
  magenta: new THREE.Color("#4c4b47"),
  amber: new THREE.Color("#c08a1e"),
  red: new THREE.Color("#b4442c"),
  green: new THREE.Color("#4f7d5c"),
  white: new THREE.Color("#8f8c85"),
  sensor: new THREE.Color("#55697a"),
};

const RX = 46; // radio x del primer anillo de gradas
const RZ = 31;
const GATE_RX = 74;
const GATE_RZ = 52;
const GATE_DEG = [200, 240, 280, 320, 40, 80, 120, 160];
const GATE_IDS = "ABCDEFGH".split("");
const SLOW_GATE = 2; // C
// Sólo se rotulan la puerta crítica, la de atención y una fluida, para no saturar.
const opts_showGate = (i: number) => i === SLOW_GATE || i === 4 || i === 6;

function onEllipse(rx: number, rz: number, a: number, y = 0) {
  return new THREE.Vector3(rx * Math.cos(a), y, rz * Math.sin(a));
}

function glowTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.55, "rgba(255,255,255,1)");
  grd.addColorStop(0.75, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Grupo con opacidad animada: cada material guarda su opacidad base.
class FadeGroup {
  group = new THREE.Group();
  value = 0;
  target = 0;
  private mats: { m: THREE.Material & { opacity: number }; base: number }[] = [];
  track<M extends THREE.Material & { opacity: number }>(m: M): M {
    m.transparent = true;
    this.mats.push({ m, base: m.opacity });
    return m;
  }
  step(dt: number) {
    this.value += (this.target - this.value) * Math.min(1, dt * 3.2);
    for (const { m, base } of this.mats) m.opacity = base * this.value;
    this.group.visible = this.value > 0.01;
  }
}

interface Person {
  gate: number;
  phase: 0 | 1 | 2;
  t: number;
  speed: number;
  start: THREE.Vector3;
  target: THREE.Vector3;
  wait: number;
}

export class VenueTwin {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera;
  private clock = new THREE.Clock();
  private raf = 0;
  private running = false;
  private disposed = false;
  private opts: Options;
  private glow: THREE.Texture;
  private layer: Layer = "ops";
  private layers: Record<Layer, FadeGroup>;
  private seatPoints: THREE.Vector3[] = [];
  private gatePos: THREE.Vector3[] = [];
  private gateBeams: THREE.ShaderMaterial[] = [];
  private gateRings: THREE.Mesh[] = [];
  private people: Person[] = [];
  private peopleGeo!: THREE.BufferGeometry;
  private evac: { curve: THREE.QuadraticBezierCurve3; t: number; speed: number }[] = [];
  private evacGeo!: THREE.BufferGeometry;
  private fieldMat!: THREE.ShaderMaterial;
  private sweep!: THREE.Mesh;
  private pads: THREE.Mesh[] = [];
  private padRings: THREE.Mesh[] = [];
  private queues: THREE.Mesh[] = [];
  private fanCurve!: THREE.CatmullRomCurve3;
  private fanDot!: THREE.Mesh;
  private stageCones: THREE.Mesh[] = [];
  private theta = -0.9;
  private dragOffset = 0;
  private heightOffset = 0;
  private camR = 128;
  private camH = 92;
  private camTarget = { theta: -0.9, r: 128, h: 92 };
  private size = { w: 1, h: 1 };
  private dragging: { x: number; y: number } | null = null;
  readonly labels: TwinLabel[] = [];

  constructor(canvas: HTMLCanvasElement, opts: Options) {
    this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.lowPower, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    this.camera = new THREE.OrthographicCamera(-100, 100, 60, -60, -1000, 3000);
    this.scene.fog = new THREE.Fog(0xf3f2ee, 520, 900);
    this.glow = glowTexture();

    this.layers = {
      ops: new FadeGroup(),
      security: new FadeGroup(),
      commercial: new FadeGroup(),
      hospitality: new FadeGroup(),
      civil: new FadeGroup(),
      fan: new FadeGroup(),
    };
    for (const l of LAYERS) this.scene.add(this.layers[l].group);

    this.buildGround();
    this.buildBowl();
    this.buildStage();
    this.buildGates();
    this.buildPeople(opts.lowPower ? 900 : opts.mode === "hero" ? 2600 : 2000);
    this.buildSecurity();
    this.buildCommercial();
    this.buildHospitality();
    this.buildCivil();
    this.buildFan();

    this.setLayer("ops");
    if (opts.mode === "hero") {
      this.layers.security.target = 0.55;
      this.layers.commercial.target = 0.7;
    }
    for (const l of LAYERS) this.layers[l].value = this.layers[l].target;

    canvas.style.touchAction = "pan-y";
    canvas.addEventListener("pointerdown", this.onDown);
    window.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
  }

  // ─── Escena ──────────────────────────────────────────────────────────────

  private buildGround() {
    const geo = new THREE.PlaneGeometry(520, 520, 1, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color("#b9b6ae") } },
      vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform vec3 uColor; varying vec3 vW;
        void main(){
          vec2 p = vW.xz / 24.0;
          vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
          float line = 1.0 - min(min(g.x, g.y), 1.0);
          float d = length(vW.xz);
          float fade = smoothstep(240.0, 60.0, d);
          gl_FragColor = vec4(uColor, line * 0.18 * fade);
        }`,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.y = -0.05;
    this.scene.add(m);
  }

  private buildBowl() {
    // Pista / campo con mapa de calor (se enciende en la capa de seguridad).
    const fieldGeo = new THREE.CircleGeometry(1, 96);
    this.fieldMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uHeat: { value: 0 },
      },
      vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float uTime; uniform float uHeat; varying vec2 vP;
        vec3 ramp(float h){
          vec3 a = vec3(0.90,0.84,0.70); vec3 b = vec3(0.75,0.54,0.12); vec3 c = vec3(0.71,0.27,0.17);
          return h < 0.5 ? mix(a,b,h*2.0) : mix(b,c,(h-0.5)*2.0);
        }
        void main(){
          float r = length(vP);
          vec2 g = abs(fract(vP*9.0 - 0.5) - 0.5) / fwidth(vP*9.0);
          float grid = 1.0 - min(min(g.x,g.y),1.0);
          vec3 base = vec3(0.925,0.918,0.895);
          float h = 0.0;
          h += 0.95*exp(-dot(vP-vec2(-0.55,0.05),vP-vec2(-0.55,0.05))/0.05*(0.9+0.1*sin(uTime*1.3)));
          h += 0.55*exp(-dot(vP-vec2(-0.2,-0.35),vP-vec2(-0.2,-0.35))/0.06);
          h += 0.45*exp(-dot(vP-vec2(-0.25,0.4),vP-vec2(-0.25,0.4))/0.05*(0.9+0.1*cos(uTime)));
          h += 0.25*exp(-dot(vP-vec2(0.3,0.0),vP-vec2(0.3,0.0))/0.12);
          h = clamp(h,0.0,1.0);
          vec3 col = base - grid*vec3(0.10);
          col = mix(col, ramp(h), uHeat*smoothstep(0.08,0.9,h)*0.9);
          float edge = smoothstep(1.0,0.97,r);
          float rim = smoothstep(0.9,1.0,r)*edge;
          col = mix(col, vec3(0.12), rim*0.85);
          gl_FragColor = vec4(col, edge*0.92);
        }`,
    });
    const field = new THREE.Mesh(fieldGeo, this.fieldMat);
    field.rotation.x = -Math.PI / 2;
    field.scale.set(38, 25, 1);
    field.position.y = 0.05;
    this.scene.add(field);

    // Gradas como nubes de puntos.
    const pts: number[] = [];
    const cols: number[] = [];
    for (let t = 0; t < 11; t++) {
      const rx = RX + t * 2.5;
      const rz = RZ + t * 2.1;
      const y = 1.2 + t * 1.35;
      const n = Math.round((Math.PI * (rx + rz)) / 1.05);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const da = Math.abs(((a - Math.PI + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (da < 0.38) continue; // hueco detrás del escenario
        const p = onEllipse(rx, rz, a, y);
        pts.push(p.x, p.y, p.z);
        this.seatPoints.push(p);
        const c = C.dim.clone().lerp(C.cyan, t / 16);
        cols.push(c.r, c.g, c.b);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    // En vista ortográfica el tamaño de los puntos es en píxeles.
    const mat = new THREE.PointsMaterial({
      size: 2.2 * Math.min(window.devicePixelRatio || 1, 2),
      map: this.glow,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    this.scene.add(new THREE.Points(geo, mat));

    // Contornos del graderío y del pasillo exterior.
    const ring = (rx: number, rz: number, y: number, color: THREE.Color, opacity: number) => {
      const pts2: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) pts2.push(onEllipse(rx, rz, (i / 160) * Math.PI * 2, y));
      const g = new THREE.BufferGeometry().setFromPoints(pts2);
      const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.NormalBlending, depthWrite: false });
      this.scene.add(new THREE.Line(g, m));
    };
    ring(RX - 1.5, RZ - 1.5, 0.3, C.cyan, 0.5);
    ring(RX + 26, RZ + 22, 15.5, C.cyan, 0.25);
    ring(GATE_RX, GATE_RZ, 0.2, C.blue, 0.35);
  }

  private buildStage() {
    const stage = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 18), new THREE.MeshBasicMaterial({ color: 0xdedbd3 }));
    stage.position.set(-43, 2.5, 0);
    this.scene.add(stage);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(stage.geometry),
      new THREE.LineBasicMaterial({ color: C.violet, transparent: true, opacity: 0.9 }),
    );
    edges.position.copy(stage.position);
    this.scene.add(edges);
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(9, 36, 32, 1, true),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? C.magenta : C.violet,
          transparent: true,
          opacity: 0.025,
          blending: THREE.NormalBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      cone.position.set(-40, 7, (i - 1) * 6);
      cone.rotation.z = Math.PI / 2 + 0.25;
      this.scene.add(cone);
      this.stageCones.push(cone);
    }
  }

  private beamMaterial(color: THREE.Color) {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: color.clone() }, uOpacity: { value: 0.75 }, uTime: { value: 0 } },
      vertexShader: `varying float vY; void main(){ vY = uv.y; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uOpacity; uniform float uTime; varying float vY;
        void main(){ float a = pow(1.0 - vY, 2.2); float scan = 0.25*smoothstep(0.02,0.0,abs(fract(vY*1.0 - uTime*0.35)-0.5)-0.47);
          gl_FragColor = vec4(uColor, (a*0.85 + scan) * uOpacity); }`,
    });
  }

  private buildGates() {
    GATE_DEG.forEach((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const p = onEllipse(GATE_RX, GATE_RZ, a, 0);
      this.gatePos.push(p);
      const mat = this.beamMaterial(C.white);
      this.gateBeams.push(mat);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 28, 20, 1, true), mat);
      beam.position.set(p.x, 14, p.z);
      this.scene.add(beam);
      const ringMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.6, blending: THREE.NormalBlending, depthWrite: false, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.75, 48), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(p.x, 0.25, p.z);
      ring.userData.offset = i * 0.37;
      this.scene.add(ring);
      this.gateRings.push(ring);
      const status = i === SLOW_GATE ? "bad" : i === 4 ? "warn" : "good";
      if (opts_showGate(i)) this.labels.push({
        id: `gate-${i}`,
        layer: "ops",
        title: `Puerta ${GATE_IDS[i]}`,
        value: i === SLOW_GATE ? "20 min · abrir +5 carriles" : i === 4 ? "6 min" : "< 2 min",
        tone: status,
        pos: new THREE.Vector3(p.x, 30, p.z),
        hero: i === SLOW_GATE,
      });
    });
  }

  private randomTarget(): THREE.Vector3 {
    if (Math.random() < 0.35) {
      // pista general
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.85;
      const x = Math.cos(a) * r * 34;
      return new THREE.Vector3(Math.max(x, -30), 0.4, Math.sin(a) * r * 22);
    }
    return this.seatPoints[Math.floor(Math.random() * this.seatPoints.length)].clone();
  }

  private spawn(p: Person, fresh: boolean) {
    p.gate = Math.random() < 0.2 ? SLOW_GATE : Math.floor(Math.random() * GATE_DEG.length);
    const a = (GATE_DEG[p.gate] * Math.PI) / 180 + (Math.random() - 0.5) * 0.22;
    const far = 1.45 + Math.random() * 0.55;
    p.start = onEllipse(GATE_RX * far, GATE_RZ * far, a, 0.4);
    p.target = this.randomTarget();
    p.phase = 0;
    p.t = fresh ? Math.random() : 0;
    p.speed = (0.08 + Math.random() * 0.1) * (p.gate === SLOW_GATE ? 0.4 : 1);
    p.wait = 0;
  }

  private buildPeople(n: number) {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const p = { gate: 0, phase: 0, t: 0, speed: 0, start: new THREE.Vector3(), target: new THREE.Vector3(), wait: 0 } as Person;
      this.spawn(p, true);
      if (Math.random() < 0.55) {
        p.phase = Math.random() < 0.5 ? 1 : 2;
        p.wait = 2 + Math.random() * 8;
      }
      this.people.push(p);
    }
    this.peopleGeo = new THREE.BufferGeometry();
    this.peopleGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.peopleGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 3.4 * Math.min(window.devicePixelRatio || 1, 2),
      map: this.glow,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    this.scene.add(new THREE.Points(this.peopleGeo, mat));
  }

  private buildSecurity() {
    const L = this.layers.security;
    const sweepMat = L.track(
      new THREE.MeshBasicMaterial({ color: C.sensor, opacity: 0.2, blending: THREE.NormalBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    this.sweep = new THREE.Mesh(new THREE.CircleGeometry(36, 40, 0, 0.55), sweepMat);
    this.sweep.rotation.x = -Math.PI / 2;
    this.sweep.position.set(-2, 0.35, 0);
    L.group.add(this.sweep);
    const hot = [
      { x: -21, z: 1, v: "4.1 p/m²", tone: "bad" as const, t: "Frente al escenario" },
      { x: -8, z: -9, v: "2.6 p/m²", tone: "warn" as const, t: "Pista oriente" },
      { x: 8, z: 0, v: "1.2 p/m²", tone: "good" as const, t: "Pista central" },
    ];
    hot.forEach((h, i) => {
      const m = L.track(
        new THREE.MeshBasicMaterial({
          color: h.tone === "bad" ? C.red : h.tone === "warn" ? C.amber : C.green,
          opacity: 0.8,
          blending: THREE.NormalBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.2, 2.6, 40), m);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(h.x, 0.5, h.z);
      ring.userData.offset = i * 0.5;
      L.group.add(ring);
      this.padRings.push(ring);
      this.labels.push({ id: `hot-${i}`, layer: "security", title: h.t, value: h.v, tone: h.tone, pos: new THREE.Vector3(h.x, 7, h.z) });
    });
    // Sensores LiDAR en el anillo superior.
    [0.6, 2.2, 3.9, 5.3].forEach((a, i) => {
      const p = onEllipse(RX + 26, RZ + 22, a, 16);
      const m = L.track(new THREE.MeshBasicMaterial({ color: C.sensor, opacity: 0.9 }));
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.9), m);
      s.position.copy(p);
      L.group.add(s);
      if (i === 0) this.labels.push({ id: "lidar", layer: "security", title: "Sensor LiDAR", value: "4 en anillo superior", tone: "info", pos: p.clone().setY(19) });
    });
  }

  private buildCommercial() {
    const L = this.layers.commercial;
    const spots = [
      { a: 0.15, t: "Spot 1 · Explanada", v: "Índice 92" },
      { a: 1.05, t: "Spot 2 · Concourse sur", v: "Índice 78" },
      { a: 2.35, t: "Spot 3 · Acceso A", v: "Índice 64" },
      { a: 4.0, t: "Spot 4 · Barra principal", v: "Índice 88" },
      { a: 5.05, t: "Spot 5 · Zona premium", v: "Índice 71" },
    ];
    spots.forEach((s, i) => {
      const p = onEllipse(GATE_RX - 8, GATE_RZ - 6, s.a, 0.4);
      const padMat = L.track(new THREE.MeshBasicMaterial({ color: C.magenta, opacity: 0.55, blending: THREE.NormalBlending, depthWrite: false, side: THREE.DoubleSide }));
      const pad = new THREE.Mesh(new THREE.CircleGeometry(3.4, 6), padMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.copy(p);
      L.group.add(pad);
      this.pads.push(pad);
      for (let k = 0; k < 2; k++) {
        const rm = L.track(new THREE.MeshBasicMaterial({ color: C.magenta, opacity: 0.7, blending: THREE.NormalBlending, depthWrite: false, side: THREE.DoubleSide }));
        const r = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.5, 6), rm);
        r.rotation.x = -Math.PI / 2;
        r.position.copy(p);
        r.userData.offset = k * 0.5 + i * 0.13;
        r.userData.rise = true;
        L.group.add(r);
        this.padRings.push(r);
      }
      const beamMat = this.beamMaterial(C.magenta);
      L.track(beamMat as unknown as THREE.Material & { opacity: number });
      beamMat.uniforms.uOpacity.value = 0.5;
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 12, 8, 1, true), beamMat);
      beam.position.set(p.x, 6, p.z);
      L.group.add(beam);
      this.labels.push({ id: `spot-${i}`, layer: "commercial", title: s.t, value: s.v, tone: "info", pos: p.clone().setY(13) });
    });
  }

  private buildHospitality() {
    const L = this.layers.hospitality;
    const stands = [0.55, 1.6, 2.7, 3.55, 4.55, 5.6];
    stands.forEach((a, i) => {
      const p = onEllipse(GATE_RX - 7, GATE_RZ - 5, a, 0);
      const base = L.track(new THREE.MeshBasicMaterial({ color: C.amber, opacity: 0.35, blending: THREE.NormalBlending, depthWrite: false }));
      const b = new THREE.Mesh(new THREE.BoxGeometry(5, 0.6, 2.4), base);
      b.position.set(p.x, 0.3, p.z);
      b.lookAt(0, 0.3, 0);
      L.group.add(b);
      const qm = L.track(new THREE.MeshBasicMaterial({ color: i === 3 ? C.red : C.amber, opacity: 0.85, blending: THREE.NormalBlending, depthWrite: false }));
      const q = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, 1.4), qm);
      q.position.set(p.x, 0.5, p.z);
      q.userData.baseH = i === 3 ? 11 : 3 + (i % 3) * 2;
      q.userData.phase = i * 1.3;
      L.group.add(q);
      this.queues.push(q);
      this.labels.push({
        id: `bar-${i}`,
        layer: "hospitality",
        title: `Barra ${i + 1}`,
        value: i === 3 ? "14 min · abrir caja 2" : `${2 + (i % 3) * 2} min`,
        tone: i === 3 ? "bad" : i % 3 === 2 ? "warn" : "good",
        pos: new THREE.Vector3(p.x, 15, p.z),
      });
    });
  }

  private buildCivil() {
    const L = this.layers.civil;
    const exits = [1, 3, 5, 7].map((i) => this.gatePos[i]);
    const n = this.opts.lowPower ? 300 : 700;
    for (let i = 0; i < n; i++) {
      const from = this.seatPoints[Math.floor(Math.random() * this.seatPoints.length)];
      const exit = exits.reduce((best, e) => (e.distanceTo(from) < best.distanceTo(from) ? e : best), exits[0]);
      const mid = from.clone().lerp(exit, 0.5).setY(from.y + 4);
      this.evac.push({ curve: new THREE.QuadraticBezierCurve3(from.clone(), mid, exit.clone().setY(0.4)), t: Math.random(), speed: 0.12 + Math.random() * 0.12 });
    }
    this.evacGeo = new THREE.BufferGeometry();
    this.evacGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const mat = L.track(
      new THREE.PointsMaterial({ size: 3 * Math.min(window.devicePixelRatio || 1, 2), map: this.glow, color: C.green, opacity: 0.95, depthWrite: false, blending: THREE.NormalBlending }),
    );
    L.group.add(new THREE.Points(this.evacGeo, mat));
    exits.forEach((e, k) => {
      this.labels.push({
        id: `exit-${k}`,
        layer: "civil",
        title: `Salida ${GATE_IDS[[1, 3, 5, 7][k]]}`,
        value: ["4:10 min", "3:45 min", "4:30 min", "3:55 min"][k],
        tone: "good",
        pos: e.clone().setY(30),
      });
    });
    this.labels.push({ id: "aforo", layer: "civil", title: "Aforo dentro", value: "58,214 / 60,000", tone: "info", pos: new THREE.Vector3(0, 22, 0) });
  }

  private buildFan() {
    const L = this.layers.fan;
    const gate = this.gatePos[4];
    const seat = onEllipse(RX + 12, RZ + 10, 0.55, 1.2 + 5 * 1.35);
    const outside = onEllipse(GATE_RX * 1.9, GATE_RZ * 1.9, (GATE_DEG[4] * Math.PI) / 180, 0.4);
    this.fanCurve = new THREE.CatmullRomCurve3([outside, gate.clone().setY(0.4), onEllipse(GATE_RX - 10, GATE_RZ - 8, 0.62, 2), seat]);
    const pts = this.fanCurve.getPoints(120);
    const lineMat = L.track(new THREE.LineBasicMaterial({ color: C.ice, opacity: 0.95, blending: THREE.NormalBlending, depthWrite: false }));
    L.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    const dotMat = L.track(new THREE.MeshBasicMaterial({ color: C.white, opacity: 1 }));
    this.fanDot = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), dotMat);
    L.group.add(this.fanDot);
    const pinMat = L.track(new THREE.MeshBasicMaterial({ color: C.cyan, opacity: 1 }));
    const pin = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3, 16), pinMat);
    pin.rotation.x = Math.PI;
    pin.position.copy(seat).setY(seat.y + 3);
    L.group.add(pin);
    this.labels.push({ id: "fan-gate", layer: "fan", title: "Tu puerta: E", value: "Abre 18:00 · fila 3 min", tone: "good", pos: gate.clone().setY(30) });
    this.labels.push({ id: "fan-seat", layer: "fan", title: "Sección 214", value: "6 min caminando", tone: "info", pos: seat.clone().setY(seat.y + 7) });
  }

  // ─── API ────────────────────────────────────────────────────────────────

  setLayer(layer: Layer) {
    this.layer = layer;
    if (this.opts.mode === "layers") {
      for (const l of LAYERS) this.layers[l].target = l === layer ? 1 : 0;
      this.layers.ops.target = layer === "ops" ? 1 : 0;
    } else {
      this.layers.ops.target = 1;
    }
    const presets: Record<Layer, { theta: number; r: number; h: number }> = {
      ops: { theta: -0.9, r: 128, h: 92 },
      security: { theta: 2.6, r: 128, h: 110 },
      commercial: { theta: 0.5, r: 128, h: 88 },
      hospitality: { theta: -2.2, r: 128, h: 82 },
      civil: { theta: 1.4, r: 128, h: 120 },
      fan: { theta: 0.2, r: 128, h: 80 },
    };
    this.camTarget = presets[layer];
  }

  setRunning(on: boolean) {
    if (on === this.running || this.disposed) return;
    this.running = on;
    if (on) {
      this.clock.getDelta();
      this.loop();
    } else cancelAnimationFrame(this.raf);
  }

  resize(w: number, h: number) {
    this.size = { w, h };
    this.renderer.setSize(w, h, false);
    // Vista axonométrica: el tamaño de la vista fija la escala, no la distancia.
    const aspect = w / h;
    const view = w < 640 ? 175 : this.opts.mode === "hero" ? 118 : 132;
    this.camera.left = (-view * aspect) / 2;
    this.camera.right = (view * aspect) / 2;
    this.camera.top = view / 2;
    this.camera.bottom = -view / 2;
    this.camera.updateProjectionMatrix();
    this.renderFrame(0);
  }

  renderStill() {
    // Avanza la simulación unos segundos para que la imagen fija se vea "viva".
    for (let i = 0; i < 90; i++) this.step(1 / 30);
    this.renderFrame(0);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.renderer.domElement.removeEventListener("pointerdown", this.onDown);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.glow.dispose();
    this.renderer.dispose();
  }

  // ─── Interacción ────────────────────────────────────────────────────────

  private onDown = (e: PointerEvent) => {
    this.dragging = { x: e.clientX, y: e.clientY };
  };
  private onMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.dragging.x;
    const dy = e.clientY - this.dragging.y;
    this.dragging = { x: e.clientX, y: e.clientY };
    this.dragOffset -= dx * 0.006;
    this.heightOffset = Math.max(-30, Math.min(40, this.heightOffset + dy * 0.2));
  };
  private onUp = () => {
    this.dragging = null;
  };

  // ─── Bucle ──────────────────────────────────────────────────────────────

  private loop = () => {
    if (!this.running || this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.step(dt);
    this.renderFrame(dt);
    this.raf = requestAnimationFrame(this.loop);
  };

  private elapsed = 0;

  private step(dt: number) {
    this.elapsed += dt;
    const t = this.elapsed;
    for (const l of LAYERS) this.layers[l].step(dt);

    // Personas
    const pos = this.peopleGeo.getAttribute("position") as THREE.BufferAttribute;
    const col = this.peopleGeo.getAttribute("color") as THREE.BufferAttribute;
    const opsOn = this.layers.ops.value;
    const tmp = new THREE.Vector3();
    this.people.forEach((p, i) => {
      if (p.phase === 0) {
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.phase = 1;
          p.t = 0;
        }
        tmp.copy(p.start).lerp(this.gatePos[p.gate], p.t);
        tmp.y = 0.5;
      } else if (p.phase === 1) {
        p.t += dt * p.speed * 1.4;
        if (p.t >= 1) {
          p.phase = 2;
          p.t = 0;
          p.wait = 3 + Math.random() * 8;
        }
        const e = p.t * p.t * (3 - 2 * p.t);
        tmp.copy(this.gatePos[p.gate]).lerp(p.target, e);
        tmp.y += Math.sin(e * Math.PI) * 2;
      } else {
        p.wait -= dt;
        tmp.copy(p.target);
        tmp.y += Math.sin(t * 2 + i) * 0.08;
        if (p.wait <= 0) this.spawn(p, false);
      }
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
      let c: THREE.Color;
      if (p.phase === 0) c = p.gate === SLOW_GATE && opsOn > 0.5 ? C.amber : C.cyan;
      else if (p.phase === 1) c = C.ice;
      else c = C.dim;
      col.setXYZ(i, c.r, c.g, c.b);
    });
    pos.needsUpdate = true;
    col.needsUpdate = true;

    // Puertas: color según capa
    this.gateBeams.forEach((m, i) => {
      let target: THREE.Color;
      if (this.layer === "civil" && this.opts.mode === "layers") target = i % 2 === 1 ? C.green : C.dim;
      else if (this.layer === "fan" && this.opts.mode === "layers") target = i === 4 ? C.cyan : C.dim;
      else if (this.layer === "ops" || this.opts.mode === "hero") target = i === SLOW_GATE ? C.red : i === 4 ? C.amber : C.white;
      else target = C.dim;
      (m.uniforms.uColor.value as THREE.Color).lerp(target, Math.min(1, dt * 3));
      m.uniforms.uTime.value = t + i * 0.3;
    });
    this.gateRings.forEach((r) => {
      const k = ((t * 0.5 + r.userData.offset) % 1 + 1) % 1;
      r.scale.setScalar(1 + k * 4);
      (r.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k);
    });
    this.padRings.forEach((r) => {
      const k = ((t * 0.45 + r.userData.offset) % 1 + 1) % 1;
      if (r.userData.rise) {
        r.position.y = 0.4 + k * 9;
        r.scale.setScalar(1 - k * 0.4);
      } else r.scale.setScalar(1 + k * 1.8);
    });

    this.fieldMat.uniforms.uTime.value = t;
    this.fieldMat.uniforms.uHeat.value = this.layers.security.value;
    this.sweep.rotation.z = t * 0.9;
    this.queues.forEach((q) => {
      const h = Math.max(0.6, q.userData.baseH * (0.8 + 0.2 * Math.sin(t * 0.8 + q.userData.phase)));
      q.scale.y = h;
      q.position.y = h / 2 + 0.6;
    });
    const ep = this.evacGeo.getAttribute("position") as THREE.BufferAttribute;
    this.evac.forEach((e, i) => {
      e.t = (e.t + dt * e.speed) % 1;
      e.curve.getPoint(e.t, tmp);
      ep.setXYZ(i, tmp.x, tmp.y, tmp.z);
    });
    ep.needsUpdate = true;
    this.fanCurve.getPoint((t * 0.12) % 1, this.fanDot.position);
    this.stageCones.forEach((c, i) => {
      c.rotation.y = Math.sin(t * 0.6 + i) * 0.35;
    });

    // Cámara
    const auto = this.dragging ? 0 : dt * (this.opts.mode === "hero" ? 0.05 : 0.025);
    this.camTarget.theta += auto;
    const k = Math.min(1, dt * 1.6);
    this.theta += (this.camTarget.theta + this.dragOffset - this.theta) * k;
    this.camR += (this.camTarget.r - this.camR) * k;
    this.camH += (this.camTarget.h + this.heightOffset - this.camH) * k;
    const narrow = 1;
    this.camera.position.set(Math.cos(this.theta) * this.camR * narrow, this.camH * narrow, Math.sin(this.theta) * this.camR * narrow);
    this.camera.lookAt(0, 4, 0);
  }

  private renderFrame(_dt: number) {
    this.renderer.render(this.scene, this.camera);
    if (!this.opts.onLabels) return;
    const out: ProjectedLabel[] = [];
    const v = new THREE.Vector3();
    for (const l of this.labels) {
      const layerAlpha = this.opts.mode === "hero" ? (l.hero ? 1 : 0) : this.layers[l.layer].value;
      v.copy(l.pos).project(this.camera);
      const inFront = v.z < 1;
      out.push({
        id: l.id,
        x: (v.x * 0.5 + 0.5) * this.size.w,
        y: (-v.y * 0.5 + 0.5) * this.size.h,
        alpha: inFront ? layerAlpha : 0,
      });
    }
    this.opts.onLabels(out);
  }
}
