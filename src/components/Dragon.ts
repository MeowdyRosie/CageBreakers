import { BaseScene } from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;
import { LevelState } from "@/scenes/GameScene";
import { Music } from "@/components/Music";

export class Dragon extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  public dragon: Phaser.GameObjects.Sprite;
  public fire: Phaser.GameObjects.Sprite;
  public IsApproaching: boolean = false;
  private endPosy = -40;
  private scaleDragon = 1.2;
  private idleTimer: TimerEvent;
  private approachingTimeLine: Timeline;
  public footstep: Phaser.Sound.BaseSound;
  constructor(scene: BaseScene, x: number, y: number, scale: number) {
    super(scene, x, y);
    scene.add.existing(this);
    this.footstep = this.scene.sound.add("dragon_step");
    var maxTime = 10;
    var step = 0.15;
    var t = 0;

    this.dragon = scene.add
      .sprite(0, 0, "dragon_walk")
      .setScale(scale)
      .setOrigin(0.5, 0.5);
    this.add(this.dragon);
    this.idleTimer = this.scene.time.addEvent({
      delay: 1500, // ms
      callback: () => {
        this.dragon.toggleFlipX();
        this.footstep.play();
        this.dragon.y = Phaser.Math.Linear(0, this.endPosy, t);
        this.dragon.scale = Phaser.Math.Linear(0.3, this.scaleDragon, t);
        t += step;
      },
      //args: [],
      loop: true,
    });
    this.approachingTimeLine = this.scene.add.timeline([
      {
        at: 0,
        run: () => {
          this.dragon.destroy();
          this.dragon = this.scene.add
            .sprite(0, this.endPosy, "dragon_sit")
            .setScale(this.scaleDragon)
            .setOrigin(0.5, 0.5);
          this.add(this.dragon);
        },
      },
      {
        at: 1000,
        run: () => {
          this.dragon.destroy();
          this.dragon = this.scene.add
            .sprite(0, this.endPosy, "dragon_charge")
            .setScale(this.scaleDragon)
            .setOrigin(0.5, 0.5);
          this.add(this.dragon);
        },
      },
      {
        at: 2000,
        run: () => {
          this.dragon.destroy();
          this.dragon = this.scene.add
            .sprite(0, this.endPosy, "dragon_fire")
            .setScale(this.scaleDragon)
            .setOrigin(0.5, 0.5);
          this.add(this.dragon);
          this.fire = scene.add
            .sprite(0, 490, "dragon_firing")
            .setScale(this.scaleDragon + 0.1)
            .setOrigin(0.5, 0.5);
          this.fire.setDepth(100000);
          this.fire.anims.create({
            key: "fire",
            frames: scene.anims.generateFrameNames("dragon_firing", {
              frames: [0, 1, 2, 3],
            }),
            frameRate: 4,
            repeat: -1,
          });
          this.add(this.fire);
          this.fire.play("fire");
          this.emit("burnPrisoners");
        },
      },
      {
        at: 4000,
        run: () => {
          this.fire.destroy();
          this.dragon.destroy();
          if (LevelState.completed) {
            this.dragon = this.scene.add
              .sprite(0, this.endPosy, "dragon_anger")
              .setScale(this.scaleDragon)
              .setOrigin(0.5, 0.5);
          } else {
            this.dragon = this.scene.add
              .sprite(0, this.endPosy, "dragon_smug")
              .setScale(this.scaleDragon)
              .setOrigin(0.5, 0.5);
          }

          this.add(this.dragon);
        },
      },
    ]);
  }

  stopIdle() {
    this.idleTimer.destroy();
  }

  approaching() {
    if (!this.IsApproaching) {
      this.approachingTimeLine.play();
      this.IsApproaching = true;
    }
  }
}
