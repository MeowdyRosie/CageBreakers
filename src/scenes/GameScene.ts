import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "@/components/MagicCircle";
import { Prisoners } from "@/components/Prisoners";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;
import { Dragon } from "@/components/Dragon";
import { Difficulty, Level } from "@/components/Levels";
import { UI } from "@/components/UI";
import { Timer } from "@/components/Timer";
import { Music } from "@/components/Music";

type GameSceneData = {
  level: number;
  difficulty: Difficulty;
};

export class GameScene extends BaseScene {
  private background: Phaser.GameObjects.Image;
  private backgroundAnim: Phaser.GameObjects.Sprite;
  private gameOverText: Phaser.GameObjects.Image;
  private prisoners: Prisoners[];
  private dragon: Dragon;
  private circle: MagicCircle;
  private currentLevel: number = 0;
  private timer: TimerEvent;
  private timerObject: Timer;
  private ui: UI;
  private level: Level;
  public musicFirst: Phaser.Sound.WebAudioSound;
  public win: Phaser.Sound.BaseSound;
  public lose: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "GameScene" });
  }

  create({ level, difficulty }: GameSceneData): void {
    LevelState.completed = false;
    this.prisoners = [];
    this.fade(false, 200, 0x000000);

    this.background = this.add.image(this.CX, 0, "background");
    this.dragon = new Dragon(this, this.CX, 340, 0.3);
    this.level = new Level(difficulty, level);

    this.win = this.sound.add("win");
    this.lose = this.sound.add("lose");
    // Dragon moving
    this.background.setOrigin(0.5, 0);
    this.background.setScale(0.5, 0.5);
    this.fitToScreen(this.background);
    this.dragon.on("burnPrisoners", () => {
      this.prisoners.forEach((prisoner) => {
        prisoner.setFire();
      });
    });

    this.timer = this.time.addEvent({
      delay: this.level.getTime(), // ms
      callback: () => {
        this.dragon.stopIdle();
        this.dragon.approaching();
      },
      //args: [],
    });

    this.backgroundAnim = this.add
      .sprite(0, 0, "background_fire")
      .setScale(1)
      .setOrigin(0, 0);

    this.backgroundAnim.anims.create({
      key: "fire",
      frames: this.anims.generateFrameNames("background_fire", {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.backgroundAnim.play('fire');

    if (!this.musicFirst) {
      this.musicFirst = new Music(this, "m_first", { volume: 0.4 });
    }
    this.musicFirst.play();

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
    this.backgroundAnim.play("fire");
    const prisonerCount = this.level.getCages();
    const frontRow = Math.ceil(prisonerCount / 2);
    const backRow = Math.floor(prisonerCount / 2);
    const assumeFrontRow = prisonerCount % 2 ? frontRow : frontRow + 1;

    for (let i = 0; i < backRow; i++) {
      const x = ((1 + i) * this.W) / assumeFrontRow;
      this.prisoners.push(
        new Prisoners(this, x, 420, 0.18, this.level.getPatterns())
      );
    }

    for (let i = 0; i < frontRow; i++) {
      const offset = this.W / assumeFrontRow / 2;
      const x = (i * this.W) / assumeFrontRow + offset;
      this.prisoners.push(
        new Prisoners(this, x, 450, 0.2, this.level.getPatterns())
      );
    }

    this.timer = this.time.addEvent({
      delay: this.level.getTime() + 2500, // ms
      callback: () => {
        this.gameOver();
      },
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
        LevelState.completed = true;
      }
    });

    this.ui = new UI(this);
    this.ui.showNewRound(this.currentLevel);
  }

  endRound() {
    this.currentLevel++;
    // scale to higher difficulty
    if (this.level.difficulty != "medium" && this.currentLevel >= 10) {
      this.level.difficulty = "medium";
    }
    if (this.level.difficulty != "hard" && this.currentLevel >= 20) {
      this.level.difficulty = "hard";
    }
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
  }

  gameOver() {
    console.log("not completed", this.background);
    if (!LevelState.completed) {
      this.circle.destroy();
      this.gameOverText = this.add.image(this.CX, 1000, "gameover");
      this.lose.play();
      var timer = this.time.addEvent({
        delay: 5000, // ms
        callback: () => {
          this.scene.start("TitleScene");
        },
      });
    } else {
      this.win.play();
      var timer = this.time.addEvent({
        delay: 5000, // ms
        callback: () => {
          this.endRound();
        },
      });
    }
  }

  initTouchControls() {
    this.input.addPointer(2);

    // let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
    // touchArea.setInteractive({ useHandCursor: true, draggable: true });

    let touchId: number = -1;
    let touchButton: number = -1;
  }
}

export const LevelState = {
  completed: false,
};
