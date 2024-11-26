import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";

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

    this.circle = new MagicCircle(scene, x, y, 50, false);
  }
}
