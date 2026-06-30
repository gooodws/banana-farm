const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.tabIndex = 0;

const coinsEl = document.getElementById("coins");
const totalPeelsEl = document.getElementById("totalPeels");
const collectionCountEl = document.getElementById("collectionCount");
const bagEl = document.getElementById("streak");
const sellCrateEl = document.getElementById("sellCrate");
const automationCountEl = document.getElementById("automationCount");
const superGaugeEl = document.getElementById("superGauge");
const messageEl = document.getElementById("message");
const lastNameEl = document.getElementById("lastName");
const lastDescriptionEl = document.getElementById("lastDescription");
const collectionEl = document.getElementById("collection");
const logEl = document.getElementById("log");
const saveStateEl = document.getElementById("saveState");
const superEtaEl = document.getElementById("superEta");
const soldCountEl = document.getElementById("soldCount");
const rankBadgeEl = document.getElementById("rankBadge");
const rankNameEl = document.getElementById("rankName");
const rankDescEl = document.getElementById("rankDesc");
const incomeRateEl = document.getElementById("incomeRate");
const nextGoalEl = document.getElementById("nextGoal");
const rankGaugeEl = document.getElementById("rankGauge");
const wipeButton = document.getElementById("wipeButton");
const sellButton = document.getElementById("sellButton");
const touchActionButton = document.getElementById("touchActionButton");
const shopButtons = Array.from(document.querySelectorAll(".shop-btn"));
const upgradeButtons = Array.from(document.querySelectorAll(".upgrade-btn"));
const openUpgradeButton = document.getElementById("openUpgradeButton");
const closeUpgradeButton = document.getElementById("closeUpgradeButton");
const upgradeOverlay = document.getElementById("upgradeOverlay");
const openCollectionButton = document.getElementById("openCollectionButton");
const closeCollectionButton = document.getElementById("closeCollectionButton");
const collectionOverlay = document.getElementById("collectionOverlay");

const SAVE_KEY = "banana-idle-farm-v3";
const SUPER_TARGET_MS = 2 * 60 * 60 * 1000;
const W = canvas.width;
const H = canvas.height;
let canvasPixelRatio = 1;
let canvasResolutionCheckAt = 0;

const tileSize = 78;
const farm = { x: 96, y: 132, cols: 4, rows: 5 };
const peelStation = { x: 790, y: 432, r: 76 };
const market = { x: 782, y: 220, r: 72 };
const bagLimit = 18;
const seedPackPrice = 18;
const replantBaseCost = 12;

const variants = [
  { id: "classic", name: "기본 바나나", rarity: "common", label: "기본", color: "#ffe36e", ink: "#5b4315", weight: 80, value: 5, description: "제일 바나나다운 바나나. 팔아도 마음이 편하다." },
  { id: "strawberry", name: "딸기우유 바나나", rarity: "common", label: "딸기", color: "#ff8cb7", ink: "#5e1835", weight: 52, value: 7, description: "색은 귀여운데 맛은 끝까지 바나나다." },
  { id: "mint", name: "민트 바나나", rarity: "common", label: "민트", color: "#65d6b5", ink: "#123f35", weight: 50, value: 7, description: "상쾌한 척을 하지만 결국 바나나다." },
  { id: "blue", name: "파란 바나나", rarity: "common", label: "파랑", color: "#64a8ff", ink: "#15365e", weight: 46, value: 8, description: "과학적으로 설명하기 어려운 파란 향." },
  { id: "grape", name: "포도 바나나", rarity: "common", label: "보라", color: "#9d74df", ink: "#28154c", weight: 42, value: 9, description: "바나나가 포도맛인 척하는 뻔뻔한 과일." },
  { id: "choco", name: "초코 바나나", rarity: "common", label: "초코", color: "#8a573f", ink: "#fff2df", weight: 40, value: 9, description: "이건 팔기 전에 한 입 먹고 싶어진다." },
  { id: "coal", name: "퇴근 바나나", rarity: "uncommon", label: "퇴근", color: "#373943", ink: "#f4e6bd", weight: 25, value: 16, description: "검고 피곤하지만 이상하게 값이 나간다." },
  { id: "office", name: "출근 바나나", rarity: "uncommon", label: "출근", color: "#f2c65f", ink: "#263040", weight: 23, value: 17, description: "서류 냄새가 나지만 손님들이 산다." },
  { id: "ninja", name: "닌자 바나나", rarity: "uncommon", label: "닌자", color: "#2f3340", ink: "#f6d744", weight: 20, value: 19, description: "까기 전까지 숨어 있었다고 주장한다." },
  { id: "robot", name: "로봇 바나나", rarity: "uncommon", label: "로봇", color: "#b8c2d6", ink: "#21334f", weight: 18, value: 21, description: "껍질에 버튼 같은 점이 있다." },
  { id: "dj", name: "디제이 바나나", rarity: "rare", label: "DJ", color: "#ff7a45", ink: "#2b1930", weight: 12, value: 36, description: "까는 소리가 비트처럼 들린다." },
  { id: "wizard", name: "마법사 바나나", rarity: "rare", label: "마법", color: "#845ec2", ink: "#fff7c7", weight: 9, value: 45, description: "껍질 끝에서 작은 별가루가 떨어진다." },
  { id: "researcher", name: "연구원 바나나", rarity: "rare", label: "연구", color: "#f7f2dc", ink: "#1f3a5f", weight: 8, value: 48, description: "자기 껍질에 대한 논문을 쓰는 중이다." },
  { id: "space", name: "우주 바나나", rarity: "rare", label: "우주", color: "#1f2440", ink: "#a5f3ff", weight: 7, value: 55, description: "무게가 조금 이상하다. 그래도 팔린다." },
  { id: "crown", name: "왕관 바나나", rarity: "epic", label: "왕관", color: "#ffe063", ink: "#8b4a00", weight: 4, value: 110, description: "과일 코너의 왕이라고 믿고 있다." },
  { id: "hacker", name: "해커 바나나", rarity: "epic", label: "해커", color: "#12151f", ink: "#45f58d", weight: 3, value: 135, description: "판매가를 스스로 올리려는 낌새가 있다." },
  { id: "rainbow", name: "무지개 바나나", rarity: "epic", label: "무지개", color: "#ffffff", ink: "#202431", weight: 2, value: 180, description: "색깔이 너무 많아서 계산대가 잠깐 멈춘다." },
  { id: "super", name: "슈퍼바나나", rarity: "legendary", label: "SUPER", color: "#fff06a", ink: "#b45b00", weight: 0, value: 1200, description: "두 시간의 집념이 빛으로 압축된 바나나." },
];

const variantMap = Object.fromEntries(variants.map((variant) => [variant.id, variant]));
const rarityMeta = {
  common: { name: "일반", color: "#657184", peelSeconds: 1.4 },
  uncommon: { name: "특이", color: "#1f8b5f", peelSeconds: 2.5 },
  rare: { name: "희귀", color: "#2f78cf", peelSeconds: 4.2 },
  epic: { name: "초희귀", color: "#7459b8", peelSeconds: 7.4 },
  legendary: { name: "전설", color: "#f06f39", peelSeconds: 13 },
};

const automationDefs = {
  tiller: { name: "괭이 드론", short: "괭이", basePrice: 45, interval: 5.6, maxLevel: 5, desc: "빈 칸을 자동으로 갈아줌" },
  planter: { name: "심는 손", short: "심기", basePrice: 75, interval: 6.2, maxLevel: 5, desc: "갈린 칸에 묘목을 심음" },
  sprinkler: { name: "스프링클러", short: "물", basePrice: 95, interval: 4.8, maxLevel: 5, desc: "나무에 물을 줘서 성장시킴" },
  harvester: { name: "수확 집게", short: "수확", basePrice: 150, interval: 5.4, maxLevel: 5, desc: "익은 바나나를 가방에 넣음" },
  peeler: { name: "껍질 기계", short: "까기", basePrice: 230, interval: 0, maxLevel: 5, desc: "가방 바나나를 천천히 깜" },
  seller: { name: "자동 판매대", short: "판매", basePrice: 320, interval: 5.8, maxLevel: 5, desc: "판매함 바나나를 자동 판매" },
};

const farmUpgradeDefs = {
  banana: { name: "판매가 레벨", icon: "🍌", basePrice: 90, maxLevel: 10, desc: "깐 바나나를 팔 때 받는 코인 상승" },
  seedling: { name: "묘목 레벨", icon: "🌱", basePrice: 120, maxLevel: 10, desc: "새 나무의 좋은 바나나 확률 상승" },
};

const rankDefs = [
  { name: "손바닥 바나나밭", threshold: 0, desc: "손으로 갈고 심고 수확해서 첫 자동화를 노립니다." },
  { name: "동네 바나나 노점", threshold: 80, desc: "수확한 바나나가 동네에서 슬슬 팔리기 시작합니다." },
  { name: "작은 자동화 농장", threshold: 260, desc: "장비가 하나씩 붙으면서 손이 조금씩 편해집니다." },
  { name: "바나나 작업장", threshold: 760, desc: "까기와 판매 루프가 돌아가며 돈맛이 나기 시작합니다." },
  { name: "희귀 바나나 연구소", threshold: 1800, desc: "묘목 개량으로 특이한 바나나가 더 자주 나옵니다." },
  { name: "바나나 체인 1호점", threshold: 4200, desc: "수동 농장이 아니라 사업처럼 굴러가기 시작합니다." },
  { name: "바나나 재벌 견습", threshold: 9200, desc: "자동화가 농장을 먹여 살리고, 플레이어는 희귀만 기다립니다." },
  { name: "슈퍼바나나 기업", threshold: 20000, desc: "이제 목표는 하나입니다. 전설 바나나를 계속 찍어내기." },
];

const seedlingLooks = [
  { trunk: "#7b512b", trunk2: "#a96a38", leaf: "#238b58", leaf2: "#36b66b", accent: "#ffd84a", leafCount: 5, height: 0.9, spread: 0.88, fruit: "#ffe36e" },
  { trunk: "#76502f", trunk2: "#bd7a40", leaf: "#1f8b5f", leaf2: "#47c27b", accent: "#88d96d", leafCount: 6, height: 0.98, spread: 0.96, fruit: "#ffdf57" },
  { trunk: "#684628", trunk2: "#b46b34", leaf: "#168f65", leaf2: "#6bd691", accent: "#65d6b5", leafCount: 7, height: 1.04, spread: 1.02, fruit: "#ffd94b" },
  { trunk: "#684026", trunk2: "#c27b3c", leaf: "#247a62", leaf2: "#78d47e", accent: "#64a8ff", leafCount: 7, height: 1.1, spread: 1.08, fruit: "#ffe063" },
  { trunk: "#5d3d2b", trunk2: "#cc8a42", leaf: "#2a725d", leaf2: "#9bd66d", accent: "#9d74df", leafCount: 8, height: 1.16, spread: 1.13, fruit: "#ffdc45" },
  { trunk: "#57372b", trunk2: "#d39148", leaf: "#226a57", leaf2: "#b8dc69", accent: "#ff8cb7", leafCount: 8, height: 1.22, spread: 1.18, fruit: "#ffd84a" },
  { trunk: "#4f342b", trunk2: "#dc9f4d", leaf: "#205d54", leaf2: "#d6d667", accent: "#ff7a45", leafCount: 9, height: 1.28, spread: 1.23, fruit: "#ffe36e" },
  { trunk: "#4b312b", trunk2: "#e0ad56", leaf: "#245365", leaf2: "#6fe0a5", accent: "#845ec2", leafCount: 9, height: 1.34, spread: 1.28, fruit: "#ffec6a" },
  { trunk: "#44302e", trunk2: "#e8bc5d", leaf: "#204c69", leaf2: "#8ed8ff", accent: "#45f58d", leafCount: 10, height: 1.4, spread: 1.33, fruit: "#fff06a" },
  { trunk: "#3a2b30", trunk2: "#f1c95e", leaf: "#2a3f6f", leaf2: "#fff06a", accent: "#f06f39", leafCount: 10, height: 1.48, spread: 1.38, fruit: "#fff06a" },
];

const state = {
  selectedTool: "move",
  coins: 12,
  bananaLevel: 1,
  seedlingLevel: 1,
  totalPeels: 0,
  totalSold: 0,
  revenue: 0,
  superChargeMs: 0,
  tiles: [],
  bag: [],
  currentPeel: null,
  sellCrate: [],
  collection: {},
  log: [],
  automation: makeAutomationState(),
  player: {
    x: farm.x + tileSize * 0.5,
    y: farm.y + tileSize * 4.5,
    targetX: farm.x + tileSize * 0.5,
    targetY: farm.y + tileSize * 4.5,
    speed: 190,
    facing: 1,
  },
};

const keys = { up: false, down: false, left: false, right: false, action: false };
const pointer = { x: 0, y: 0, tile: -1, down: false };
let queuedAction = null;
let particles = [];
let floaters = [];
let hitEffects = [];
let resultReveal = null;
let lastTime = 0;
let saveTimer = 0;
let lastSpaceActionAt = 0;
let touchFarmHoldActive = false;
let touchFarmHoldTimer = 0;

function makeAutomationState() {
  return Object.fromEntries(Object.keys(automationDefs).map((id) => [id, { level: 0, timer: 0 }]));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeTiles() {
  return Array.from({ length: farm.cols * farm.rows }, () => ({
    tilled: false,
    plant: null,
  }));
}

function tileCenter(index) {
  const col = index % farm.cols;
  const row = Math.floor(index / farm.cols);
  return {
    x: farm.x + col * tileSize + tileSize / 2,
    y: farm.y + row * tileSize + tileSize / 2,
  };
}

function tileAt(x, y) {
  const col = Math.floor((x - farm.x) / tileSize);
  const row = Math.floor((y - farm.y) / tileSize);
  if (col < 0 || row < 0 || col >= farm.cols || row >= farm.rows) return -1;
  return row * farm.cols + col;
}

function atTileWorkSpot(index) {
  if (index < 0) return false;
  const center = tileCenter(index);
  return distance(state.player.x, state.player.y, center.x, center.y) < 8;
}

function atPeelStation() {
  return distance(state.player.x, state.player.y, peelStation.x, peelStation.y) < peelStation.r;
}

function atMarket() {
  return distance(state.player.x, state.player.y, market.x, market.y) < market.r;
}

function setMoveTarget(x, y) {
  state.player.targetX = clamp(x, 42, W - 42);
  state.player.targetY = clamp(y, 88, H - 36);
}

function setMessage(text) {
  messageEl.textContent = text;
}

function addLog(text) {
  state.log.unshift(text);
  state.log = state.log.slice(0, 8);
  renderLog();
}

function addFloater(text, x, y, color = "#202431") {
  floaters.push({ text, x, y, color, life: 1.2 });
}

function burst(x, y, color, count = 12) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 45 + Math.random() * 110;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 35,
      r: 2 + Math.random() * 3.5,
      color,
      life: 0.55 + Math.random() * 0.55,
    });
  }
}

function vibrate(ms = 16) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(ms);
  }
}

function hitImpact(x, y, color = "#ffd84a", label = "") {
  hitEffects.push({ x, y, color, label, life: 0.34, maxLife: 0.34, radius: 8 });
  burst(x, y, color, 6);
  if (label) addFloater(label, x, y - 16, color);
  vibrate(12);
}

function peelSegmentCount(variant) {
  return {
    common: 3,
    uncommon: 4,
    rare: 5,
    epic: 5,
    legendary: 5,
  }[variant.rarity] || 3;
}

function rarityGlow(variant) {
  return {
    common: 0,
    uncommon: 0.18,
    rare: 0.28,
    epic: 0.42,
    legendary: 0.62,
  }[variant.rarity] || 0;
}

function isShowcasePeel(variant) {
  return variant.rarity === "rare" || variant.rarity === "epic" || variant.rarity === "legendary";
}

function shouldShowcasePeel(variant) {
  return isShowcasePeel(variant) && !state.collection[variant.id];
}

function itemVariant(item) {
  return variantMap[item?.variantId] || variants[0];
}

function createItem(variant) {
  const meta = rarityMeta[variant.rarity];
  return {
    variantId: variant.id,
    progress: 0,
    required: meta.peelSeconds,
    value: Math.round(variant.value * bananaValueMultiplier()),
  };
}

function bananaValueMultiplier() {
  return 1 + (state.bananaLevel - 1) * 0.14;
}

function totalAutomationLevel() {
  return Object.values(state.automation).reduce((sum, item) => sum + (item.level || 0), 0);
}

function collectionFoundCount() {
  return variants.filter((variant) => state.collection[variant.id]).length;
}

function farmScore() {
  return Math.floor(state.revenue + state.totalPeels * 4 + totalAutomationLevel() * 35 + collectionFoundCount() * 18);
}

function currentRank() {
  const score = farmScore();
  let rank = rankDefs[0];
  let index = 0;
  for (let i = 0; i < rankDefs.length; i += 1) {
    if (score >= rankDefs[i].threshold) {
      rank = rankDefs[i];
      index = i;
    }
  }
  const next = rankDefs[index + 1] || null;
  const progress = next ? clamp((score - rank.threshold) / (next.threshold - rank.threshold), 0, 1) : 1;
  return { rank, index, next, progress, score };
}

function superProgress() {
  return clamp(state.superChargeMs / SUPER_TARGET_MS, 0, 1);
}

function superChance(seedlingLevel = state.seedlingLevel) {
  const progress = superProgress();
  if (progress >= 1) return 1;
  const levelBonus = Math.max(0, seedlingLevel - 1) * 0.0025;
  return progress > 0.82 ? 0.025 + levelBonus : levelBonus * 0.25;
}

function rarityWeight(variant, seedlingLevel) {
  const bonus = Math.max(0, seedlingLevel - 1);
  const multipliers = {
    common: Math.max(0.28, 1 - bonus * 0.075),
    uncommon: 1 + bonus * 0.22,
    rare: 1 + bonus * 0.38,
    epic: 1 + bonus * 0.58,
  };
  return variant.weight * (multipliers[variant.rarity] || 1);
}

function pickVariant(seedlingLevel = state.seedlingLevel) {
  if (Math.random() < superChance(seedlingLevel)) {
    state.superChargeMs = 0;
    return variantMap.super;
  }

  const pool = variants.filter((variant) => variant.id !== "super");
  const totalWeight = pool.reduce((sum, variant) => sum + rarityWeight(variant, seedlingLevel), 0);
  let roll = Math.random() * totalWeight;
  for (const variant of pool) {
    roll -= rarityWeight(variant, seedlingLevel);
    if (roll <= 0) return variant;
  }
  return pool[0];
}

function addWorkTime(seconds) {
  state.superChargeMs = clamp(state.superChargeMs + seconds * 1000, 0, SUPER_TARGET_MS);
}

function plantTile(index) {
  const tile = state.tiles[index];
  if (!tile || !tile.tilled || tile.plant) return false;
  tile.plant = {
    growth: 0.08,
    water: 0,
    fruit: false,
    cooldown: 0,
    seedlingLevel: state.seedlingLevel,
  };
  return true;
}

function waterTile(index, boost = 0.18) {
  const tile = state.tiles[index];
  if (!tile?.plant) return false;
  tile.plant.water = Math.max(tile.plant.water, 8);
  tile.plant.growth = clamp(tile.plant.growth + (tile.plant.growth < 1 ? boost : 0), 0, 1);
  if (tile.plant.growth >= 1) {
    tile.plant.fruit = true;
    tile.plant.cooldown = 8;
  }
  return true;
}

function harvestTile(index) {
  const tile = state.tiles[index];
  if (!tile?.plant || tile.plant.growth < 1 || !tile.plant.fruit || state.bag.length >= bagLimit) return false;
  const variant = pickVariant(tile.plant.seedlingLevel || 1);
  state.bag.push(createItem(variant));
  tile.plant.fruit = false;
  tile.plant.cooldown = 9;
  tile.plant.water = 0;
  return true;
}

function replantCost() {
  return replantBaseCost + state.seedlingLevel * 9;
}

function canReplantTile(index) {
  const plant = state.tiles[index]?.plant;
  return Boolean(plant && (plant.seedlingLevel || 1) < state.seedlingLevel && !plant.fruit);
}

function replantTile(index) {
  const tile = state.tiles[index];
  if (!tile?.plant) return false;
  if ((tile.plant.seedlingLevel || 1) >= state.seedlingLevel) {
    setMessage("이미 현재 묘목 레벨의 나무입니다.");
    return false;
  }
  if (tile.plant.fruit) {
    setMessage("열린 바나나를 먼저 수확한 뒤 재식재하세요.");
    return false;
  }
  const cost = replantCost();
  if (state.coins < cost) {
    setMessage(`재식재 비용 ${cost}코인이 필요합니다.`);
    return false;
  }
  state.coins -= cost;
  tile.tilled = true;
  tile.plant = {
    growth: 0.08,
    water: 0,
    fruit: false,
    cooldown: 0,
    seedlingLevel: state.seedlingLevel,
  };
  return true;
}

function applyTileAction(index, tool = state.selectedTool, workSeconds = 0.6, source = "manual") {
  const tile = state.tiles[index];
  if (!tile) return false;
  const center = tileCenter(index);

  if (tool === "move") {
    setMoveTarget(center.x, center.y);
    return true;
  }

  if (tool === "hoe") {
    if (tile.plant) {
      setMessage("나무가 있는 칸은 갈 수 없습니다.");
      return false;
    }
    if (tile.tilled) {
      setMessage("이미 갈아둔 밭입니다.");
      return false;
    }
    tile.tilled = true;
    addWorkTime(workSeconds);
    if (source === "manual") {
      addLog("밭을 갈았습니다.");
      addFloater("괭이질", center.x, center.y - 18, "#8a5a2d");
      burst(center.x, center.y, "#8a5a2d", 10);
      hitImpact(center.x, center.y, "#8a5a2d");
      setMessage("밭을 갈았습니다. 이제 묘목을 심을 수 있습니다.");
    }
    saveGame();
    return true;
  }

  if (tool === "plant") {
    if (!tile.tilled) {
      setMessage("먼저 괭이로 밭을 갈아야 합니다.");
      return false;
    }
    if (tile.plant) {
      setMessage("이미 바나나 나무가 자라고 있습니다.");
      return false;
    }
    plantTile(index);
    addWorkTime(workSeconds);
    if (source === "manual") {
      addLog("바나나 묘목을 심었습니다.");
      addFloater("묘목", center.x, center.y - 18, "#1f8b5f");
      burst(center.x, center.y, "#1f8b5f", 8);
      hitImpact(center.x, center.y, "#1f8b5f");
      setMessage("묘목을 심었습니다. 물을 주면 빨리 자랍니다.");
    }
    saveGame();
    return true;
  }

  if (tool === "water") {
    if (!tile.plant) {
      setMessage("물을 줄 나무가 없습니다.");
      return false;
    }
    waterTile(index, 0.2);
    addWorkTime(workSeconds);
    if (source === "manual") {
      addLog("물을 줬습니다.");
      addFloater("물 주기", center.x, center.y - 18, "#2f78cf");
      burst(center.x, center.y, "#5ec8ff", 12);
      hitImpact(center.x, center.y, "#2f78cf");
      setMessage("물을 줬습니다. 성장 속도가 올라갑니다.");
    }
    saveGame();
    return true;
  }

  if (tool === "harvest") {
    if (!tile.plant || tile.plant.growth < 1) {
      setMessage("아직 수확할 바나나가 없습니다.");
      return false;
    }
    if (!tile.plant.fruit) {
      setMessage("나무는 컸지만 바나나가 아직 안 열렸습니다. 물을 주고 기다리세요.");
      return false;
    }
    if (state.bag.length >= bagLimit) {
      setMessage(`가방 ${bagLimit}칸이 꽉 찼습니다. 까기대에서 먼저 몇 개 까세요.`);
      return false;
    }
    harvestTile(index);
    addWorkTime(workSeconds);
    if (source === "manual") {
      addLog("미확인 바나나를 수확했습니다.");
      addFloater("+바나나", center.x, center.y - 23, "#1f8b5f");
      burst(center.x, center.y, "#ffd84a", 22);
      hitImpact(center.x, center.y, "#ffd84a");
      setMessage("미확인 바나나를 수확했습니다. 까기대에서 까보세요.");
    }
    saveGame();
    return true;
  }

  if (tool === "replant") {
    if (!canReplantTile(index)) {
      setMessage("이 칸은 재식재할 필요가 없습니다.");
      return false;
    }
    const oldLevel = tile.plant.seedlingLevel || 1;
    if (!replantTile(index)) return false;
    addWorkTime(workSeconds);
    if (source === "manual") {
      addLog(`묘목 Lv.${oldLevel} 나무를 Lv.${state.seedlingLevel}로 재식재`);
      addFloater("재식재", center.x, center.y - 20, "#7459b8");
      burst(center.x, center.y, "#7459b8", 18);
      hitImpact(center.x, center.y, "#7459b8");
      setMessage(`재식재 완료. 이제 이 나무는 묘목 Lv.${state.seedlingLevel} 확률을 씁니다.`);
    }
    saveGame();
    return true;
  }

  return false;
}

function requestTileAction(index, tool = state.selectedTool, workSeconds = 0.6) {
  if (index < 0) return false;
  const center = tileCenter(index);
  if (atTileWorkSpot(index)) {
    return applyTileAction(index, tool, workSeconds);
  }
  queuedAction = { type: "tile", index, tool, workSeconds };
  setMoveTarget(center.x, center.y);
  setMessage("그 칸으로 이동 중입니다.");
  return true;
}

function requestSmartTileAction(index) {
  if (index < 0) return false;
  const tool = nextToolForTile(index);
  if (tool) {
    state.selectedTool = tool;
    return requestTileAction(index, tool);
  }
  const center = tileCenter(index);
  queuedAction = null;
  setMoveTarget(center.x, center.y);
  setMessage("그 칸으로 이동합니다.");
  return true;
}

function startPeel() {
  if (state.currentPeel) return true;
  if (!state.bag.length) {
    setMessage("깔 바나나가 없습니다. 먼저 밭에서 수확하세요.");
    return false;
  }
  state.currentPeel = state.bag.shift();
  const variant = itemVariant(state.currentPeel);
  setMessage(`${rarityMeta[variant.rarity].name} 등급 미확인 바나나입니다. 좋은 바나나는 까는 데 오래 걸립니다.`);
  saveGame();
  return true;
}

function peelWork(seconds, source = "manual") {
  if (!startPeel()) return false;
  const item = state.currentPeel;
  item.progress = clamp(item.progress + seconds / item.required, 0, 1);
  addWorkTime(seconds);
  if (source === "manual") {
    const variant = itemVariant(item);
    const color = item.progress > 0.45 ? variant.color : "#ffd84a";
    const count = variant.rarity === "legendary" ? 12 : variant.rarity === "epic" ? 9 : variant.rarity === "rare" ? 7 : 4;
    if (Math.random() < 0.55) burst(peelStation.x + 6 - Math.random() * 12, peelStation.y - 44 + Math.random() * 10, color, count);
    if (shouldShowcasePeel(variant) && Math.random() < 0.7) burst(W / 2 + Math.random() * 34 - 17, H / 2 - 34 + Math.random() * 22, color, count + 5);
  }
  if (item.progress >= 1) finishPeel(source);
  saveGame();
  return true;
}

function applyPeelWork(seconds) {
  if (!atPeelStation()) {
    setMessage("바나나는 까기대 앞에서만 깔 수 있습니다.");
    return false;
  }
  return peelWork(seconds, "manual");
}

function finishPeel(source = "manual") {
  const item = state.currentPeel;
  if (!item) return;
  const variant = itemVariant(item);
  const first = !state.collection[variant.id];
  state.currentPeel = null;
  state.totalPeels += 1;
  state.sellCrate.push(variant.id);
  state.collection[variant.id] = (state.collection[variant.id] || 0) + 1;

  lastNameEl.textContent = variant.name;
  lastNameEl.style.color = rarityMeta[variant.rarity].color;
  lastDescriptionEl.textContent = `${rarityMeta[variant.rarity].name} 등급. ${variant.description} 판매가 ${Math.round(variant.value * bananaValueMultiplier())}코인.`;
  addLog(first ? `신규 발견: ${variant.name}` : `${variant.name} 판매함에 추가`);
  setMessage(first ? `${variant.name} 발견. 판매함에 넣었습니다.` : `${variant.name} 하나 더 깠습니다.`);
  burst(peelStation.x, peelStation.y - 36, variant.color, variant.id === "super" ? 120 : 42);
  if (isShowcasePeel(variant) && first) {
    resultReveal = { variantId: variant.id, life: 2.5, maxLife: 2.5, first };
  }
  renderCollection();
  if (source === "auto" && automationLevel("seller") > 0) sellSome(automationLevel("seller"), "auto");
}

function sellSome(count = Infinity, source = "manual") {
  if (!state.sellCrate.length) {
    if (source === "manual") setMessage("판매함이 비어 있습니다. 바나나를 먼저 까세요.");
    return false;
  }
  const amount = Math.min(state.sellCrate.length, count);
  const sold = state.sellCrate.splice(0, amount);
  const income = sold.reduce((sum, id) => sum + Math.round((variantMap[id]?.value || 0) * bananaValueMultiplier()), 0);
  state.coins += income;
  state.revenue += income;
  state.totalSold += sold.length;
  addLog(`${sold.length}개 판매: +${income}코인`);
  addFloater(`+${income}`, market.x, market.y - 42, "#c9821c");
  burst(market.x, market.y - 20, "#ffd84a", 18);
  if (source === "manual") setMessage(`바나나 ${sold.length}개를 팔아서 ${income}코인을 벌었습니다.`);
  saveGame();
  return true;
}

function applySell() {
  if (!atMarket()) {
    setMessage("판매대 앞에서만 판매할 수 있습니다.");
    return false;
  }
  return sellSome();
}

function currentPlayerTile() {
  return tileAt(state.player.x, state.player.y);
}

function nextToolForTile(index) {
  const tile = state.tiles[index];
  if (!tile) return null;
  if (!tile.tilled && !tile.plant) return "hoe";
  if (tile.tilled && !tile.plant) return "plant";
  if (tile.plant?.growth >= 1 && tile.plant.fruit) return "harvest";
  if (canReplantTile(index)) return "replant";
  if (tile.plant) return "water";
  return null;
}

function nextFarmTask() {
  const priorities = [
    (tile) => tile.plant?.growth >= 1 && tile.plant.fruit,
    (_tile, index) => canReplantTile(index),
    (tile) => tile.plant && (tile.plant.growth < 1 || tile.plant.water < 2),
    (tile) => tile.tilled && !tile.plant,
    (tile) => !tile.tilled && !tile.plant,
  ];

  for (const predicate of priorities) {
    let best = null;
    for (let index = 0; index < state.tiles.length; index += 1) {
      const tile = state.tiles[index];
      if (!predicate(tile, index)) continue;
      const center = tileCenter(index);
      const dist = distance(state.player.x, state.player.y, center.x, center.y);
      if (!best || dist < best.dist) {
        best = { index, tool: nextToolForTile(index), dist };
      }
    }
    if (best?.tool) return best;
  }
  return null;
}

function performFarmButtonAction() {
  if (queuedAction?.type === "tile") return true;

  const current = currentPlayerTile();
  const currentTool = nextToolForTile(current);
  if (currentTool) {
    state.selectedTool = currentTool;
    return requestTileAction(current, currentTool, 0.72);
  }

  const task = nextFarmTask();
  if (task) {
    state.selectedTool = task.tool;
    requestTileAction(task.index, task.tool);
    return true;
  }

  setMessage("농장에 지금 할 일이 없습니다. 까기대와 판매대는 직접 눌러주세요.");
  return false;
}

function performCurrentTileAction() {
  if (atPeelStation()) {
    applyPeelWork(0.75);
    return;
  }
  if (atMarket()) {
    applySell();
    return;
  }

  const index = currentPlayerTile();
  const tool = nextToolForTile(index);
  if (tool) {
    state.selectedTool = tool;
    requestTileAction(index, tool, 0.75);
    return;
  }

  setMessage("현재 서 있는 칸에서 할 일이 없습니다. 밭 칸, 까기대, 판매대로 직접 가세요.");
}

function performContextAction() {
  if (state.selectedTool === "peel") {
    applyPeelWork(0.75);
    return;
  }
  if (atMarket()) {
    applySell();
    return;
  }
  if (pointer.tile >= 0) {
    requestSmartTileAction(pointer.tile);
    return;
  }

  const index = currentPlayerTile();
  if (index >= 0) requestSmartTileAction(index);
}

function updateQueuedAction() {
  if (!queuedAction) return;
  if (queuedAction.type === "tile" && atTileWorkSpot(queuedAction.index)) {
    applyTileAction(queuedAction.index, queuedAction.tool, queuedAction.workSeconds || 0.6);
    queuedAction = null;
  }
  if (queuedAction?.type === "peel" && atPeelStation()) {
    applyPeelWork(0.65);
    queuedAction = null;
  }
  if (queuedAction?.type === "sell" && atMarket()) {
    applySell();
    queuedAction = null;
  }
}

function automationLevel(id) {
  return state.automation[id]?.level || 0;
}

function automationPrice(id) {
  const def = automationDefs[id];
  const level = automationLevel(id);
  return Math.round(def.basePrice * Math.pow(1.72, level));
}

function automationInterval(id) {
  const def = automationDefs[id];
  const level = automationLevel(id);
  return Math.max(0.75, def.interval * Math.pow(0.86, Math.max(0, level - 1)));
}

function farmUpgradeLevel(id) {
  return id === "banana" ? state.bananaLevel : state.seedlingLevel;
}

function farmUpgradePrice(id) {
  const def = farmUpgradeDefs[id];
  const level = farmUpgradeLevel(id);
  return Math.round(def.basePrice * Math.pow(1.82, level - 1));
}

function buyFarmUpgrade(id) {
  const def = farmUpgradeDefs[id];
  if (!def) return;
  const level = farmUpgradeLevel(id);
  if (level >= def.maxLevel) {
    setMessage(`${def.name}은 이미 최대 레벨입니다.`);
    return;
  }
  const price = farmUpgradePrice(id);
  if (state.coins < price) {
    setMessage(`${def.name}을 올리려면 ${price}코인이 필요합니다.`);
    return;
  }
  state.coins -= price;
  if (id === "banana") state.bananaLevel += 1;
  if (id === "seedling") state.seedlingLevel += 1;
  addLog(`${def.name} Lv.${level + 1} 달성`);
  setMessage(id === "seedling" ? `묘목 Lv.${state.seedlingLevel}. 새로 심거나 재식재한 나무부터 적용됩니다.` : `판매가 Lv.${state.bananaLevel}. 깐 바나나 판매가가 올라갑니다.`);
  saveGame();
  updateHud();
}

function buyAutomation(id) {
  const def = automationDefs[id];
  const item = state.automation[id];
  if (!def || !item) return;
  if (item.level >= def.maxLevel) {
    setMessage(`${def.name}은 이미 최대 단계입니다.`);
    return;
  }
  const price = automationPrice(id);
  if (state.coins < price) {
    setMessage(`${def.name}을 사려면 ${price}코인이 필요합니다.`);
    return;
  }
  state.coins -= price;
  item.level += 1;
  item.timer = 0;
  addLog(`${def.name} ${item.level}단계 구매`);
  setMessage(`${def.name}을 설치했습니다. 이제 조금씩 알아서 굴러갑니다.`);
  saveGame();
  updateHud();
}

function runTimedAutomation(id, dt, action) {
  const item = state.automation[id];
  const level = item?.level || 0;
  if (level <= 0) return;
  item.timer -= dt;
  if (item.timer > 0) return;

  let didWork = false;
  for (let i = 0; i < level; i += 1) {
    if (action()) didWork = true;
  }
  item.timer += automationInterval(id);
  if (didWork) saveGame();
}

function updateAutomation(dt) {
  runTimedAutomation("tiller", dt, () => {
    const index = state.tiles.findIndex((tile) => !tile.tilled && !tile.plant);
    if (index < 0) return false;
    state.tiles[index].tilled = true;
    addWorkTime(0.25);
    addFloater("AUTO", tileCenter(index).x, tileCenter(index).y - 18, "#8a5a2d");
    return true;
  });

  runTimedAutomation("planter", dt, () => {
    const index = state.tiles.findIndex((tile) => tile.tilled && !tile.plant);
    if (index < 0) return false;
    plantTile(index);
    addWorkTime(0.25);
    addFloater("AUTO", tileCenter(index).x, tileCenter(index).y - 18, "#1f8b5f");
    return true;
  });

  runTimedAutomation("sprinkler", dt, () => {
    const index = state.tiles.findIndex((tile) => tile.plant && (!tile.plant.fruit || tile.plant.water < 2));
    if (index < 0) return false;
    waterTile(index, 0.12);
    addWorkTime(0.2);
    addFloater("AUTO", tileCenter(index).x, tileCenter(index).y - 18, "#2f78cf");
    return true;
  });

  runTimedAutomation("harvester", dt, () => {
    const index = state.tiles.findIndex((tile) => tile.plant?.growth >= 1 && tile.plant.fruit);
    if (index < 0 || state.bag.length >= bagLimit) return false;
    harvestTile(index);
    addWorkTime(0.25);
    addFloater("+바나나", tileCenter(index).x, tileCenter(index).y - 22, "#1f8b5f");
    return true;
  });

  const peelerLevel = automationLevel("peeler");
  if (peelerLevel > 0 && (state.currentPeel || state.bag.length)) {
    peelWork(dt * peelerLevel * 0.48, "auto");
  }

  runTimedAutomation("seller", dt, () => sellSome(1, "auto"));
}

function updatePlants(dt) {
  for (const tile of state.tiles) {
    if (!tile.plant) continue;
    const plant = tile.plant;
    if (plant.water > 0) {
      plant.water = Math.max(0, plant.water - dt);
      if (plant.growth < 1) {
        plant.growth = clamp(plant.growth + dt * 0.052, 0, 1);
      } else if (!plant.fruit) {
        plant.cooldown -= dt * 1.6;
      }
    } else if (plant.growth < 1) {
      plant.growth = clamp(plant.growth + dt * 0.004, 0, 1);
    }

    if (plant.growth >= 1 && !plant.fruit) {
      plant.cooldown -= dt;
      if (plant.cooldown <= 0) {
        plant.fruit = true;
        plant.cooldown = 8;
      }
    }
  }
}

function updateMovement(dt) {
  const dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  const dy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy) || 1;
    state.player.x = clamp(state.player.x + (dx / len) * state.player.speed * dt, 28, W - 28);
    state.player.y = clamp(state.player.y + (dy / len) * state.player.speed * dt, 86, H - 28);
    state.player.targetX = state.player.x;
    state.player.targetY = state.player.y;
    if (dx !== 0) state.player.facing = Math.sign(dx);
    queuedAction = null;
    return;
  }

  const tx = state.player.targetX - state.player.x;
  const ty = state.player.targetY - state.player.y;
  const remaining = Math.hypot(tx, ty);
  if (remaining < 2) return;
  const step = Math.min(remaining, state.player.speed * dt);
  state.player.x += (tx / remaining) * step;
  state.player.y += (ty / remaining) * step;
  if (Math.abs(tx) > 2) state.player.facing = Math.sign(tx);
}

function update(dt) {
  updateMovement(dt);
  updateQueuedAction();
  updatePlants(dt);
  updateAutomation(dt);

  if (keys.action && atPeelStation() && (state.currentPeel || state.bag.length)) {
    applyPeelWork(dt);
  }

  if (touchFarmHoldActive) {
    touchFarmHoldTimer -= dt;
    if (touchFarmHoldTimer <= 0) {
      performFarmButtonAction();
      touchFarmHoldTimer = 0.42;
    }
  }

  particles = particles.filter((p) => {
    p.life -= dt;
    p.vy += 300 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    return p.life > 0;
  });

  floaters = floaters.filter((f) => {
    f.life -= dt;
    f.y -= 36 * dt;
    return f.life > 0;
  });

  hitEffects = hitEffects.filter((effect) => {
    effect.life -= dt;
    effect.radius += 150 * dt;
    return effect.life > 0;
  });

  if (resultReveal) {
    resultReveal.life -= dt;
    if (resultReveal.life <= 0) resultReveal = null;
  }

  if (saveTimer > 0) {
    saveTimer -= dt;
    if (saveTimer <= 0) saveStateEl.textContent = "자동 저장";
  }

  updateHud();
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#f8da73");
  sky.addColorStop(0.36, "#f7edbd");
  sky.addColorStop(0.37, "#79b964");
  sky.addColorStop(1, "#4f9b59");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#9f6f38";
  ctx.fillRect(0, 92, W, 12);
  ctx.fillStyle = "#7f552c";
  for (let x = 12; x < W; x += 52) {
    roundedRect(x, 72, 14, 46, 5);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  roundedRect(44, 24, 280, 34, 8);
  ctx.fill();
  roundedRect(650, 34, 190, 28, 8);
  ctx.fill();

  ctx.fillStyle = "#caa36a";
  ctx.beginPath();
  ctx.moveTo(610, H);
  ctx.quadraticCurveTo(725, 430, market.x, market.y + 32);
  ctx.quadraticCurveTo(835, 390, 905, H);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#b58a58";
  ctx.beginPath();
  ctx.moveTo(520, H);
  ctx.quadraticCurveTo(630, 520, peelStation.x, peelStation.y + 35);
  ctx.quadraticCurveTo(880, 520, 940, H);
  ctx.closePath();
  ctx.fill();
}

function drawTile(index) {
  const tile = state.tiles[index];
  const col = index % farm.cols;
  const row = Math.floor(index / farm.cols);
  const x = farm.x + col * tileSize + 4;
  const y = farm.y + row * tileSize + 4;
  const size = tileSize - 8;
  const active = currentPlayerTile() === index;

  ctx.fillStyle = "rgba(32, 36, 49, 0.12)";
  roundedRect(x + 3, y + 5, size, size, 8);
  ctx.fill();

  const tileGradient = ctx.createLinearGradient(x, y, x + size, y + size);
  tileGradient.addColorStop(0, tile.tilled ? "#a66b36" : "#6aa85a");
  tileGradient.addColorStop(1, tile.tilled ? "#81512d" : "#4f8d4c");
  ctx.fillStyle = tileGradient;
  roundedRect(x, y, size, size, 8);
  ctx.fill();

  ctx.strokeStyle = "rgba(32, 36, 49, 0.18)";
  ctx.lineWidth = 2;
  roundedRect(x, y, size, size, 8);
  ctx.stroke();

  if (tile.tilled) {
    ctx.strokeStyle = "rgba(255, 220, 150, 0.28)";
    ctx.lineWidth = 3;
    for (let i = 12; i < size - 8; i += 13) {
      ctx.beginPath();
      ctx.moveTo(x + 9, y + i);
      ctx.quadraticCurveTo(x + size / 2, y + i - 7, x + size - 9, y + i);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(x + 10, y + 10, 12, 4);
    ctx.fillRect(x + 36, y + 44, 10, 4);
  }

  if (active) {
    ctx.strokeStyle = "#fff7b8";
    ctx.lineWidth = 4;
    roundedRect(x - 2, y - 2, size + 4, size + 4, 10);
    ctx.stroke();
  }

  if (tile.plant) drawPlant(tile.plant, x + size / 2, y + size / 2 + 12);
}

function seedlingLook(level) {
  const index = clamp(Math.round(level || 1), 1, seedlingLooks.length) - 1;
  return seedlingLooks[index];
}

function drawLeaf(len, width, colorA, colorB) {
  const leafGradient = ctx.createLinearGradient(0, -width, len, width);
  leafGradient.addColorStop(0, colorB);
  leafGradient.addColorStop(1, colorA);
  ctx.fillStyle = leafGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.22, -width * 0.95, len * 0.78, -width * 0.9, len, 0);
  ctx.bezierCurveTo(len * 0.72, width * 1.12, len * 0.26, width * 0.92, 0, 0);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.24)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.quadraticCurveTo(len * 0.48, -width * 0.2, len * 0.9, 0);
  ctx.stroke();
}

function drawPlant(plant, x, y) {
  const growth = clamp(plant.growth, 0.08, 1);
  const level = plant.seedlingLevel || 1;
  const look = seedlingLook(level);
  const outdated = level < state.seedlingLevel;
  const trunkHeight = (18 + growth * 35) * look.height;
  const trunkWidth = 5 + growth * 3 + Math.min(level, 10) * 0.26;
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "rgba(25, 45, 24, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 10, 18 + 8 * growth, 6 + 2 * growth, 0, 0, Math.PI * 2);
  ctx.fill();

  if (outdated) {
    ctx.strokeStyle = "rgba(116, 89, 184, 0.78)";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.ellipse(0, 8, 25, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  const trunkGradient = ctx.createLinearGradient(-trunkWidth, -trunkHeight, trunkWidth, 10);
  trunkGradient.addColorStop(0, look.trunk2);
  trunkGradient.addColorStop(1, look.trunk);
  ctx.strokeStyle = trunkGradient;
  ctx.lineWidth = trunkWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.quadraticCurveTo(5 + level * 0.45, -trunkHeight * 0.46, 0, -trunkHeight);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 226, 154, 0.28)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < Math.min(5, Math.ceil(level / 2)); i += 1) {
    const yy = 2 - i * trunkHeight * 0.18;
    ctx.beginPath();
    ctx.moveTo(-trunkWidth * 0.6, yy);
    ctx.quadraticCurveTo(0, yy - 4, trunkWidth * 0.65, yy - 2);
    ctx.stroke();
  }

  const topY = -trunkHeight;
  const leafColor = plant.water > 0 ? look.leaf2 : look.leaf;
  for (let i = 0; i < look.leafCount; i += 1) {
    const angle = (Math.PI * 2 * i) / look.leafCount + 0.14 + level * 0.035;
    const len = (20 + growth * 22 + level * 1.8) * look.spread;
    const width = 7 + growth * 5 + (i % 2) * 2;
    ctx.save();
    ctx.translate(Math.sin(i) * 1.8, topY + Math.cos(i * 1.7) * 2);
    ctx.rotate(angle);
    drawLeaf(len, width, leafColor, look.leaf2);
    ctx.restore();
  }

  ctx.fillStyle = look.accent;
  const gemCount = Math.min(5, Math.ceil(level / 2));
  for (let i = 0; i < gemCount; i += 1) {
    const gx = -14 + i * 7;
    ctx.beginPath();
    ctx.arc(gx, 14, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (level >= 7) {
    ctx.strokeStyle = look.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, topY + 2, 9 + (level - 7) * 2, -0.2, Math.PI * 1.25);
    ctx.stroke();
  }

  if (level >= 10) {
    ctx.fillStyle = "rgba(255, 240, 106, 0.55)";
    ctx.beginPath();
    ctx.arc(0, topY - 3, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  if (plant.fruit) {
    drawBananaBunch(10, topY + 18, 0.38 + level * 0.006, { ...variantMap.classic, color: look.fruit });
  } else if (growth >= 1) {
    ctx.fillStyle = look.accent;
    ctx.beginPath();
    ctx.arc(8, topY + 16, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFarm() {
  ctx.fillStyle = "rgba(49, 78, 41, 0.22)";
  roundedRect(farm.x - 12, farm.y - 12, farm.cols * tileSize + 24, farm.rows * tileSize + 24, 12);
  ctx.fill();
  for (let i = 0; i < state.tiles.length; i += 1) drawTile(i);
}

function drawMarket() {
  ctx.save();
  ctx.translate(market.x, market.y);
  ctx.fillStyle = "rgba(32, 36, 49, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 58, 74, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#70431f";
  roundedRect(-58, 6, 116, 68, 8);
  ctx.fill();
  ctx.fillStyle = "#f2c65f";
  roundedRect(-68, -28, 136, 34, 8);
  ctx.fill();
  ctx.fillStyle = "#c84545";
  for (let x = -62; x < 60; x += 24) {
    roundedRect(x, -28, 12, 34, 5);
    ctx.fill();
  }

  ctx.fillStyle = "#202431";
  ctx.font = "950 17px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("판매대", 0, -7);

  ctx.fillStyle = "#4c2c18";
  roundedRect(-38, 28, 76, 34, 6);
  ctx.fill();
  const preview = state.sellCrate.slice(0, 4);
  preview.forEach((id, i) => drawBananaShape(-25 + i * 16, 36 + (i % 2) * 6, 0.22, variantMap[id] || variantMap.classic, -0.35 + i * 0.22));

  ctx.fillStyle = "#ffd84a";
  ctx.beginPath();
  ctx.arc(48, 18, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#9c6418";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#9c6418";
  ctx.font = "950 18px Inter, system-ui, sans-serif";
  ctx.fillText("C", 48, 24);
  ctx.restore();
}

function drawPeelStation() {
  ctx.save();
  ctx.translate(peelStation.x, peelStation.y);
  ctx.fillStyle = "rgba(32, 36, 49, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 66, 82, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#7b4b2c";
  roundedRect(-64, 6, 128, 54, 10);
  ctx.fill();
  ctx.fillStyle = "#b8753c";
  roundedRect(-72, -18, 144, 28, 10);
  ctx.fill();

  ctx.strokeStyle = "#4b2d1b";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-46, 58);
  ctx.lineTo(-52, 86);
  ctx.moveTo(46, 58);
  ctx.lineTo(52, 86);
  ctx.stroke();

  const peelerLevel = automationLevel("peeler");
  if (peelerLevel > 0) {
    ctx.fillStyle = "#d7dde8";
    roundedRect(24, -52, 56, 42, 8);
    ctx.fill();
    ctx.strokeStyle = "#596273";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = "#45f58d";
    ctx.beginPath();
    ctx.arc(61, -31, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#202431";
    ctx.font = "900 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Lv.${peelerLevel}`, 52, -55);
  }

  ctx.fillStyle = "#202431";
  ctx.font = "950 17px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("까기대", 0, -25);

  if (state.currentPeel) {
    const variant = itemVariant(state.currentPeel);
    drawPeelingBanana(0, 0, state.currentPeel.progress, variant);
  } else {
    drawBananaBunch(0, 0, 0.56, variantMap.classic);
  }
  ctx.restore();
}

function drawBananaShape(x, y, scale, variant = variantMap.classic, angle = 0, peeled = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.fillStyle = "rgba(56, 38, 18, 0.18)";
  ctx.beginPath();
  ctx.ellipse(8, 20, 52, 11, -0.08, 0, Math.PI * 2);
  ctx.fill();

  const color = variant.color || "#ffe36e";
  const peelGradient = ctx.createLinearGradient(-42, -28, 54, 12);
  peelGradient.addColorStop(0, "#fff29a");
  peelGradient.addColorStop(0.2, color);
  peelGradient.addColorStop(0.78, "#ffc83f");
  peelGradient.addColorStop(1, "#b96d1e");
  ctx.fillStyle = peelGradient;
  ctx.strokeStyle = "rgba(83, 58, 18, 0.62)";
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-50, -1);
  ctx.bezierCurveTo(-34, -29, 12, -42, 51, -17);
  ctx.bezierCurveTo(39, 6, 0, 18, -39, 8);
  ctx.bezierCurveTo(-49, 6, -55, 3, -50, -1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(-30, -8);
  ctx.bezierCurveTo(-4, -22, 25, -23, 43, -13);
  ctx.stroke();

  ctx.strokeStyle = "rgba(122, 77, 25, 0.38)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-24 + i * 19, -15 + i * -1);
    ctx.bezierCurveTo(-12 + i * 19, -7, -6 + i * 19, 4, 4 + i * 19, 6);
    ctx.stroke();
  }

  ctx.fillStyle = "#68451f";
  ctx.beginPath();
  ctx.ellipse(-51, -1, 6, 8, -0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(52, -17, 5, 8, 0.7, 0, Math.PI * 2);
  ctx.fill();

  if (peeled > 0) {
    ctx.globalAlpha = clamp(peeled, 0, 1);
    ctx.fillStyle = variant.ink === "#fff2df" ? "#fff6c9" : "#fff1ad";
    ctx.beginPath();
    ctx.ellipse(9, -7, 27, 11, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.globalAlpha = clamp(peeled * 0.65, 0, 0.65);
    ctx.beginPath();
    ctx.ellipse(10, -7, 19, 7, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawBananaBunch(x, y, scale, variant) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(64, 39, 15, 0.2)";
  ctx.beginPath();
  ctx.ellipse(6, 19, 44 * scale, 9 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  drawBananaShape(-17, 1, scale, variant, -0.42);
  drawBananaShape(2, -4, scale, variant, -0.08);
  drawBananaShape(22, 2, scale, variant, 0.28);
  ctx.fillStyle = "#62411f";
  ctx.beginPath();
  ctx.ellipse(0, -10 * scale, 9 * scale, 6 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function bananaBodyPath() {
  ctx.beginPath();
  ctx.moveTo(-47, 1);
  ctx.bezierCurveTo(-30, -31, 16, -43, 52, -16);
  ctx.bezierCurveTo(39, 11, -2, 23, -40, 11);
  ctx.bezierCurveTo(-49, 8, -53, 5, -47, 1);
  ctx.closePath();
}

function drawClosedPeelSkin() {
  const peelGradient = ctx.createLinearGradient(-44, -30, 54, 12);
  peelGradient.addColorStop(0, "#fff29a");
  peelGradient.addColorStop(0.24, "#ffe36e");
  peelGradient.addColorStop(0.76, "#ffc83f");
  peelGradient.addColorStop(1, "#b96d1e");
  ctx.fillStyle = peelGradient;
  ctx.strokeStyle = "rgba(83, 58, 18, 0.58)";
  ctx.lineWidth = 3.5;
  bananaBodyPath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-29, -8);
  ctx.bezierCurveTo(-4, -22, 24, -23, 42, -13);
  ctx.stroke();
}

function drawPeelCap() {
  ctx.fillStyle = "#68451f";
  ctx.beginPath();
  ctx.ellipse(-50, 0, 6, 8, -0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(52, -17, 5, 8, 0.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawPeelFlap(startX, width, fold, spread, variant) {
  const mid = startX + width / 2;
  const curlX = spread * (28 + 30 * fold);
  const endY = 6 + fold * (42 + Math.abs(spread) * 24);
  const twist = Math.sin(fold * Math.PI) * 8 * Math.sign(spread || 0.2);
  const peelGradient = ctx.createLinearGradient(mid, -18, mid + curlX, endY);
  peelGradient.addColorStop(0, "#fff08a");
  peelGradient.addColorStop(0.52, "#ffd84a");
  peelGradient.addColorStop(1, variant.rarity === "legendary" ? "#f06f39" : "#c9821c");

  ctx.fillStyle = peelGradient;
  ctx.strokeStyle = "rgba(108, 70, 22, 0.62)";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(startX + 2, -13);
  ctx.bezierCurveTo(mid + curlX * 0.08, -2 + fold * 7, mid + curlX * 0.62, endY - 18, mid + curlX + twist, endY);
  ctx.bezierCurveTo(mid + curlX - width * 0.42 + twist, endY + 6, mid + curlX * 0.28, 8 + fold * 7, startX + width - 2, -13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(mid, -9);
  ctx.quadraticCurveTo(mid + curlX * 0.45, endY * 0.45, mid + curlX + twist * 0.5, endY - 3);
  ctx.stroke();
}

function uprightBananaPath() {
  ctx.beginPath();
  ctx.moveTo(-15, -58);
  ctx.bezierCurveTo(-31, -34, -30, 14, -14, 48);
  ctx.bezierCurveTo(-5, 57, 11, 54, 18, 43);
  ctx.bezierCurveTo(30, 11, 27, -33, 12, -58);
  ctx.bezierCurveTo(4, -63, -6, -63, -15, -58);
  ctx.closePath();
}

function drawPeelingFingers(progress) {
  const pinch = Math.sin(progress * Math.PI) * 3;
  ctx.save();
  ctx.fillStyle = "#f3c08b";
  ctx.strokeStyle = "rgba(95, 55, 28, 0.35)";
  ctx.lineWidth = 2;
  ctx.save();
  ctx.translate(-24 - pinch, -61);
  ctx.rotate(-0.55);
  roundedRect(-8, -10, 17, 34, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(24 + pinch, -62);
  ctx.rotate(0.55);
  roundedRect(-9, -10, 17, 34, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.arc(-27 - pinch, -67, 4, 0, Math.PI * 2);
  ctx.arc(27 + pinch, -68, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawUprightPeelPanel(i, segments, fold) {
  const panelWidth = 42 / segments;
  const x = -21 + i * panelWidth;
  const coverAlpha = clamp(1 - fold * 0.95, 0, 1);
  if (coverAlpha <= 0.03) return;

  ctx.save();
  ctx.globalAlpha = coverAlpha;
  uprightBananaPath();
  ctx.clip();

  const peelGradient = ctx.createLinearGradient(x, -58, x + panelWidth, 50);
  peelGradient.addColorStop(0, "#fff29a");
  peelGradient.addColorStop(0.46, "#ffd84a");
  peelGradient.addColorStop(1, "#d18a24");
  ctx.fillStyle = peelGradient;
  ctx.beginPath();
  ctx.moveTo(x - 2, -60);
  ctx.bezierCurveTo(x - 5, -24, x - 4, 18, x + 1, 54);
  ctx.lineTo(x + panelWidth + 3, 54);
  ctx.bezierCurveTo(x + panelWidth - 2, 18, x + panelWidth - 2, -24, x + panelWidth + 2, -60);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(116, 73, 22, 0.36)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + panelWidth, -55);
  ctx.bezierCurveTo(x + panelWidth - 4, -18, x + panelWidth - 2, 19, x + panelWidth + 1, 47);
  ctx.stroke();

  ctx.restore();
}

function drawUprightPeelFlap(i, segments, fold, variant) {
  if (fold <= 0.02) return;
  const spread = segments === 1 ? 0 : i / (segments - 1) - 0.5;
  const anchorX = -16 + (i * 32) / Math.max(1, segments - 1);
  const curl = spread * (32 + fold * 56);
  const endY = -45 + fold * (92 + Math.abs(spread) * 25);
  const belly = 10 + fold * 12;
  const width = 10 + 22 / segments;

  const outside = ctx.createLinearGradient(anchorX, -54, anchorX + curl, endY);
  outside.addColorStop(0, "#fff29a");
  outside.addColorStop(0.48, "#ffd84a");
  outside.addColorStop(1, variant.rarity === "legendary" ? "#f06f39" : "#b87524");

  ctx.fillStyle = outside;
  ctx.strokeStyle = "rgba(100, 63, 20, 0.62)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(anchorX - width * 0.48, -55);
  ctx.bezierCurveTo(anchorX + curl * 0.18 - belly * spread, -27 + fold * 8, anchorX + curl * 0.78, endY - 28, anchorX + curl, endY);
  ctx.bezierCurveTo(anchorX + curl - width - belly * spread, endY + 5, anchorX + curl * 0.24, -15 + fold * 9, anchorX + width * 0.5, -55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 242, 170, 0.62)";
  ctx.beginPath();
  ctx.moveTo(anchorX - width * 0.2, -52);
  ctx.bezierCurveTo(anchorX + curl * 0.28, -23 + fold * 8, anchorX + curl * 0.72, endY - 20, anchorX + curl - width * 0.32, endY - 4);
  ctx.bezierCurveTo(anchorX + curl - width * 0.86, endY - 2, anchorX + curl * 0.2, -18 + fold * 7, anchorX + width * 0.22, -52);
  ctx.closePath();
  ctx.fill();
}

function drawPeelingBanana(x, y, progress, variant) {
  const segments = peelSegmentCount(variant);
  const glow = rarityGlow(variant);
  const pulse = Math.sin(performance.now() / 140) * 0.5 + 0.5;

  ctx.save();
  ctx.translate(x, y + 6);
  ctx.rotate(Math.sin(performance.now() / 220) * 0.025);
  ctx.scale(0.92, 0.92);

  ctx.fillStyle = "rgba(34, 22, 12, 0.2)";
  ctx.beginPath();
  ctx.ellipse(2, 60, 56, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  if (glow > 0) {
    ctx.globalAlpha = glow * (0.45 + pulse * 0.35);
    ctx.fillStyle = variant.color;
    ctx.beginPath();
    ctx.arc(8, -2, 58 + progress * 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  drawPeelingFingers(progress);

  ctx.fillStyle = "#fff3b8";
  ctx.strokeStyle = "rgba(113, 75, 21, 0.45)";
  ctx.lineWidth = 4;
  uprightBananaPath();
  ctx.fill();
  ctx.stroke();

  const reveal = clamp((progress - 0.08) / 0.8, 0, 1);
  ctx.globalAlpha = 0.08 + reveal * 0.88;
  ctx.fillStyle = variant.color;
  ctx.beginPath();
  ctx.ellipse(2, 0, 13, 42, -0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = variant.ink;
  ctx.font = "950 16px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (progress > 0.86) ctx.fillText(variant.label.slice(0, 2), 2, -2);
  ctx.globalAlpha = 1;

  for (let i = 0; i < segments; i += 1) {
    const segmentProgress = clamp(progress * (segments + 0.9) - i * 0.92, 0, 1);
    drawUprightPeelPanel(i, segments, segmentProgress);
    drawUprightPeelFlap(i, segments, segmentProgress, variant);
  }

  ctx.fillStyle = "#68451f";
  ctx.beginPath();
  ctx.ellipse(0, -60, 11, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3, 51, 8, 5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(32,36,49,0.82)";
  roundedRect(-54, 58, 108, 12, 6);
  ctx.fill();
  const fill = ctx.createLinearGradient(-52, 59, 52, 59);
  fill.addColorStop(0, "#1f8b5f");
  fill.addColorStop(0.55, "#ffd84a");
  fill.addColorStop(1, variant.color);
  if (progress > 0.01) {
    ctx.fillStyle = fill;
    roundedRect(-52, 60, 104 * progress, 8, 5);
    ctx.fill();
  }
  ctx.restore();
}

function drawShowcasePeelOverlay() {
  if (!state.currentPeel) return;
  const variant = itemVariant(state.currentPeel);
  if (!shouldShowcasePeel(variant)) return;

  const progress = state.currentPeel.progress;
  const now = performance.now();
  const legendary = variant.rarity === "legendary";
  const epic = variant.rarity === "epic";
  const intensity = legendary ? 1.35 : epic ? 1 : 0.72;
  const shake = (4.5 + progress * 3.5) * intensity;
  const sx = (Math.sin(now / 24) + Math.sin(now / 47) * 0.55) * shake;
  const sy = (Math.cos(now / 31) + Math.sin(now / 53) * 0.45) * shake * 0.55;
  const pulse = Math.sin(now / 110) * 0.5 + 0.5;

  ctx.save();
  ctx.filter = "blur(4px) saturate(0.92)";
  ctx.globalAlpha = 0.72;
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, W, H);
  ctx.restore();

  ctx.save();
  const shade = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 500);
  shade.addColorStop(0, "rgba(16, 19, 26, 0.08)");
  shade.addColorStop(0.55, "rgba(16, 19, 26, 0.45)");
  shade.addColorStop(1, "rgba(16, 19, 26, 0.72)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2 + sx;
  const cy = H / 2 - 8 + sy;
  const ringCount = legendary ? 5 : epic ? 4 : 3;
  for (let i = 0; i < ringCount; i += 1) {
    const radius = 82 + i * 28 + pulse * 18 + progress * 34;
    ctx.globalAlpha = (0.34 - i * 0.045) * intensity;
    ctx.strokeStyle = i % 2 ? "#fff06a" : variant.color;
    ctx.lineWidth = legendary ? 5 : 4;
    ctx.beginPath();
    ctx.arc(cx, cy - 12, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.9;
  const beam = ctx.createLinearGradient(cx - 150, cy - 220, cx + 150, cy + 180);
  beam.addColorStop(0, "rgba(255,255,255,0)");
  beam.addColorStop(0.5, legendary ? "rgba(255,240,106,0.26)" : "rgba(157,116,223,0.24)");
  beam.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(cx - 170, cy - 220);
  ctx.lineTo(cx + 20, cy - 250);
  ctx.lineTo(cx + 170, cy + 210);
  ctx.lineTo(cx - 50, cy + 240);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(now / 38) * 0.035 * intensity);
  ctx.scale(1.95 + pulse * 0.08 + (legendary ? 0.12 : 0), 1.95 + pulse * 0.08 + (legendary ? 0.12 : 0));
  drawPeelingBanana(0, 0, progress, variant);
  ctx.restore();

  ctx.globalAlpha = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,250,240,0.96)";
  ctx.font = "950 23px Inter, system-ui, sans-serif";
  const alertText = legendary ? "전설 반응 감지" : epic ? "초희귀 반응 감지" : "희귀 반응 감지";
  ctx.fillText(alertText, W / 2, 88);
  ctx.font = "900 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,250,240,0.76)";
  ctx.fillText(`껍질 ${peelSegmentCount(variant)}갈래 전개 중 · ${Math.floor(progress * 100)}%`, W / 2, 114);

  ctx.font = "950 18px Inter, system-ui, sans-serif";
  ctx.fillStyle = legendary ? "#fff06a" : epic ? "#d7c5ff" : "#bfe2ff";
  const rumbleCount = legendary ? 5 : epic ? 5 : 3;
  for (let i = 0; i < rumbleCount; i += 1) {
    const offset = i * 54 - 108;
    const jitterY = Math.sin(now / 37 + i) * 5;
    ctx.globalAlpha = 0.22 + pulse * 0.2;
    ctx.fillText("DRRR", W / 2 + offset, cy + 160 + jitterY);
  }
  ctx.globalAlpha = 1;

  const sparkleCount = legendary ? 34 : epic ? 22 : 14;
  for (let i = 0; i < sparkleCount; i += 1) {
    const angle = (i / sparkleCount) * Math.PI * 2 + now / (legendary ? 520 : 680);
    const radius = 135 + ((i * 37) % 70) + pulse * 18;
    const px = cx + Math.cos(angle) * radius;
    const py = cy - 8 + Math.sin(angle) * radius * 0.65;
    ctx.globalAlpha = 0.25 + ((i % 4) * 0.12);
    ctx.fillStyle = i % 3 === 0 ? "#fff" : variant.color;
    ctx.beginPath();
    ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.filter = "none";
}

function drawResultRevealOverlay() {
  if (!resultReveal) return;
  const variant = variantMap[resultReveal.variantId] || variantMap.classic;
  const meta = rarityMeta[variant.rarity];
  const t = 1 - resultReveal.life / resultReveal.maxLife;
  const appear = clamp(t / 0.24, 0, 1);
  const leave = clamp(resultReveal.life / 0.35, 0, 1);
  const alpha = Math.min(appear, leave);
  const pop = 0.82 + appear * 0.2 + Math.sin(performance.now() / 95) * 0.015;

  ctx.save();
  ctx.filter = "blur(3px) saturate(0.86)";
  ctx.globalAlpha = 0.58 * alpha;
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, W, H);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(16,19,26,0.58)";
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;
  const glow = ctx.createRadialGradient(cx, cy - 10, 30, cx, cy - 10, 210);
  glow.addColorStop(0, variant.color);
  glow.addColorStop(0.4, `${variant.color}66`);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy - 12, 210, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(cx, cy - 48);
  ctx.scale(2.45 * pop, 2.45 * pop);
  drawBananaShape(0, 0, 1, variant, -0.08, 1);
  ctx.restore();

  ctx.fillStyle = "rgba(255,250,240,0.97)";
  roundedRect(cx - 220, cy + 62, 440, 116, 8);
  ctx.fill();
  ctx.strokeStyle = variant.color;
  ctx.lineWidth = 4;
  roundedRect(cx - 220, cy + 62, 440, 116, 8);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = meta.color;
  ctx.font = "950 17px Inter, system-ui, sans-serif";
  ctx.fillText("신규 발견", cx, cy + 88);
  ctx.fillStyle = "#202431";
  ctx.font = "950 34px Inter, system-ui, sans-serif";
  ctx.fillText(variant.name, cx, cy + 122);
  ctx.fillStyle = "#4d586a";
  ctx.font = "900 14px Inter, system-ui, sans-serif";
  ctx.fillText(`${meta.name} 등급 · 판매가 ${Math.round(variant.value * bananaValueMultiplier())}코인`, cx, cy + 154);

  const sparkleCount = variant.rarity === "legendary" ? 38 : variant.rarity === "epic" ? 26 : 18;
  for (let i = 0; i < sparkleCount; i += 1) {
    const angle = (i / sparkleCount) * Math.PI * 2 + performance.now() / 700;
    const radius = 145 + (i % 5) * 14;
    ctx.globalAlpha = alpha * (0.3 + (i % 4) * 0.12);
    ctx.fillStyle = i % 2 ? "#fff" : variant.color;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * radius, cy - 30 + Math.sin(angle) * radius * 0.72, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.filter = "none";
}

function drawAutomation() {
  const x = farm.x + farm.cols * tileSize + 28;
  const y = farm.y + 32;
  const autoItems = [
    ["tiller", "#8a5a2d"],
    ["planter", "#1f8b5f"],
    ["sprinkler", "#2f78cf"],
    ["harvester", "#c9821c"],
  ];

  autoItems.forEach(([id, color], i) => {
    const level = automationLevel(id);
    if (level <= 0) return;
    const px = x + (i % 2) * 70;
    const py = y + Math.floor(i / 2) * 72;
    ctx.fillStyle = "rgba(32, 36, 49, 0.14)";
    ctx.beginPath();
    ctx.ellipse(px, py + 23, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    roundedRect(px - 22, py - 14, 44, 36, 8);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(px - 10, py + 1, 5, 0, Math.PI * 2);
    ctx.arc(px + 10, py + 1, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#202431";
    ctx.font = "950 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(automationDefs[id].short, px, py + 37);
    ctx.fillText(`Lv.${level}`, px, py - 22);
  });

  const sellerLevel = automationLevel("seller");
  if (sellerLevel > 0) {
    ctx.fillStyle = "#ffd84a";
    roundedRect(market.x + 72, market.y - 16, 46, 42, 8);
    ctx.fill();
    ctx.fillStyle = "#202431";
    ctx.font = "950 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`판매 Lv.${sellerLevel}`, market.x + 95, market.y + 42);
  }
}

function equipmentForPlayer() {
  if (state.selectedTool !== "move") return state.selectedTool;
  return nextToolForTile(currentPlayerTile()) || "move";
}

function drawPlayer() {
  const p = state.player;
  const walking = Math.hypot(p.targetX - p.x, p.targetY - p.y) > 3 || keys.up || keys.down || keys.left || keys.right;
  const bob = Math.sin(performance.now() / 120) * (walking ? 1.5 : 0.4);
  const tool = equipmentForPlayer();

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.facing || 1, 1);

  ctx.fillStyle = "rgba(32,36,49,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 22, 25, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, bob);
  ctx.strokeStyle = "#202431";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-7, -4);
  ctx.lineTo(-11, 18);
  ctx.moveTo(8, -4);
  ctx.lineTo(12, 18);
  ctx.stroke();

  ctx.fillStyle = "#3a2e26";
  roundedRect(-19, 15, 17, 7, 3);
  ctx.fill();
  roundedRect(4, 15, 18, 7, 3);
  ctx.fill();

  ctx.fillStyle = "#2f78cf";
  roundedRect(-15, -40, 30, 40, 9);
  ctx.fill();
  ctx.fillStyle = "#21589c";
  roundedRect(-19, -31, 10, 28, 5);
  ctx.fill();

  ctx.fillStyle = "#f3c08b";
  ctx.beginPath();
  ctx.arc(0, -53, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#202431";
  roundedRect(-17, -66, 34, 13, 6);
  ctx.fill();
  ctx.fillStyle = "#ffd84a";
  roundedRect(-13, -73, 26, 12, 5);
  ctx.fill();

  ctx.fillStyle = "#202431";
  ctx.beginPath();
  ctx.arc(5, -54, 2, 0, Math.PI * 2);
  ctx.fill();

  drawEquipment(tool);
  ctx.restore();
}

function drawEquipment(tool) {
  ctx.save();
  ctx.translate(17, -27);
  ctx.strokeStyle = "#5b3b21";
  ctx.lineCap = "round";

  if (tool === "hoe") {
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(30, 35);
    ctx.stroke();
    ctx.strokeStyle = "#c7ccd6";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(19, 9);
    ctx.lineTo(39, 1);
    ctx.stroke();
  } else if (tool === "plant") {
    ctx.fillStyle = "#8a573f";
    roundedRect(-2, 0, 22, 24, 6);
    ctx.fill();
    ctx.fillStyle = "#1f8b5f";
    ctx.beginPath();
    ctx.arc(8, 2, 7, 0, Math.PI * 2);
    ctx.fill();
  } else if (tool === "water") {
    ctx.fillStyle = "#2f78cf";
    roundedRect(-2, -2, 30, 22, 7);
    ctx.fill();
    ctx.strokeStyle = "#2f78cf";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(27, 9, 9, -1.2, 1.2);
    ctx.stroke();
    ctx.strokeStyle = "#8ed8ff";
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(37, 8);
      ctx.lineTo(50 + i * 4, 12 + i * 5);
      ctx.stroke();
    }
  } else if (tool === "harvest") {
    ctx.strokeStyle = "#c7ccd6";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(20, 5, 18, -1.6, 0.9);
    ctx.stroke();
    ctx.strokeStyle = "#5b3b21";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(18, 28);
    ctx.stroke();
  } else if (tool === "peel") {
    ctx.fillStyle = "#7459b8";
    roundedRect(0, 2, 30, 18, 6);
    ctx.fill();
    ctx.strokeStyle = "#f3d86a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(25, 3);
    ctx.lineTo(43, -7);
    ctx.stroke();
  }

  ctx.restore();
}

function drawTarget() {
  if (Math.hypot(state.player.targetX - state.player.x, state.player.targetY - state.player.y) < 8) return;
  ctx.save();
  ctx.strokeStyle = "rgba(32,36,49,0.45)";
  ctx.setLineDash([7, 7]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(state.player.targetX, state.player.targetY, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function toolLabel(tool) {
  return {
    move: "이동",
    hoe: "괭이질",
    plant: "심기",
    water: "물 주기",
    harvest: "수확",
    peel: "까기",
    replant: "재식재",
  }[tool] || "이동";
}

function actionText() {
  if (atPeelStation()) return "Space: 바나나 까기";
  if (atMarket()) return "Space: 판매함 팔기";
  const index = currentPlayerTile();
  const tool = nextToolForTile(index);
  if (tool) return `Space: 현재 칸 ${toolLabel(tool)}`;
  return "WASD 이동, Space 현재 위치 작업, 업그레이드는 위 버튼";
}

function touchActionText() {
  const index = currentPlayerTile();
  const tool = nextToolForTile(index);
  if (tool) return toolLabel(tool);
  const task = nextFarmTask();
  if (task?.tool) return toolLabel(task.tool);
  return "농장";
}

function drawHud() {
  ctx.save();
  ctx.fillStyle = "rgba(32,36,49,0.82)";
  roundedRect(24, 20, 520, 92, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "950 18px Inter, system-ui, sans-serif";
  ctx.fillText(`🍌 판매가 Lv.${state.bananaLevel}   🌱 묘목 Lv.${state.seedlingLevel}   🎒 ${state.bag.length}/${bagLimit}   📦 ${state.sellCrate.length}개`, 46, 51);
  ctx.font = "850 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.fillText(`자동화 총 Lv.${totalAutomationLevel()}   슈퍼바나나 게이지 ${Math.round(superProgress() * 100)}%`, 46, 78);

  ctx.fillStyle = "rgba(32,36,49,0.82)";
  roundedRect(268, 574, 424, 44, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "900 16px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(actionText(), 480, 596);
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = clamp(p.life, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.font = "950 18px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  for (const f of floaters) {
    ctx.globalAlpha = clamp(f.life, 0, 1);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText(f.text, f.x + 2, f.y + 2);
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawHitEffects() {
  ctx.save();
  for (const effect of hitEffects) {
    const t = 1 - effect.life / effect.maxLife;
    ctx.globalAlpha = clamp(1 - t, 0, 1);
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 5 - t * 3;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = effect.color;
    ctx.globalAlpha = clamp(0.2 - t * 0.16, 0, 0.2);
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function syncCanvasResolution() {
  const now = performance.now();
  if (now - canvasResolutionCheckAt < 400) {
    ctx.setTransform(canvasPixelRatio, 0, 0, canvasPixelRatio, 0, 0);
    return;
  }
  canvasResolutionCheckAt = now;
  const rect = canvas.getBoundingClientRect();
  const displayScale = Math.max(rect.width / W, rect.height / H);
  const ratio = Math.min(1.6, Math.max(1, displayScale * (window.devicePixelRatio || 1)));
  const targetWidth = Math.round(W * ratio);
  const targetHeight = Math.round(H * ratio);
  if (canvasPixelRatio !== ratio || canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvasPixelRatio = ratio;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
  ctx.setTransform(canvasPixelRatio, 0, 0, canvasPixelRatio, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}

function render() {
  syncCanvasResolution();
  ctx.clearRect(0, 0, W, H);
  drawBackground();
  drawFarm();
  drawMarket();
  drawPeelStation();
  drawAutomation();
  drawTarget();
  drawPlayer();
  drawParticles();
  drawHitEffects();
  drawHud();
  drawShowcasePeelOverlay();
  drawResultRevealOverlay();
}

function frame(now) {
  const dt = lastTime ? Math.min(0.04, (now - lastTime) / 1000) : 0.016;
  lastTime = now;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

function updateHud() {
  const found = collectionFoundCount();
  const progress = superProgress();
  const remainMs = Math.max(0, SUPER_TARGET_MS - state.superChargeMs);
  const totalAutomation = totalAutomationLevel();
  const rankState = currentRank();

  coinsEl.textContent = state.coins.toLocaleString("ko-KR");
  totalPeelsEl.textContent = state.totalPeels.toLocaleString("ko-KR");
  sellCrateEl.textContent = `${state.sellCrate.length}개`;
  collectionCountEl.textContent = `${found}/${variants.length}`;
  bagEl.textContent = `${state.bag.length + (state.currentPeel ? 1 : 0)}/${bagLimit}`;
  automationCountEl.textContent = `${totalAutomation}단계`;
  superGaugeEl.style.width = `${progress * 100}%`;
  superEtaEl.textContent = progress >= 1 ? "다음 수확 보장" : `슈퍼까지 약 ${Math.ceil(remainMs / 60000)}분`;
  rankBadgeEl.textContent = `Lv.${rankState.index + 1}`;
  rankNameEl.textContent = rankState.rank.name;
  rankDescEl.textContent = rankState.rank.desc;
  incomeRateEl.textContent = `판매가 x${bananaValueMultiplier().toFixed(2)} · 자동 Lv.${totalAutomation}`;
  nextGoalEl.textContent = rankState.next ? `다음: ${rankState.next.name} (${Math.ceil((rankState.next.threshold - rankState.score) / 10) * 10}점)` : "최종 단계 도달";
  rankGaugeEl.style.width = `${rankState.progress * 100}%`;
  touchActionButton.textContent = touchActionText();
  touchActionButton.setAttribute("aria-label", `${touchActionText()} 버튼`);
  soldCountEl.textContent = `${state.totalSold.toLocaleString("ko-KR")}개 판매`;
  sellButton.disabled = state.sellCrate.length === 0;

  for (const button of upgradeButtons) {
    const id = button.dataset.upgrade;
    const def = farmUpgradeDefs[id];
    const level = farmUpgradeLevel(id);
    const maxed = level >= def.maxLevel;
    const price = maxed ? 0 : farmUpgradePrice(id);
    const extra = id === "seedling" ? `재식재 비용 ${replantCost()}C` : `판매가 x${bananaValueMultiplier().toFixed(2)}`;
    button.disabled = maxed || state.coins < price;
    button.innerHTML = `
      <strong>${def.icon || ""} ${def.name} Lv.${level}</strong>
      <span>${def.desc}</span>
      <span>${extra}</span>
      <small>${maxed ? "최대 레벨" : `${price}코인`}</small>
    `;
  }

  for (const button of shopButtons) {
    const id = button.dataset.shop;
    const def = automationDefs[id];
    const level = automationLevel(id);
    const maxed = level >= def.maxLevel;
    const price = maxed ? 0 : automationPrice(id);
    button.disabled = maxed || state.coins < price;
    button.innerHTML = `
      <strong>${def.name} Lv.${level}</strong>
      <span>${def.desc}</span>
      <small>${maxed ? "최대 단계" : `${price}코인`}</small>
    `;
  }
}

function renderCollection() {
  collectionEl.innerHTML = "";
  for (const variant of variants) {
    const count = state.collection[variant.id] || 0;
    const item = document.createElement("div");
    item.className = `collection-item ${count ? "" : "locked"}`;
    item.title = count ? variant.description : "아직 발견하지 못했습니다.";

    const icon = document.createElement("div");
    icon.className = "collection-icon";
    icon.style.background = count ? variant.color : "#dfd7c6";
    icon.style.color = count ? variant.ink : "#8b8171";
    icon.textContent = count ? variant.label.slice(0, 2) : "?";

    const name = document.createElement("div");
    name.className = "collection-name";
    name.textContent = count ? variant.name : "미발견";

    const countEl = document.createElement("div");
    countEl.className = "collection-count";
    countEl.textContent = count ? `${rarityMeta[variant.rarity].name} x${count}` : rarityMeta[variant.rarity].name;

    item.append(icon, name, countEl);
    collectionEl.append(item);
  }
}

function renderLog() {
  logEl.innerHTML = "";
  const lines = state.log.length ? state.log : ["바나나 밭 개장."];
  for (const line of lines) {
    const li = document.createElement("li");
    li.textContent = line;
    logEl.append(li);
  }
}

function saveGame() {
  const payload = {
    selectedTool: state.selectedTool,
    coins: state.coins,
    bananaLevel: state.bananaLevel,
    seedlingLevel: state.seedlingLevel,
    totalPeels: state.totalPeels,
    totalSold: state.totalSold,
    revenue: state.revenue,
    superChargeMs: state.superChargeMs,
    tiles: state.tiles,
    bag: state.bag.map((item) => ({ variantId: item.variantId, progress: item.progress, required: item.required, value: item.value })),
    currentPeel: state.currentPeel ? { variantId: state.currentPeel.variantId, progress: state.currentPeel.progress, required: state.currentPeel.required, value: state.currentPeel.value } : null,
    sellCrate: state.sellCrate,
    collection: state.collection,
    log: state.log,
    automation: state.automation,
    player: state.player,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  saveStateEl.textContent = "저장됨";
  saveTimer = 1.2;
  updateHud();
}

function hydrateItem(raw) {
  const variant = variantMap[raw?.variantId] || variants[0];
  const item = createItem(variant);
  item.progress = clamp(Number(raw?.progress) || 0, 0, 1);
  return item;
}

function loadGame() {
  state.tiles = makeTiles();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.selectedTool = "move";
    state.coins = Math.max(0, Number(parsed.coins) || 0);
    state.bananaLevel = clamp(Number(parsed.bananaLevel) || 1, 1, farmUpgradeDefs.banana.maxLevel);
    state.seedlingLevel = clamp(Number(parsed.seedlingLevel) || 1, 1, farmUpgradeDefs.seedling.maxLevel);
    state.totalPeels = Math.max(0, Number(parsed.totalPeels) || 0);
    state.totalSold = Math.max(0, Number(parsed.totalSold) || 0);
    state.revenue = Math.max(0, Number(parsed.revenue) || 0);
    state.superChargeMs = clamp(Number(parsed.superChargeMs) || 0, 0, SUPER_TARGET_MS);

    if (Array.isArray(parsed.tiles) && parsed.tiles.length === state.tiles.length) {
      state.tiles = parsed.tiles.map((tile) => ({
        tilled: Boolean(tile.tilled),
        plant: tile.plant
          ? {
              growth: clamp(Number(tile.plant.growth) || 0, 0, 1),
              water: Math.max(0, Number(tile.plant.water) || 0),
              fruit: Boolean(tile.plant.fruit),
              cooldown: Number(tile.plant.cooldown) || 0,
              seedlingLevel: clamp(Number(tile.plant.seedlingLevel) || 1, 1, farmUpgradeDefs.seedling.maxLevel),
            }
          : null,
      }));
    }

    state.bag = Array.isArray(parsed.bag) ? parsed.bag.map(hydrateItem).slice(0, bagLimit) : [];
    state.currentPeel = parsed.currentPeel ? hydrateItem(parsed.currentPeel) : null;
    state.sellCrate = Array.isArray(parsed.sellCrate) ? parsed.sellCrate.filter((id) => variantMap[id]).slice(0, 999) : [];
    state.collection = parsed.collection && typeof parsed.collection === "object" ? parsed.collection : {};
    state.log = Array.isArray(parsed.log) ? parsed.log.slice(0, 8) : [];

    state.automation = makeAutomationState();
    if (parsed.automation && typeof parsed.automation === "object") {
      for (const id of Object.keys(automationDefs)) {
        const loaded = parsed.automation[id] || {};
        state.automation[id] = {
          level: clamp(Number(loaded.level) || 0, 0, automationDefs[id].maxLevel),
          timer: Math.max(0, Number(loaded.timer) || 0),
        };
      }
    }

    if (parsed.player) {
      state.player.x = clamp(Number(parsed.player.x) || state.player.x, 28, W - 28);
      state.player.y = clamp(Number(parsed.player.y) || state.player.y, 86, H - 28);
      state.player.targetX = state.player.x;
      state.player.targetY = state.player.y;
      state.player.facing = Number(parsed.player.facing) || 1;
    }
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state.selectedTool = "move";
  state.coins = 12;
  state.bananaLevel = 1;
  state.seedlingLevel = 1;
  state.totalPeels = 0;
  state.totalSold = 0;
  state.revenue = 0;
  state.superChargeMs = 0;
  state.tiles = makeTiles();
  state.bag = [];
  state.currentPeel = null;
  state.sellCrate = [];
  state.collection = {};
  state.log = [];
  state.automation = makeAutomationState();
  resultReveal = null;
  hitEffects = [];
  state.player.x = farm.x + tileSize * 0.5;
  state.player.y = farm.y + tileSize * 4.5;
  state.player.targetX = state.player.x;
  state.player.targetY = state.player.y;
  lastNameEl.textContent = "아직 없음";
  lastNameEl.style.color = "";
  lastDescriptionEl.textContent = "바나나를 수확해서 까면 판매함에 들어가고 도감이 채워집니다.";
  state.selectedTool = "move";
  renderCollection();
  renderLog();
  updateHud();
  setMessage(`농장 초기화 완료. 묘목은 무제한이고, 수확 가방은 ${bagLimit}칸입니다.`);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * W,
    y: ((event.clientY - rect.top) / rect.height) * H,
  };
}

function focusGame() {
  if (typeof canvas.focus === "function") {
    canvas.focus({ preventScroll: true });
  }
}

canvas.addEventListener("pointermove", (event) => {
  const p = canvasPoint(event);
  pointer.x = p.x;
  pointer.y = p.y;
  pointer.tile = tileAt(p.x, p.y);
});

canvas.addEventListener("pointerdown", (event) => {
  focusGame();
  canvas.setPointerCapture(event.pointerId);
  const p = canvasPoint(event);
  pointer.x = p.x;
  pointer.y = p.y;
  pointer.tile = tileAt(p.x, p.y);
  pointer.down = true;

  if (distance(p.x, p.y, peelStation.x, peelStation.y) < 100) {
    if (atPeelStation()) applyPeelWork(0.55);
    else {
      queuedAction = { type: "peel" };
      setMoveTarget(peelStation.x, peelStation.y + 10);
      setMessage("까기대로 이동 중입니다.");
    }
    return;
  }

  if (distance(p.x, p.y, market.x, market.y) < 98) {
    if (atMarket()) applySell();
    else {
      queuedAction = { type: "sell" };
      setMoveTarget(market.x, market.y + 42);
      setMessage("판매대로 이동 중입니다.");
    }
    return;
  }

  if (pointer.tile >= 0) {
    requestSmartTileAction(pointer.tile);
    return;
  }

  setMoveTarget(p.x, p.y);
});

canvas.addEventListener("pointerup", () => {
  pointer.down = false;
});

function releaseTouchAction() {
  keys.action = false;
  touchFarmHoldActive = false;
  touchFarmHoldTimer = 0;
  touchActionButton.classList.remove("holding");
}

touchActionButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  focusGame();
  touchActionButton.setPointerCapture(event.pointerId);
  keys.action = false;
  touchFarmHoldActive = true;
  touchFarmHoldTimer = 0.36;
  touchActionButton.classList.add("holding");
  hitImpact(state.player.x, state.player.y, "#ffd84a");
  performFarmButtonAction();
});

touchActionButton.addEventListener("pointerup", (event) => {
  event.preventDefault();
  event.stopPropagation();
  releaseTouchAction();
});

touchActionButton.addEventListener("pointercancel", releaseTouchAction);
touchActionButton.addEventListener("lostpointercapture", releaseTouchAction);

shopButtons.forEach((button) => {
  button.addEventListener("click", () => buyAutomation(button.dataset.shop));
});

upgradeButtons.forEach((button) => {
  button.addEventListener("click", () => buyFarmUpgrade(button.dataset.upgrade));
});

openUpgradeButton.addEventListener("click", () => {
  upgradeOverlay.hidden = false;
});

openCollectionButton.addEventListener("click", () => {
  collectionOverlay.hidden = false;
});

closeUpgradeButton.addEventListener("click", () => {
  upgradeOverlay.hidden = true;
  focusGame();
});

closeCollectionButton.addEventListener("click", () => {
  collectionOverlay.hidden = true;
  focusGame();
});

upgradeOverlay.addEventListener("click", (event) => {
  if (event.target === upgradeOverlay) {
    upgradeOverlay.hidden = true;
    focusGame();
  }
});

collectionOverlay.addEventListener("click", (event) => {
  if (event.target === collectionOverlay) {
    collectionOverlay.hidden = true;
    focusGame();
  }
});

sellButton.addEventListener("click", () => sellSome());

wipeButton.addEventListener("click", () => {
  if (window.confirm("저장된 바나나 밭을 초기화할까요?")) resetGame();
});

const movementKeys = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

function shouldRunSpaceAction(event, wasActionHeld) {
  const now = Date.now();
  if (!event.repeat || !wasActionHeld || now - lastSpaceActionAt > 240) {
    lastSpaceActionAt = now;
    return true;
  }
  return false;
}

function handleKeyDown(event) {
  if (event.code === "Escape" && (!upgradeOverlay.hidden || !collectionOverlay.hidden)) {
    event.preventDefault();
    upgradeOverlay.hidden = true;
    collectionOverlay.hidden = true;
    focusGame();
    return;
  }

  const movement = movementKeys[event.code];
  if (movement) {
    event.preventDefault();
    keys[movement] = true;
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    const wasActionHeld = keys.action;
    keys.action = true;
    if (shouldRunSpaceAction(event, wasActionHeld)) performCurrentTileAction();
    return;
  }

  if (event.code === "KeyE") {
    event.preventDefault();
    keys.action = true;
    if (!event.repeat) performContextAction();
    return;
  }

}

function handleKeyUp(event) {
  const movement = movementKeys[event.code];
  if (movement) {
    event.preventDefault();
    keys[movement] = false;
  }
  if (event.code === "Space" || event.code === "KeyE") {
    event.preventDefault();
    keys.action = false;
  }
}

document.addEventListener("keydown", handleKeyDown, { capture: true });
document.addEventListener("keyup", handleKeyUp, { capture: true });
window.addEventListener("beforeunload", saveGame);

loadGame();
renderCollection();
renderLog();
updateHud();
setMessage(`초반은 손으로 갈고 심고 물 주고 수확합니다. 묘목은 무제한이고, 가방은 ${bagLimit}칸입니다.`);
focusGame();
requestAnimationFrame(frame);
