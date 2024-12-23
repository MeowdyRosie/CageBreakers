import { BaseScene } from "../scenes/BaseScene";

enum ParticleType {
  None = "",
  Explosion = "runetablet_node_active",
  GreenMagic = "runetablet_node_active",
  Shell = "runetablet_node_active", // Doesn't exist
  Sweat = "runetablet_node_active", // Doesn't exist
  BlueSparkle = "runetablet_node_active",
  DustExplosion = "runetablet_node_active",
  FireExplosion = "runetablet_node_active",
}

class Particle extends Phaser.GameObjects.Image {
  private myType: ParticleType;
  private pos: Phaser.Math.Vector2;
  private vel: Phaser.Math.Vector2;
  private acc: Phaser.Math.Vector2;
  private offset: Phaser.Math.Vector2;
  private life: number;
  private lifeTime: number;

  constructor(scene: BaseScene) {
    super(scene, 0, 0, "");

    this.setVisible(false);

    this.myType = ParticleType.None;
    this.pos = new Phaser.Math.Vector2(0, 0);
    this.vel = new Phaser.Math.Vector2(0, 0);
    this.acc = new Phaser.Math.Vector2(0, 0);
    this.offset = new Phaser.Math.Vector2(0, 0);
    this.life = 0;
    this.lifeTime = 0;
  }

  init(x: number, y: number, key: ParticleType) {
    this.x = x;
    this.y = y;
    this.myType = key;
    this.setTexture(key);
    this.setVisible(true);
    this.setTint(0xffffff);
    this.setAngle(0);
    this.setScale(1);
    this.setOrigin(0.5);
    this.pos.set(x, y);
    this.vel.reset();
    this.acc.reset();
    this.offset.reset();
    this.life = 0;
  }

  shell(x: number, y: number, tint: number) {
    this.init(x, y, ParticleType.Shell);
    this.setTint(tint);

    this.setAngle(360 * Math.random());
    this.setData("scale", 1 - 0.5 * Math.random() + -0.5);
    this.setScale(this.getData("scale"));
    this.setOrigin(0.5, 0.5);

    this.vel.setToPolar(2 * Math.PI * Math.random(), 20 + 40 * Math.random());
    // this.vel.y -= 100 + 50*Math.random();
    // this.vel.x *= 2;
    // this.acc.set(
    // 0,
    // 400
    // );
    this.setData("airtime", 0.4 + 0.3 * Math.random());

    this.lifeTime = 1 * Math.random();
  }

  sweat(x: number, y: number, flip: boolean) {
    this.init(x, y, ParticleType.Sweat);

    this.setAngle(360 * Math.random());
    this.setData("scale", 20 * (1 - 0.5 * Math.random()));
    this.setScale(this.getData("scale"));
    //this.setFrame(Math.floor(4 * Math.random()));

    this.vel.setToPolar(
      -0.0 * Math.PI + 0.2 * Math.PI * Math.random(),
      20 + 40 * Math.random()
    );

    if (!flip) {
      this.vel.x *= -1;
    }

    this.pos.x += -2 + 4 * Math.random() + (flip ? 2 : -2);
    this.pos.y += -2 + 4 * Math.random() + -3;

    this.setData("airtime", 0.4 + 0.3 * Math.random());

    this.lifeTime = 0.4 + 0.4 * Math.random();
  }

  explosion(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.init(x, y, ParticleType.Explosion);

    this.setScale((flip ? 1 : -1) * scale, scale);
    //this.setFrame(0);
    this.setOrigin(0.5);

    this.lifeTime = duration * (0.8 + 0.2 * Math.random());
  }

  greenMagic(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.init(x, y, ParticleType.GreenMagic);

    this.setScale((flip ? 1 : -1) * scale, scale);
    //this.setFrame(0);
    this.setOrigin(0.5);

    this.lifeTime = duration * (0.8 + 0.2 * Math.random());
  }

  blueSparkle(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.init(x, y, ParticleType.BlueSparkle);

    this.setScale((flip ? 1 : -1) * scale, scale);
    //this.setFrame(0);
    this.setOrigin(0.5);

    this.lifeTime = duration * (0.8 + 0.2 * Math.random());
  }

  dustExplosion(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.init(x, y, ParticleType.DustExplosion);

    this.setScale((flip ? 1 : -1) * scale, scale);
    //this.setFrame(0);
    this.setOrigin(0.5);

    this.lifeTime = duration * (0.8 + 0.2 * Math.random());
  }

  fireExplosion(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.init(x, y, ParticleType.FireExplosion);

    this.setScale((flip ? 1 : -1) * scale, scale);
    //this.setFrame(0);
    this.setOrigin(0.5);

    this.lifeTime = duration * (0.8 + 0.2 * Math.random());
  }

  update(time: number, delta: number) {
    time /= 1000;
    delta /= 1000;

    if (this.myType == ParticleType.Shell) {
      const k = this.getData("airtime");
      if (this.life > k) {
        this.vel.reset();
        this.acc.reset();
        this.offset.y = 5;
        let fade = 1 - (this.life - k) / (this.lifeTime - k);
        this.setScale(fade * this.getData("scale"));
      } else {
        this.offset.y =
          -10 * Math.sin((this.life / k) * Math.PI) + (5 * this.life) / k;
      }
    }

    if (this.myType == ParticleType.Sweat) {
      const k = this.getData("airtime");
      if (this.life > k) {
        this.vel.reset();
        this.acc.reset();
        this.offset.y = 5;
        let fade = 1 - (this.life - k) / (this.lifeTime - k);
        this.setScale(fade * this.getData("scale"));
      } else {
        this.offset.y =
          -10 * Math.sin((this.life / k) * Math.PI) + (5 * this.life) / k;
      }
    }

    if (this.myType == ParticleType.Explosion) {
      let frame = Math.floor(17 * (this.life / this.lifeTime));
      // let frame = Math.floor(17 * Math.pow(this.life / this.lifeTime, 0.65));
      //this.setFrame(frame);
    }

    if (this.myType == ParticleType.GreenMagic) {
      let frame = Math.floor(15 * (this.life / this.lifeTime));
      // let frame = Math.floor(15 * Math.pow(this.life / this.lifeTime, 0.65));
      //this.setFrame(frame);
    }

    if (this.myType == ParticleType.BlueSparkle) {
      let frame = Math.floor(15 * (this.life / this.lifeTime));
      // let frame = Math.floor(15 * Math.pow(this.life / this.lifeTime, 0.65));
      //this.setFrame(frame);
    }

    if (this.myType == ParticleType.DustExplosion) {
      let frame = Math.floor(15 * (this.life / this.lifeTime));
      // let frame = Math.floor(15 * Math.pow(this.life / this.lifeTime, 0.65));
      //this.setFrame(frame);
    }

    if (this.myType == ParticleType.FireExplosion) {
      let frame = Math.floor(6 * (this.life / this.lifeTime));
      // let frame = Math.floor(15 * Math.pow(this.life / this.lifeTime, 0.65));
      //this.setFrame(frame);
    }

    this.vel.x += this.acc.x * delta;
    this.vel.y += this.acc.y * delta;
    this.pos.x += this.vel.x * delta;
    this.pos.y += this.vel.y * delta;
    this.x = this.pos.x + this.offset.x;
    this.y = this.pos.y + this.offset.y;

    this.life += delta;
    if (this.life > this.lifeTime) {
      this.setVisible(false);
    }
  }
}

const MAX = 1000;

export class Particles extends Phaser.GameObjects.Container {
  private particles: Particle[];
  private index: number;

  constructor(scene: BaseScene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.particles = [];
    this.index = 0;

    // Preallocate MAX particles
    for (let i = 0; i < MAX; i++) {
      let particle = new Particle(scene);
      this.add(particle);
      this.particles.push(particle);
    }
  }

  update(time: number, delta: number) {
    this.particles.forEach((particle: Particle) => {
      if (particle.visible) {
        particle.update(time, delta);
      }
    });
  }

  getFreeParticle(): Particle | null {
    // Cycle x times until a free particle is found
    for (let i = 0; i < 50; i++) {
      this.index = (this.index + 1) % MAX;

      let p = this.particles[this.index];
      if (!p.visible) {
        return p;
      }
    }
    return null;
  }

  getFreeParticles(amount: number): Particle[] {
    let result: Particle[] = [];
    for (let i = 0; i < amount; i++) {
      let p = this.getFreeParticle();
      if (p) {
        result.push(p);
      }
    }
    return result;
  }

  createShells(x: number, y: number, amount: number, tint: number) {
    this.getFreeParticles(amount).forEach((particle) => {
      particle.shell(x, y, tint);
    });
  }

  createSweat(x: number, y: number, flip: boolean) {
    this.getFreeParticles(1).forEach((particle) => {
      particle.sweat(x, y, flip);
    });
  }

  createExplosion(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.getFreeParticles(1).forEach((particle) => {
      particle.explosion(x, y, scale, duration, flip);
    });
  }

  // 15 frames, 128x128
  createGreenMagic(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.getFreeParticles(1).forEach((particle) => {
      particle.greenMagic(x, y, scale, duration, flip);
    });
  }

  // 15 frames, 256x256
  createBlueSparkle(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.getFreeParticles(1).forEach((particle) => {
      particle.blueSparkle(x, y, scale, duration, flip);
    });
  }

  // 15 frames, 128x128
  createDustExplosion(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.getFreeParticles(1).forEach((particle) => {
      particle.dustExplosion(x, y, scale, duration, flip);
    });
  }

  createFire(
    x: number,
    y: number,
    scale: number,
    duration: number,
    flip: boolean
  ) {
    this.getFreeParticles(1).forEach((particle) => {
      particle.fireExplosion(x, y, scale, duration, flip);
    });
  }
}
