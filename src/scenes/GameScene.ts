import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "@/components/MagicCircle";
import { Kobold } from "@/components/Kobold";

export class GameScene extends BaseScene {
  private background: Phaser.GameObjects.Image;
  private dragon: Phaser.GameObjects.Image;
  private kobolds: Kobold[];
  private circle: MagicCircle;

  private levels = [
    {
      cages: 3,
      time: 60,
      patterns: 2
    }
  ]

  constructor() {
    super({ key: "GameScene" });
    this.kobolds = [];
  }

  create(): void {

    this.fade(false, 200, 0x000000);

    this.background = this.add.image(0, 0, "background");

    this.dragon = this.add.image(this.CX, 300, "dragon");
    this.dragon.setScale(1);

    this.background.setOrigin(0, 0);

    this.fitToScreen(this.background);
    this.initTouchControls();

    this.setupGame();
  }

  setupGame() {
    const frontRow = Math.ceil(this.levels[0].cages / 2);
    const backRow = Math.floor(this.levels[0].cages / 2);

    for (let i = 0; i < backRow; i++) {
      const x = ((1 + i) * this.W) / frontRow;
      this.kobolds.push(new Kobold(this, x, 450, 0.2, this.levels[0].patterns));
    }

    for (let i = 0; i < frontRow; i++) {
      const offset = this.W / frontRow / 2;
      const x = (i * this.W) / frontRow + offset;
      this.kobolds.push(new Kobold(this, x, 500, 0.3, this.levels[0].patterns));
    }

    this.circle = new MagicCircle(this, this.CX, 950, 200, 1, true);
    this.circle.on("spell", (edges: string[]) => {
      this.kobolds.forEach((kobold) => {
        if (kobold.trySpell(edges)) {
          kobold.patternsLeft--;
          if (kobold.patternsLeft == 0) {
            kobold.setFree();
          } else {
            kobold.setRandomSpellPattern();
          }
        }
      });
    });
  }

  initTouchControls() {
    this.input.addPointer(2);

    // let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
    // touchArea.setInteractive({ useHandCursor: true, draggable: true });

    let touchId: number = -1;
    let touchButton: number = -1;
  }
}
