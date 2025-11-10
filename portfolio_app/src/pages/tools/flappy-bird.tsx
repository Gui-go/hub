"use client";

import { useEffect, useRef, useState } from "react";

interface Score {
  name: string;
  score: number;
  distance: number;
  date: string;
}

type WindowMap = {
  map: boolean[][]; // rows x cols
  winW: number;
  winH: number;
  marginX: number;
  marginY: number;
};

type Building = {
  x: number;
  topHeight: number;
  width: number;
  bottomHeight: number;
  facadeColor?: string;
  roofStyle?: "flat" | "triangle";
  antenna?: boolean;
  windowMapTop?: WindowMap;
  windowMapBottom?: WindowMap;
  rooftopObjects?: string[];
};

const FlappyPlanePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedPlane, setSelectedPlane] = useState("/data/plane1.png");
  const [scores, setScores] = useState<Score[]>([]);

  const planeOptions = [
    { src: "/data/plane1.png", label: "Blue Plane" },
    { src: "/data/plane2.png", label: "Red Plane" },
    { src: "/data/plane3.png", label: "Green Plane" },
  ];

  const fetchScores = async () => {
    try {
      const response = await fetch("/api/highScores");
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      setScores(data.scores);
    } catch (error: any) {
      console.error("Error fetching scores:", error.message);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // ======= Preview Menu Animation (improved clouds & grass) =======
  useEffect(() => {
    if (gameStarted) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const planeImg = new Image();
    planeImg.src = selectedPlane;

    let x = 50;
    let y = 40;
    let dx = 1.5;

    const resizeCanvas = () => {
      canvas.width = 300;
      canvas.height = 120;
    };
    resizeCanvas();

    // preview clouds (multi-layer, simple)
    const previewClouds = [
      { x: 40, y: 28, s: 1.0, speed: 0.35, alpha: 0.85 },
      { x: 160, y: 22, s: 0.9, speed: 0.25, alpha: 0.75 },
      { x: 230, y: 38, s: 0.7, speed: 0.2, alpha: 0.8 },
      { x: 100, y: 18, s: 0.6, speed: 0.15, alpha: 0.7 },
    ];

    const drawSkyGradient = () => {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, "#bfe9ff");
      g.addColorStop(0.6, "#9ad0ff");
      g.addColorStop(1, "#87CEEB");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawPreviewCloud = (c: any) => {
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.beginPath();
      ctx.arc(c.x - 18 * c.s, c.y, 10 * c.s, 0, Math.PI * 2);
      ctx.arc(c.x + 8 * c.s, c.y - 3 * c.s, 14 * c.s, 0, Math.PI * 2);
      ctx.arc(c.x + 24 * c.s, c.y + 5 * c.s, 9 * c.s, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSkyGradient();

      // move preview clouds
      previewClouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > canvas.width + 30) c.x = -60 - Math.random() * 40;
        drawPreviewCloud(c);
      });

      // distant soft hill
      ctx.fillStyle = "rgba(100,180,120,0.18)";
      ctx.beginPath();
      ctx.ellipse(60, canvas.height - 18, 90, 22, 0, 0, Math.PI * 2);
      ctx.ellipse(210, canvas.height - 18, 70, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // thin grass at bottom of preview (improved layering)
      const grassTop = canvas.height - 12;
      ctx.fillStyle = "#7bbf3a";
      ctx.fillRect(0, grassTop, canvas.width, 12);

      // darker edge
      ctx.fillStyle = "#4c6b23";
      ctx.fillRect(0, canvas.height - 6, canvas.width, 6);

      // tiny blades & tufts
      ctx.fillStyle = "#6b8e23";
      for (let i = 0; i < canvas.width; i += 8) {
        ctx.beginPath();
        const bladeHeight = 5 + (i % 24 === 0 ? 3 : 0);
        ctx.moveTo(i, grassTop + 12);
        ctx.lineTo(i + 4, grassTop + 12 - bladeHeight);
        ctx.lineTo(i + 8, grassTop + 12);
        ctx.closePath();
        ctx.fill();
      }

      if (planeImg.complete) {
        ctx.drawImage(planeImg, x, y - 20, 60, 40);
      }

      x += dx;
      if (x > canvas.width - 60 || x < 0) dx *= -1;

      requestAnimationFrame(animate);
    };

    animate();

    // no explicit cleanup for preview animation — it will stop when component rerenders/gameStarted toggles
  }, [selectedPlane, gameStarted]);

  // ======= Helper: Buildings (lighter, no dark skyline blocks) =======
  const drawBuildingBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options?: { roof?: "flat" | "triangle"; windowMap?: WindowMap; antenna?: boolean; facadeColor?: string }
  ) => {
    const roof = options?.roof ?? "flat";
    const windowMap = options?.windowMap;

    // facade with vertical gradient
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    const base = options?.facadeColor ?? "#cfe8ff";
    g.addColorStop(0, base);
    g.addColorStop(0.7, shadeColor(base, -6));
    g.addColorStop(1, shadeColor(base, -12));
    ctx.fillStyle = g;
    roundRect(ctx, x, y, w, h, Math.min(8, w * 0.05));
    ctx.fill();

    // subtle left highlight
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(x + 2, y + 6, Math.max(3, Math.floor(w * 0.04)), Math.max(8, h - 12));

    // small shadow on right edge
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(x + w - Math.max(4, Math.floor(w * 0.05)), y + 6, Math.max(4, Math.floor(w * 0.04)), Math.max(8, h - 12));

    // Roof
    if (roof === "triangle") {
      ctx.fillStyle = shadeColor(base, -10);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w / 2, y - Math.min(18, w * 0.28));
      ctx.lineTo(x + w, y);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = shadeColor(base, -8);
      ctx.fillRect(x, y - 3, w, 3);
    }

    // rooftop objects (if any)
    if (options?.antenna && w >= 40 && h >= 60) {
      ctx.save();
      ctx.fillStyle = shadeColor(base, -18);
      const ax = x + w * 0.14;
      const ah = Math.min(18, Math.floor(h * 0.12));
      ctx.fillRect(ax, y - ah - 3, 2, ah);
      ctx.fillRect(ax - 4, y - ah - 3, 10, 2);
      ctx.restore();
    }

    // windows (stable pattern from windowMap or fallback)
    const winW = windowMap?.winW ?? 6;
    const winH = windowMap?.winH ?? 8;
    const marginX = windowMap?.marginX ?? 6;
    const marginY = windowMap?.marginY ?? 8;

    if (windowMap && windowMap.map.length > 0) {
      const rows = windowMap.map.length;
      const cols = windowMap.map[0].length;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = windowMap.map[r][c];
          const wx = x + marginX + c * (winW + 4);
          const wy = y + marginY + r * (winH + 6);
          // small window frame
          ctx.fillStyle = "rgba(0,0,0,0.06)";
          roundRect(ctx, wx - 1, wy - 1, winW + 2, winH + 2, 2);
          ctx.fill();

          ctx.fillStyle = lit ? "#fff4c2" : "#e8f6ff";
          roundRect(ctx, wx, wy, winW, winH, 2);
          ctx.fill();
        }
      }
    } else {
      // fallback: draw a simple grid of windows (deterministic-ish)
      const cols = Math.max(1, Math.floor((w - marginX * 2) / (winW + 4)));
      const rows = Math.max(1, Math.floor((h - marginY * 2) / (winH + 6)));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = (r + c) % 7 === 0; // deterministic pattern
          const wx = x + marginX + c * (winW + 4);
          const wy = y + marginY + r * (winH + 6);
          ctx.fillStyle = "rgba(0,0,0,0.06)";
          roundRect(ctx, wx - 1, wy - 1, winW + 2, winH + 2, 2);
          ctx.fill();

          ctx.fillStyle = lit ? "#fff4c2" : "#e8f6ff";
          roundRect(ctx, wx, wy, winW, winH, 2);
          ctx.fill();
        }
      }
    }

    // small balcony/ledge accents for wider buildings
    if (w > 70) {
      ctx.fillStyle = shadeColor(base, -14);
      for (let i = x + 8; i < x + w - 8; i += 30) {
        ctx.fillRect(i, y + Math.max(12, h / 3), 18, 4);
      }
    }
  };

  // util: rounded rect
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // util: shade color (simple hex adjust) - accepts #rrggbb
  const shadeColor = (hex: string, percent: number) => {
    // strip # if present
    const h = hex.replace('#', '');
    const num = parseInt(h, 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  // ======= Game Loop (improved clouds, ambient elements, layered grass) =======
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const planeImg = new Image();
    planeImg.src = selectedPlane;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.style.margin = "0";
      document.body.style.overflow = "hidden";
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let gravity = 0.25;
    let jump = -8;
    let buildingBaseWidth = 64;
    let gap = 300;
    let scrollSpeed = 1.5;
    let spawnEvery = 200;
    let currentScore = 0;
    let currentDistance = 0;

    const planeX = 80;
    const planeWidth = 60;
    const planeHeight = 40;

    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    let buildings: Building[] = [];
    let frame = 0;
    let gameOver = false;
    let difficulty = "Easy";
    let scoreSaved = false;

    // advanced clouds for the game background (multi-layer parallax)
    type Cloud = { x: number; y: number; scale: number; speed: number; alpha: number; layer: number };
    const clouds: Cloud[] = [];
    const createClouds = () => {
      clouds.length = 0;
      const baseCount = Math.max(5, Math.floor(canvas.width / 220));
      for (let i = 0; i < baseCount; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: 40 + Math.random() * (canvas.height * 0.45),
          scale: 0.6 + Math.random() * 1.6,
          speed: 0.1 + Math.random() * 0.8,
          alpha: 0.6 + Math.random() * 0.4,
          layer: Math.random() > 0.6 ? 0 : 1,
        });
      }
    };
    createClouds();

    // ambient birds/objects
    const birds: { x: number; y: number; speed: number; dir: number }[] = [];
    const createBirds = () => {
      birds.length = 0;
      const count = Math.max(3, Math.floor(canvas.width / 600));
      for (let i = 0; i < count; i++) {
        birds.push({ x: Math.random() * canvas.width, y: 50 + Math.random() * 150, speed: 0.6 + Math.random() * 1.2, dir: Math.random() > 0.5 ? 1 : -1 });
      }
    };
    createBirds();

    const saveScore = async () => {
      if (!playerName.trim() || scoreSaved) return;
      scoreSaved = true;

      try {
        const response = await fetch("/api/highScores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: playerName,
            score: currentScore,
            distance: Math.floor(currentDistance),
            date: new Date().toISOString(),
          }),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        await fetchScores();
      } catch (error: any) {
        console.error("Error saving score:", error.message);
      }
    };

    const flap = () => {
      if (!gameOver) birdVelocity = jump;
    };

    const returnToMenu = () => {
      if (gameOver) {
        setGameStarted(false);
        setNameInput("");
        setPlayerName("");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (gameOver) returnToMenu();
        else flap();
      } else if (e.code === "Escape") {
        if (gameOver) returnToMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("click", flap);

    const drawSkyWithClouds = () => {
      // sky gradient with a soft warm top for ambiance
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, "#cfeffd");
      g.addColorStop(0.55, "#9ad0ff");
      g.addColorStop(1, "#87CEEB");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // faint sun glow (off to the right)
      const sunX = canvas.width * 0.85;
      const sunY = canvas.height * 0.12;
      const sunRad = Math.min(canvas.width, canvas.height) * 0.06;
      const solar = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRad);
      solar.addColorStop(0, 'rgba(255,240,200,0.9)');
      solar.addColorStop(0.6, 'rgba(255,240,200,0.14)');
      solar.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.fillStyle = solar;
      ctx.fillRect(sunX - sunRad, sunY - sunRad, sunRad * 2, sunRad * 2);

      // Clouds by layer (farther ones slower and dimmer)
      clouds.forEach((c) => {
        ctx.save();
        ctx.globalAlpha = c.alpha * (c.layer === 0 ? 0.8 : 1);
        // subtle shadow below cloud for depth
        ctx.beginPath();
        ctx.ellipse(c.x - 10 * c.scale, c.y + 6 * c.scale, 24 * c.scale, 10 * c.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${0.3 * c.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(c.x - 30 * c.scale, c.y, 18 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x, c.y - 4 * c.scale, 26 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 28 * c.scale, c.y + 6 * c.scale, 18 * c.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fill();
        ctx.restore();
      });

      // foreground cloud clusters for depth
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.72, 72, 22, 0, Math.PI * 2);
      ctx.arc(canvas.width * 0.74, 86, 18, 0, Math.PI * 2);
      ctx.arc(canvas.width * 0.68, 86, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fill();
      ctx.restore();

      // draw birds
      birds.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-6 * b.dir, -4);
        ctx.lineTo(-12 * b.dir, 0);
        ctx.lineTo(-6 * b.dir, 4);
        ctx.closePath();
        ctx.fillStyle = 'rgba(40,40,40,0.7)';
        ctx.fill();
        ctx.restore();
      });
    };

    // helper to generate a stable window map for a given building block
    const generateWindowMap = (w: number, h: number) => {
      const winW = 6;
      const winH = 8;
      const marginX = 6;
      const marginY = 8;
      const cols = Math.max(1, Math.floor((w - marginX * 2) / (winW + 4)));
      const rows = Math.max(1, Math.floor((h - marginY * 2) / (winH + 6)));
      const map: boolean[][] = [];
      // stable-ish randomness using width+height
      const seed = Math.floor(w * 7 + h * 13 + Math.random() * 9999);
      let s = seed;
      const rnd = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      for (let r = 0; r < rows; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < cols; c++) {
          row.push(rnd() > 0.8);
        }
        map.push(row);
      }
      return { map, winW, winH, marginX, marginY } as WindowMap;
    };

    const spawnBuildings = () => {
      const minMargin = 50;
      const maxTop = canvas.height - gap - minMargin;
      const topHeight = Math.random() * (maxTop - minMargin) + minMargin;
      const width = Math.max(50, Math.min(110, buildingBaseWidth + Math.floor(Math.random() * 40) - 10));
      const bottomHeight = canvas.height - (topHeight + gap);

      // pick a subtle facade palette
      const palettes = ["#cfe8ff", "#e8f2ff", "#f6efd9", "#e8fff1", "#ffece8"];
      const facadeColor = palettes[Math.floor(Math.random() * palettes.length)];

      // window maps for top and bottom blocks
      const topMap = generateWindowMap(width, topHeight);
      const bottomMap = generateWindowMap(width, bottomHeight);

      const b: Building = {
        x: canvas.width,
        topHeight,
        width,
        bottomHeight,
        facadeColor,
        roofStyle: Math.random() > 0.6 ? "triangle" : "flat",
        antenna: Math.random() > 0.7,
        windowMapTop: topMap,
        windowMapBottom: bottomMap,
        rooftopObjects: Math.random() > 0.85 ? ["tank"] : [],
      };
      buildings.push(b);
    };

    const drawHills = () => {
      // distant rolling hills
      ctx.save();
      const hillHeight = Math.max(40, Math.min(150, canvas.height * 0.12));
      ctx.fillStyle = '#d9f0d9';
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.2, canvas.height - 20, canvas.width * 0.45, hillHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#c7eac7';
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.65, canvas.height - 10, canvas.width * 0.35, hillHeight * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawGround = () => {
      // layered grass
      const grassHeight = Math.min(120, Math.max(40, Math.floor(canvas.height * 0.045)));
      const grassTop = canvas.height - grassHeight;

      // distant darker strip (soil/edge)
      ctx.fillStyle = '#547239';
      ctx.fillRect(0, canvas.height - Math.max(20, grassHeight * 0.18), canvas.width, Math.max(20, grassHeight * 0.18));

      // main grass band
      ctx.fillStyle = '#7bbf3a';
      ctx.fillRect(0, grassTop, canvas.width, grassHeight);

      // small flowers and tufts
      for (let i = 20; i < canvas.width; i += 28) {
        if (Math.random() > 0.86) {
          const fx = i + (Math.random() * 8 - 4);
          const fy = grassTop + Math.random() * (grassHeight - 8) + 4;
          ctx.beginPath();
          ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffd1e6';
          ctx.fill();
          ctx.closePath();
        }
      }

      // blades (two passes for depth)
      ctx.fillStyle = '#6b8e23';
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath();
        const bladeHeight = (grassHeight * 0.25) + (i % 40 === 0 ? grassHeight * 0.22 : 0);
        ctx.moveTo(i, grassTop + grassHeight);
        ctx.lineTo(i + 5, grassTop + grassHeight - bladeHeight);
        ctx.lineTo(i + 10, grassTop + grassHeight);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = '#86c94a';
      for (let i = 5; i < canvas.width; i += 24) {
        ctx.beginPath();
        const bladeHeight = (grassHeight * 0.18) + (i % 80 === 0 ? grassHeight * 0.12 : 0);
        ctx.moveTo(i, grassTop + grassHeight);
        ctx.lineTo(i + 6, grassTop + grassHeight - bladeHeight);
        ctx.lineTo(i + 12, grassTop + grassHeight);
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawBuildings = () => {
      buildings.forEach((b) => {
        // draw top block
        const topX = b.x;
        const topY = 0;
        drawBuildingBlock(ctx, topX, topY, b.width, b.topHeight, {
          roof: b.roofStyle,
          windowMap: b.windowMapTop,
          antenna: false,
          facadeColor: b.facadeColor,
        });

        // small shadow under top block to show depth
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(topX, b.topHeight - 2, b.width, 4);

        // draw bottom block (rises from bottom)
        const bottomY = canvas.height - b.bottomHeight;
        drawBuildingBlock(ctx, b.x, bottomY, b.width, b.bottomHeight, {
          roof: 'flat',
          windowMap: b.windowMapBottom,
          antenna: b.antenna,
          facadeColor: b.facadeColor,
        });

        // rooftop objects like tank
        if (b.rooftopObjects && b.rooftopObjects.includes('tank')) {
          ctx.save();
          ctx.fillStyle = shadeColor(b.facadeColor ?? '#cfe8ff', -18);
          ctx.beginPath();
          ctx.ellipse(b.x + b.width * 0.7, 10, 8, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // update cloud positions (parallax by layer)
      clouds.forEach((c) => {
        c.x -= c.speed * (scrollSpeed / (c.layer === 0 ? 3.2 : 1.8));
        if (c.x < -200) c.x = canvas.width + Math.random() * 200;
      });

      // update birds
      birds.forEach((b) => {
        b.x += b.speed * b.dir;
        if (b.x < -40) b.x = canvas.width + 40;
        if (b.x > canvas.width + 40) b.x = -40;
      });

      drawSkyWithClouds();
      drawHills();

      if (frame % spawnEvery === 0) spawnBuildings();
      drawBuildings();
      buildings.forEach((b) => (b.x -= scrollSpeed));

      buildings = buildings.filter((b) => {
        if (b.x + b.width < 0) {
          currentScore++;
          return false;
        }
        return true;
      });

      if (planeImg.complete) {
        ctx.drawImage(planeImg, planeX - planeWidth / 2, birdY - planeHeight / 2, planeWidth, planeHeight);
      } else {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(planeX, birdY, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      birdVelocity += gravity;
      birdY += birdVelocity;

      if (birdY + planeHeight / 2 >= canvas.height || birdY - planeHeight / 2 <= 0) gameOver = true;

      buildings.forEach((b) => {
        const planeRight = planeX + planeWidth / 2;
        const planeLeft = planeX - planeWidth / 2;
        const hitsHorizontally = planeRight > b.x && planeLeft < b.x + b.width;
        if (hitsHorizontally) {
          const gapTop = b.topHeight;
          const gapBottom = canvas.height - b.bottomHeight;
          const planeTop = birdY - planeHeight / 2;
          const planeBottom = birdY + planeHeight / 2;
          if (planeTop < gapTop || planeBottom > gapBottom) gameOver = true;
        }
      });

      if (frame % 300 === 0 && frame !== 0) {
        if (currentScore < 10) {
          difficulty = "Easy";
          gap = Math.max(250, gap - 5);
          scrollSpeed = Math.min(2.5, scrollSpeed + 0.05);
          gravity = Math.min(0.35, gravity + 0.005);
          spawnEvery = Math.max(120, spawnEvery - 2);
        } else if (currentScore < 20) {
          difficulty = "Medium";
          gap = Math.max(200, gap - 5);
          scrollSpeed = Math.min(3.5, scrollSpeed + 0.1);
          gravity = Math.min(0.45, gravity + 0.01);
          spawnEvery = Math.max(120, spawnEvery - 2);
        } else {
          difficulty = "Hard";
          gap = Math.max(150, gap - 5);
          scrollSpeed = Math.min(5, scrollSpeed + 0.1);
          gravity = Math.min(0.6, gravity + 0.01);
          spawnEvery = Math.max(120, spawnEvery - 2);
        }
      }

      ctx.fillStyle = "#fff";
      ctx.font = "28px Arial";
      ctx.fillText(`Score: ${currentScore}`, 20, 40);
      ctx.fillText(`Difficulty: ${difficulty}`, 20, 80);
      ctx.fillText(`Player: ${playerName || "Guest"}`, 20, 120);
      ctx.textAlign = "right";
      ctx.fillText(`Distance: ${Math.floor(currentDistance)}m`, canvas.width - 20, 40);
      ctx.textAlign = "left";

      drawGround();

      if (gameOver) {
        saveScore();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "48px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2 - 20);
        ctx.font = "24px Arial";
        ctx.fillText("Space/Esc to return to menu", canvas.width / 2 - 180, canvas.height / 2 + 30);
      } else {
        currentDistance += scrollSpeed / 2;
        frame++;
        requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("click", flap);
    };
  }, [gameStarted, selectedPlane, playerName]);

  const handleStartGame = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setGameStarted(true);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white">
          <h1 className="text-4xl mb-6">Flappy Bird</h1>

          <div className="mb-4">
            <label htmlFor="playerName" className="block text-lg mb-2">
              Enter Your Name:
            </label>
            <input
              id="playerName"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="p-2 text-black rounded w-64"
              placeholder="Your name"
            />
          </div>

          <div className="mb-6 flex flex-col items-center">
            <p className="text-lg mb-2">Preview:</p>
            <canvas ref={previewCanvasRef} className="border border-gray-500 rounded" />
          </div>

          <div className="mb-6">
            <p className="text-lg mb-2">Choose Your Plane:</p>
            <div className="flex gap-4">
              {planeOptions.map((plane) => (
                <button
                  key={plane.src}
                  onClick={() => setSelectedPlane(plane.src)}
                  className={`p-2 rounded ${
                    selectedPlane === plane.src ? "bg-blue-500" : "bg-gray-500"
                  } hover:bg-blue-400 transition`}
                >
                  {plane.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg mb-2">High Scores:</p>
            <div className="bg-gray-700 p-4 rounded w-96">
              {scores.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="pr-2">Name</th>
                      <th className="pr-2">Score</th>
                      <th className="pr-2">Distance</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score, index) => (
                      <tr key={index}>
                        <td className="pr-2">{score.name}</td>
                        <td className="pr-2">{score.score}</td>
                        <td className="pr-2">{score.distance}m</td>
                        <td>{new Date(score.date).toLocaleDateString("en-GB")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No scores yet</p>
              )}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            disabled={!nameInput.trim()}
            className="px-6 py-3 bg-green-500 text-white rounded disabled:bg-gray-400 hover:bg-green-600 transition"
          >
            Start Game
          </button>
        </div>
      ) : (
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      )}
    </div>
  );
};

export default FlappyPlanePage;
