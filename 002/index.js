const Simplex = require("simplex-noise");
const setupRandom = require("@tatumcreative/random");
const initializeShortcuts = require("../lib/shortcuts");
const { setupCanvas, loop, generateSeed } = require("../lib/draw");
const lerp = require("lerp");
const TAU = Math.PI * 2;

{
  const seed = generateSeed();
  const random = setupRandom(seed);
  const simplex = new Simplex(random);
  const simplex3 = simplex.noise3D.bind(simplex);
  const ctx = setupCanvas();

  initializeShortcuts(seed);

  const config = {
    ctx,
    seed,
    random,
    simplex3,
    drag: 1,
    entityCount: 2000,
    entitySize: 10,
    baseSpeed: 2,
    maxSpeed: 5,
    rotateToBuddy: 0.1
  };

  // Mutable state.
  const current = {
    entities: generateEntities(config)
  };

  loop(now => {
    current.time = now;
    update(config, current);
    draw(config, current);
  });

  window.onhashchange = function() {
    location.reload();
  };

  window.addEventListener("resize", () => {});
}

function update(config, current) {
  const { entities, time } = current;
  const { ctx, entitySize, drag, maxSpeed, simplex3 } = config;
  const { width, height } = ctx.canvas;

  for (const entity of entities) {
    applyBuddyForce(config, entity, entities[entity.buddy]);

    // Apply drag.
    entity.speed *= drag;
    entity.speed = Math.min(entity.speed, maxSpeed);

    // Apply the speed.
    entity.x += Math.cos(entity.theta) * entity.speed;
    entity.y += Math.sin(entity.theta) * entity.speed;

    // Keep the entities in range, but allow them to go off the screen. Using just
    // a modulo operation here means that they "jump" to the other side while still
    // on the screen.
    if (entity.x < -entitySize) {
      entity.x = width + entitySize;
    } else if (entity.x > width + entitySize) {
      entity.x = -entitySize;
    }
    if (entity.y < -entitySize) {
      entity.y = height + entitySize;
    } else if (entity.y > height + entitySize) {
      entity.y = -entitySize;
    }
  }
}

function applyBuddyForce(config, entity, buddy) {
  const { rotateToBuddy } = config;
  const dx = buddy.x - entity.x;
  const dy = buddy.y - entity.y;

  entity.theta =
    lerpTheta(entity.theta, Math.atan2(dy, dx), rotateToBuddy) % TAU;

  entity.speed += Math.min(1, 1 / (dx * dx + dy * dy));

  // Apply the speed.
  entity.x += Math.cos(entity.theta) * entity.speed;
  entity.y += Math.sin(entity.theta) * entity.speed;
}

function lerpTheta(a, b, t) {
  a = ((a % TAU) + TAU) % TAU;
  b = ((b % TAU) + TAU) % TAU;

  if (b - a > Math.PI) {
    a += TAU;
  }
  return lerp(a, b, t);
}

function generateEntities(config) {
  const { entityCount, ctx, baseSpeed, random } = config;
  const { width, height } = ctx.canvas;
  const entities = [];

  for (let i = 0; i < entityCount; i++) {
    entities.push({
      index: i,
      x: random(width),
      y: random(height),
      theta: random(TAU),
      speed: baseSpeed,
      // Pick someone else random, but not yourself.
      buddy: (i + random(0, entityCount - 1, true)) % entityCount,
      buddy2: (i + random(0, entityCount - 1, true)) % entityCount
    });
  }
  return entities;
}

function draw(config, current) {
  const { ctx, entitySize } = config;
  const { entities, time } = current;

  // Clear out background.
  ctx.fillStyle = "#0003";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.lineWidth = 2 * devicePixelRatio;
  ctx.strokeStyle = "#fff";

  // Draw each entity
  ctx.beginPath();
  const halfSize = (entitySize * devicePixelRatio) / 2;
  for (const { x, y, theta } of entities) {
    const dx = Math.cos(theta) * halfSize;
    const dy = Math.sin(theta) * halfSize;

    ctx.moveTo(x - dx, y - dy);
    ctx.lineTo(x + dx, y + dy);
  }
  ctx.stroke();
}
