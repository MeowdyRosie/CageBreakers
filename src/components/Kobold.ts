import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";

const patterns = [
  [1, 3, 4],
  [0, 3, 6],
  [2, 3, 5],
  [6, 3, 0, 2],
  [4, 6, 3, 0, 2],
  [1, 4, 3, 5, 2],
  [3, 1, 0, 2, 3],
  [6, 3, 0, 2, 3],
  [0, 1, 3, 5, 6],
  [6, 3, 1, 3, 2],
  [6, 3, 0, 2, 5],
  [4, 1, 3, 2, 5],
  [0, 3, 2, 3, 6, 5],
  [6, 3, 5, 3, 0, 2],
  [4, 3, 2, 0, 1, 3, 5],
  [0, 3, 6, 3, 1, 3, 5],
  [3, 0, 2, 3, 5, 6, 3],
  [1, 3, 5, 3, 4, 3, 2],
  [1, 3, 0, 3, 2, 3, 6],
  [3, 1, 4, 3, 2, 5, 3],
  [0, 3, 2, 3, 5, 3, 6, 3, 4, 3, 1],
];

export class Kobold extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  private kobold: Phaser.GameObjects.Sprite;
  private circle: MagicCircle;
  private spellEdges: string[];
  patternsLeft: number;

  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    scale: number,
    patternsLeft: number
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.kobold = scene.add
      .sprite(0, 0, "kobold")
      .setScale(scale)
      .setOrigin(0.5, 0);
    this.add(this.kobold);

    this.patternsLeft = patternsLeft;

    this.kobold.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNames("kobold", {
        frames: [0, 1],
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.kobold.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNames("kobold", {
        frames: [2, 3],
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.kobold.playAfterDelay("idle", Math.random() * 500);

    this.circle = new MagicCircle(scene, 0, 0, 50, scale, false);
    this.add(this.circle);
    this.setRandomSpellPattern();
  }

  setRandomSpellPattern() {
    const lockPattern = patterns[Math.floor(Math.random() * patterns.length)];
    this.circle.clearSpellPattern();
    this.circle.setSpellPattern(lockPattern);
    this.spellEdges = this.circle.findEdges(lockPattern);
  }

  trySpell(pattern: string[]) {
    return this.circle.comparePattern(this.spellEdges, pattern);
  }

  setFree() {
    this.circle.setLineColor(0x00aa00);
    this.kobold.play("run");
  }
}
