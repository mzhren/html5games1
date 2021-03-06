import pop from "../../pop/index.js";
const { entity, Texture, TileSprite, wallslide, physics, Vec } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

const GRAVITY = 2900;
const JUMP_IMPULSE = 780;
const STEER_FORCE = 2000;
const MAX_VEL = 300;
const MIN_VEL = 200;
const FRICTION_GROUND = 1800;

const JUMP_FORGIVENESS = 0.08;

class Player extends TileSprite {
  constructor(controls, map) {
    super(texture, 48, 48);
    this.type = "player";
    this.controls = controls;
    this.map = map;
    this.frame.x = 4;
    this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    };
    this.anchor = {
      x: 0,
      y: 0
    };
    this.vel = new Vec();
    this.acc = new Vec();

    this.jumpedAt = 0;
    this.falling = true;
    this.fallingTimer = 0;

    this.hp = 5;
    this.invincible = 0;

    this.dir = -1;
  }

  hitBy(e) {
    if (this.invincible > 0) {
      return false;
    }
    this.knockBack(e);
    this.hp -= 1;
    if (this.hp <= 0) {
      this.gameOver = true;
    } else {
      this.invincible = 1.0;
    }
    return true;
  }

  knockBack(e) {
    const { vel, acc } = this;
    const angle = entity.angle(this, e);
    const power = 400;

    vel.set(0, 0);
    acc.set(0, 0);

    const dir = new Vec(Math.cos(angle), -1).multiply(power);
    physics.applyImpulse(this, dir, 1 / 60);
  }

  update(dt, t) {
    const { pos, controls, map, gameOver, vel, falling } = this;
    if (gameOver) {
      this.rotation += dt * 5;
      this.pivot.y = 24;
      this.pivot.x = 24;
      return;
    }

    const { keys } = controls;
    let { x, action: jump } = keys;
    if (x) {
      this.dir = x;
    }

    if (jump && !falling) {
      physics.applyImpulse(this, { x: 0, y: -JUMP_IMPULSE }, dt);
      this.falling = true;
    }

    if (this.falling) {
      physics.applyForce(this, { x: 0, y: GRAVITY });
    }

    // So you can jump and change dir (even though moving fast)
    const changingDirection = (x > 0 && vel.x < 0) || (x < 0 && vel.x > 0);

    //Instant speed up.
    if (x != 0 && Math.abs(vel.x) < MIN_VEL) {
      physics.applyForce(this, { x: x * STEER_FORCE * 2, y: 0 }, dt);
    } else if (changingDirection || (x && vel.mag() < MAX_VEL)) {
      physics.applyForce(this, { x: x * STEER_FORCE, y: 0 }, dt);
    }
    physics.applyHorizontalFriction(this, FRICTION_GROUND);

    let r = physics.integrate(this, dt);
    // Stop friction!
    if (vel.mag() <= 15) {
      vel.set(0, 0);
    }
    r = wallslide(this, map, r.x, r.y);
    pos.add(r);

    if (r.hits.down) {
      vel.y = 0;
      this.falling = false;
      this.fallingTime = 0;
    }

    if (r.hits.up) {
      vel.y = 0;
    }

    if (r.hits.left || r.hits.right) {
      vel.x = 0;
    }

    // Check if falling
    if (!this.falling && !r.hits.down) {
      // check if UNDER current is empty...
      const e = entity.bounds(this);
      const leftFoot = map.pixelToMapPos({ x: e.x, y: e.y + e.h + 1 });
      const rightFoot = map.pixelToMapPos({ x: e.x + e.w, y: e.y + e.h + 1 });
      const left = map.tileAtMapPos(leftFoot);
      const right = map.tileAtMapPos(rightFoot);
      if (left.frame.walkable && right.frame.walkable) {
        if (this.fallingTimer <= 0) {
          this.fallingTimer = JUMP_FORGIVENESS;
        } else {
          if ((this.fallingTimer -= dt) <= 0) {
            this.falling = true;
          }
        }
      }
    }

    // Animations
    if ((this.invincible -= dt) > 0) {
      this.alpha = (t * 10 % 2) | 0 ? 0 : 1;
      //this.visible = this.alpha > 0 ? 1 : 0;
    } else {
      this.alpha = 1;
    }

    if (x && !this.falling) {
      this.frame.x = ((t / 0.1) | 0) % 4;
      if (x > 0) {
        this.anchor.x = 0;
        this.scale.x = 1;
      } else if (x < 0){
        this.anchor.x = this.w;
        this.scale.x = -1;
      }
    }
  }
}

export default Player;
