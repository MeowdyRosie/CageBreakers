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
  private kobold: Phaser.GameObjects.Image;
  private circle: MagicCircle;

  constructor(scene: BaseScene, x: number, y: number, scale: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.kobold = scene.add
      .image(x, y, "kobold")
      .setScale(scale)
      .setOrigin(0.5, 0);

    this.circle = new MagicCircle(scene, x, y, 50, scale, false);
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    this.circle.setSpellPattern(randomPattern);
  }
}
