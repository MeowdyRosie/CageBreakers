import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";

const patterns = [
  [1, 0, 6, 0, 4, 5],
  [1, 4, 0, 2, 5, 0, 3, 6],
  [4, 1, 6, 5],
  [2, 5, 0, 1, 4],
  [1, 4, 5, 0, 6, 1],
  [1, 4],
  [3, 2, 0, 6, 5],
  [6, 1, 0, 5, 0, 4],
  [1, 2, 5, 4],
  [1, 0, 2, 3, 6, 5, 0, 4],
  [4, 1, 6, 0, 5],
  [3, 4, 1, 6],
  [4, 1, 6],
  [2, 3, 0, 5, 6],
  [2, 5, 0, 3, 6],
  [2, 0, 1, 0, 6, 0, 4],
  [2, 5, 6, 3, 2],
  [4, 1, 6, 0],
  [3, 6, 1, 2, 5],
];

export class Prisoners extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  private prisoners: Phaser.GameObjects.Sprite;
  private runeprompt: Phaser.GameObjects.Sprite;
  private circle: MagicCircle;
  private spellEdges: string[];
  private cageBack: Phaser.GameObjects.Sprite;
  private cageFront: Phaser.GameObjects.Sprite;
  patternsLeft: number;
  private creatures: string[];

  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    scale: number,
    patternsLeft: number
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.creatures = ["kobold", "cat", "deer", "kobold_mage", "mouse", "wolf"];
    const randomCreature = Math.floor(Math.random() * this.creatures.length);
    this.cageBack = scene.add
      .sprite(0, 0, "cage_back")
      .setScale(scale * 2)
      .setOrigin(0.5, 0);
    this.add(this.cageBack);
    this.prisoners = scene.add
      .sprite(0, 0, this.creatures[randomCreature])
      .setScale(scale)
      .setOrigin(0.5, 0);
    this.add(this.prisoners);
    this.cageFront = scene.add
      .sprite(0, 0, "cage_front")
      .setScale(scale * 2)
      .setOrigin(0.5, 0);
    this.add(this.cageFront);
    this.cageBack.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNames("cage_back", {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.cageFront.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNames("cage_back", {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.cageBack.play("idle");
    this.cageFront.play("idle");

    this.patternsLeft = patternsLeft;

    this.prisoners.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNames(this.creatures[randomCreature], {
        frames: [0, 1],
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.prisoners.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNames(
        this.creatures[randomCreature],
        {
          frames: [2, 3],
        }
      ),
      frameRate: 4,
      repeat: -1,
    });

    this.prisoners.playAfterDelay("idle", Math.random() * 500);

    this.runeprompt = this.scene.add
      .sprite(0, 0, "runeprompt")
      .setScale(1.25, 1.25);
    this.add(this.runeprompt);

    this.circle = new MagicCircle(scene, 0, 0, 50, scale * 0.5, false);
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
    // this.circle.setLineColor(0x00aa00);
    this.circle.setVisible(false);
    this.runeprompt.setVisible(false);
    this.cageBack.setVisible(false);
    this.cageFront.setVisible(false);
    this.prisoners.play("run");
    this.scene.tweens.add({
      targets: this.cageBack,
      alpha: 0,
      ease: "Linear",
      duration: 200,
    });
    this.scene.tweens.add({
      targets: this.cageFront,
      alpha: 0,
      scale: 0.01,
      x: 1000,
      ease: "Linear",
      duration: 1000,
    });
  }

  flee(duration: number) {
    this.scene.tweens.add({
      targets: this.prisoners,
      x: 1000,
      duration: duration,
    });
  }
}
