import { BaseScene } from "@/scenes/BaseScene";

export class Kobold extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  private kobold: Phaser.GameObjects.Image;

  constructor(scene: BaseScene, x: number, y: number, scale: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.kobold = scene.add
      .image(x, y, "kobold")
      .setScale(scale)
      .setOrigin(0.5, 0);
  }
}
