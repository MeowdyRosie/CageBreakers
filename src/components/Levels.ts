import { BaseScene } from "@/scenes/BaseScene";

export class Levels extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  public patterns: number;
  public cages: number;
  public time: number;

  constructor(
    scene: BaseScene,
    cages: number,
    time: number,
    patterns: number

  ) {
    super(scene)
    scene.add.existing(this);
    this.patterns = patterns
    this.time = time
    this.cages = cages
  }
}