import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "@/components/MagicCircle";
import { Kobold } from "@/components/Kobold";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;
import { Dragon } from "@/components/Dragon";
import { Level } from "@/components/Level";
import { UI } from "@/components/UI";

export class GameScene extends BaseScene {
  private background: Phaser.GameObjects.Image;
  //private dragon: Phaser.GameObjects.Image;
  private kobolds: Kobold[];
  private dragon: Dragon;
  private circle: MagicCircle;
  private currentLevel: number = 0;
  private timer: TimerEvent;
  public levelCompleted: boolean = false;
	private ui: UI;
  private level: Level;

  // = [
    //{
      //cages: 3,
      // 		time: 2,
      // 		patterns: 2,
    //},
    //{
      //cages: 6,
      //time: 60,
      // 		patterns: 2,
    //},
  // ];

  constructor() {
    super({ key: "GameScene" });
    this.kobolds = [];
  this.level = [];
  }

  create(): void {
    this.fade(false, 200, 0x000000);

    this.background = this.add.image(this.CX, -300, "background");

    this.dragon = new Dragon(this, this.CX, 300, 1);
    this.level = new Level();

    // Dragon moving
    this.background.setOrigin(0.5, 0);
    this.background.setScale(0.5, 0.5);
    this.fitToScreen(this.background);

    this.timer = this.time.addEvent({
      delay: this.level.getTime() - 5000, // ms
      callback: () => {
        this.dragon.stopIdle();
        this.dragon.approaching();
      },
      //args: [],
    });
    this.setupGame();
  }

  setupGame() {
    const frontRow = Math.ceil(this.level.getCages() / 2);
    const backRow = Math.floor(this.level.getCages() / 2);

    for (let i = 0; i < backRow; i++) {
      const x = ((1 + i) * this.W) / frontRow;
      this.kobolds.push(
        new Kobold(this, x, 450, 0.2, this.level.getPatterns())
      );
    }

    for (let i = 0; i < frontRow; i++) {
      const offset = this.W / frontRow / 2;
      const x = (i * this.W) / frontRow + offset;
      this.kobolds.push(
        new Kobold(this, x, 500, 0.3, this.level.getPatterns())
      );
    }

    this.timer = this.time.addEvent({
      delay: this.level.getTime(), // ms
      callback: this.gameOver,
    });

    this.circle = new MagicCircle(this, this.CX, 950, 200, 1, true);
    this.circle.on("spell", (edges: string[]) => {
      this.kobolds.forEach((kobold) => {
        if (kobold.patternsLeft > 0 && kobold.trySpell(edges)) {
          kobold.patternsLeft--;
          if (kobold.patternsLeft == 0) {
            kobold.setFree();
          } else {
            kobold.setRandomSpellPattern();
          }
        }
      });
      if (this.kobolds.every((kobold) => kobold.patternsLeft == 0)) {
        this.endRound();
      }
    });

    this.ui = new UI(this);
    this.ui.showNewRound(this.currentLevel);
  }

  endRound() {
    this.currentLevel++;
    this.circle.destroyPath();
    const timeToFlee = 3000;
    this.kobolds.forEach((kobold) => {
      kobold.flee(timeToFlee);
    });

    this.time.addEvent({
      delay: timeToFlee,
      callback: () => {
        this.kobolds.forEach((kobold) => {
          kobold.destroy();
        });
        this.setupGame();
      },
    });
  }

  finishGame() {}

  update(time: number, delta: number) {
    //console.log(this.timer.getOverallRemainingSeconds());
  }

  gameOver() {
    console.log("Game Over");
  }

  initTouchControls() {
    this.input.addPointer(2);

    // let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
    // touchArea.setInteractive({ useHandCursor: true, draggable: true });

    let touchId: number = -1;
    let touchButton: number = -1;
  }
}
