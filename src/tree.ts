interface Branch {
  x: number;
  y: number;
  midX: number;
  midY: number;
  x2: number;
  y2: number;
  angle: number;
  len: number;
  width: number;
  depth: number;
  progress: number;
  done: boolean;
  children: Branch[];
  childDefs: ChildDef[];
}

interface ChildDef {
  angle: number;
  len: number;
  width: number;
}

let seed = 42;

function sr(): number {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

function sr2(a: number, b: number): number {
  return a + sr() * (b - a);
}

function r2(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function makeBranch(
  x: number,
  y: number,
  angle: number,
  len: number,
  width: number,
  depth: number
): Branch | null {
  if (depth > 10 || len < 3) return null;
  const wX = sr2(-len * 0.22, len * 0.22);
  const wY = sr2(-len * 0.12, len * 0.12);
  const x2 = x + Math.cos(angle) * len + sr2(-len * 0.1, len * 0.1);
  const y2 = y + Math.sin(angle) * len + sr2(-len * 0.07, len * 0.07);
  const b: Branch = {
    x, y,
    midX: (x + x2) / 2 + wX,
    midY: (y + y2) / 2 + wY,
    x2, y2,
    angle, len, width, depth,
    progress: 0,
    done: false,
    children: [],
    childDefs: [],
  };
  const nKids =
    depth < 2 ? (sr2(2, 3) | 0) : depth < 5 ? 2 : (sr2(1.3, 2.8) | 0);
  const spread = sr2(0.38, 0.68);
  for (let i = 0; i < nKids; i++) {
    const side = nKids === 1 ? 0 : (i / (nKids - 1) - 0.5) * 2;
    b.childDefs.push({
      angle: angle + side * spread + sr2(-0.15, 0.15),
      len: len * sr2(0.56, 0.72),
      width: width * sr2(0.52, 0.68),
    });
  }
  return b;
}

export function initTree(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")!;
  let animId: number;
  let windTime = 0;
  let roots: Branch[] = [];

  function buildTree(): void {
    seed = 42;
    roots = [];
    const W = canvas.width;
    const H = canvas.height;
    const cx = W * 0.62;
    const cy = H * 1.01;
    const tH = H * 0.8;
    const tW = W * 0.018;

    function make(x: number, y: number, ang: number, len: number, w: number, d: number): Branch | null {
      const b = makeBranch(x, y, ang, len, w, d);
      if (!b) return null;
      b.childDefs.forEach((cd) => {
        const c = make(b.x2, b.y2, cd.angle, cd.len, cd.width, d + 1);
        if (c) b.children.push(c);
      });
      return b;
    }

    const t1 = make(cx, cy, -Math.PI / 2 - 0.09, tH * 0.31, tW, 0);
    const t2 = make(cx, cy, -Math.PI / 2 + 0.13, tH * 0.28, tW * 0.82, 0);
    if (t1) roots.push(t1);
    if (t2) roots.push(t2);
  }

  function drawB(b: Branch, x1: number, y1: number, ex: number, ey: number, mx: number, my: number): void {
    const dr = b.depth / 10;
    const alpha = Math.max(0.07, 0.52 - dr * 0.32);
    const lw = Math.max(0.3, b.width * (1 - dr * 0.62));
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.strokeStyle = `rgba(200,185,150,${alpha})`;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.stroke();
    if (b.depth < 5) {
      const n = Math.floor((5 - b.depth) * 1.5);
      for (let i = 0; i < n; i++) {
        const tt = r2(0.05, 0.95);
        const px = x1 + (ex - x1) * tt;
        const py = y1 + (ey - y1) * tt;
        const pa = b.angle + Math.PI / 2 + r2(-0.4, 0.4);
        const hl = lw * r2(0.3, 1.4);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(pa) * hl, py + Math.sin(pa) * hl);
        ctx.strokeStyle = `rgba(200,185,150,${alpha * 0.35})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  function grow(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allDone = true;

    function proc(b: Branch): void {
      if (!b.done) {
        b.progress += 0.016 * (1 + b.depth * 0.09);
        if (b.progress >= 1) {
          b.progress = 1;
          b.done = true;
        } else {
          allDone = false;
        }
      }
      const t = ease(b.progress);
      const ex = b.x + (b.x2 - b.x) * t;
      const ey = b.y + (b.y2 - b.y) * t;
      const mx = b.x + (b.midX - b.x) * Math.min(t * 1.6, 1);
      const my = b.y + (b.midY - b.y) * Math.min(t * 1.6, 1);
      drawB(b, b.x, b.y, ex, ey, mx, my);
      if (b.done) b.children.forEach(proc);
    }

    roots.forEach(proc);
    animId = requestAnimationFrame(allDone ? sway : grow);
  }

  function sway(): void {
    windTime += 0.0035;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function ds(b: Branch, x1: number, y1: number, pOff: number): void {
      const sw =
        Math.sin(windTime * 0.85 + b.depth * 0.95 + b.angle * 2) *
        0.012 *
        Math.pow(b.depth, 0.75);
      const ang = b.angle + pOff + sw;
      const ex = x1 + Math.cos(ang) * b.len;
      const ey = y1 + Math.sin(ang) * b.len;
      const mx = x1 + (b.midX - b.x) + Math.cos(ang + 0.25) * b.len * 0.15;
      const my = y1 + (b.midY - b.y) + Math.sin(ang + 0.25) * b.len * 0.15;
      const dr = b.depth / 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.strokeStyle = `rgba(200,185,150,${Math.max(0.07, 0.52 - dr * 0.32)})`;
      ctx.lineWidth = Math.max(0.3, b.width * (1 - dr * 0.62));
      ctx.lineCap = "round";
      ctx.stroke();
      b.children.forEach((c) => ds(c, ex, ey, pOff + sw * 0.58));
    }

    roots.forEach((r) => ds(r, r.x, r.y, 0));
    animId = requestAnimationFrame(sway);
  }

  function startGrow(): void {
    cancelAnimationFrame(animId);
    windTime = 0;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildTree();
    grow();
  }

  window.addEventListener("resize", startGrow);
  if (document.readyState === "complete") {
    startGrow();
  } else {
    window.addEventListener("load", startGrow);
  }
}
