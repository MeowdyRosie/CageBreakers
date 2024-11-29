import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "@/components/MagicCircle";
import { Prisoners } from "@/components/Prisoners";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;
import { Dragon } from "@/components/Dragon";
import { Difficulty, Level } from "@/components/Levels";
import { UI } from "@/components/UI";
import { Timer } from "@/components/Timer";

type GameSceneData = {
  level: number;
  difficulty: Difficulty;
};
export class GameScene extends BaseScene {
  private background: Phaser.GameObjects.Image;
  private prisoners: Prisoners[];
  private dragon: Dragon;
  private circle: MagicCircle;
  private currentLevel: number = 0;
  private timer: TimerEvent;
  private timerObject: Timer;
  public levelCompleted: boolean = false;
  private ui: UI;
  private level: Level;

  constructor() {
    super({ key: "GameScene" });
  }

  create({ level, difficulty }: GameSceneData): void {
    this.prisoners = [];
    this.fade(false, 200, 0x000000);

    this.background = this.add.image(this.CX, 0, "background");

    this.dragon = new Dragon(this, this.CX, 0, 0.5);
    this.level = new Level(difficulty, level);

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

    this.timerObject = new Timer(this, -200, 200, 200, 0xfa9425);
    this.tweens.addCounter({
      from: 1,
      to: 0,
      duration: this.level.getTime(),
      onStart: () => {
        this.timerObject.setVisible(true);
      },
      onUpdate: (tween) => {
        this.timerObject.redraw(tween.getValue());
      },
      onComplete: () => {},
    });
  }

  setupGame() {
    this.prisoners = [];
    const prisonerCount = this.level.getCages();
    const frontRow = Math.ceil(this.level.getCages() / 2);
    const backRow = Math.floor(this.level.getCages() / 2);
    const assumeFrontRow = prisonerCount % 2 ? frontRow : frontRow + 1;

    for (let i = 0; i < backRow; i++) {
      const x = ((1 + i) * this.W) / assumeFrontRow;
      this.prisoners.push(
        new Prisoners(this, x, 450, 0.2, this.level.getPatterns())
      );
    }

    for (let i = 0; i < frontRow; i++) {
      const offset = this.W / assumeFrontRow / 2;
      const x = (i * this.W) / assumeFrontRow + offset;
      this.prisoners.push(
        new Prisoners(this, x, 500, 0.3, this.level.getPatterns())
      );
    }

    this.timer = this.time.addEvent({
      delay: this.level.getTime(), // ms
      callback: this.gameOver,
    });

    this.circle = new MagicCircle(this, this.CX, 1000, 200, 1, true);
    this.circle.on("spell", (edges: string[]) => {
      this.prisoners.forEach((kobold) => {
        if (kobold.patternsLeft > 0 && kobold.trySpell(edges)) {
          kobold.patternsLeft--;
          if (kobold.patternsLeft == 0) {
            kobold.setFree();
            kobold.flee(2000);
            this.flash(500);
          } else {
            kobold.setRandomSpellPattern();
          }
        }
      });
      if (this.prisoners.every((kobold) => kobold.patternsLeft == 0)) {
        //this.endRound();
      }
    });

    this.ui = new UI(this);
    this.ui.showNewRound(this.currentLevel);
  }

  endRound() {
    this.currentLevel++;
    this.circle.destroyPath();
    const timeToFlee = 3000;
    this.prisoners.forEach((kobold) => {
      kobold.flee(timeToFlee);
    });

    this.time.addEvent({
      delay: timeToFlee,
      callback: () => {
        const { difficulty, level } = this.level;
        this.scene.restart({
          difficulty: "hard",
          level: level + 1,
        } as GameSceneData);
      },
    });
  }

  finishGame() {}

  update(time: number, delta: number) {
    this.circle.update(time, delta);
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
