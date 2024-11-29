import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";

import { title, version } from "@/version.json";

const creditsLeft = `${title} 

@Arcticfqx
@Dreeda
@Fürst
@Luxx
@MeowdyMomo
@Nagifur
@Naika
@Phorzaeken
`;

const creditsRight = `

Code
Code
Code
Art
Code
Art
Art
Music
`;

export class TitleScene extends BaseScene {
  public bgbase: Phaser.GameObjects.Image;
  public bg1: Phaser.GameObjects.Image;
  public bg2: Phaser.GameObjects.Image;
  public bg3: Phaser.GameObjects.Image;
  public bg4: Phaser.GameObjects.Image;
  public bg5: Phaser.GameObjects.Image;
  public bg6: Phaser.GameObjects.Image;

  public credits: Phaser.GameObjects.Container;
  public title: Phaser.GameObjects.Image;
  public subtitle: Phaser.GameObjects.Image;
  public tap: Phaser.GameObjects.Text;
  public version: Phaser.GameObjects.Text;

  public musicTitle: Phaser.Sound.WebAudioSound;
  public select: Phaser.Sound.WebAudioSound;
  public select2: Phaser.Sound.WebAudioSound;

  public isStarting: boolean;
  public focused: boolean;

  constructor() {
    super({ key: "TitleScene" });
  }

  create(): void {
    this.fade(false, 200, 0x000000);

    this.bgbase = this.add.image(this.CX, this.CY, "bg_base");
    this.bg1 = this.add
      .image(this.CX, this.CY, "bg_layer1")
      .setScale(1.5)
      .setY(this.CY - 100);
    this.bg2 = this.add
      .image(this.CX, this.CY, "bg_layer2")
      .setX(this.CX + 200)
      .setY(this.CY + 100);
    this.bg3 = this.add
      .image(this.CX, this.CY, "bg_layer3")
      .setX(this.CX - 200);
    this.bg4 = this.add
      .image(this.CX, this.CY, "bg_layer4")
      .setScale(1.5)
      .setY(this.CY - 300);
    this.bg5 = this.add
      .image(this.CX, this.CY, "bg_layer5")
      .setY(this.CY + 250)
      .setX(this.CX + 250);
    this.bg6 = this.add
      .image(this.CX, this.CY, "bg_layer6")
      .setY(this.CY + 250)
      .setX(this.CX - 250);

    this.title = this.add.image(this.CX, this.CY, "mainmenu_1");
    this.subtitle = this.add.image(this.CX, this.CY, "mainmenu_2");

    this.title.setOrigin(0.5);
    this.title.setAlpha(0);

    this.subtitle.setOrigin(0.5);
    this.subtitle.setAlpha(0);

    this.tap = this.addText({
      x: this.CX,
      y: this.CY,
      size: 80,
      color: "#000",
      text: "Tap to focus",
    });
    this.tap.setOrigin(0.5);
    this.tap.setAlpha(-1);
    this.tap.setStroke("#FFF", 4);
    this.tap.setPadding(2);

    this.version = this.addText({
      x: this.W,
      y: this.H,
      size: 40,
      color: "#000",
      text: version,
    });
    this.version.setOrigin(1, 1);
    this.version.setAlpha(1);
    this.version.setStroke("#FFF", 4);
    this.version.setPadding(2);

    this.credits = this.add.container(0, 0);
    this.credits.setAlpha(0);

    let credits1 = this.addText({
      x: this.W / 2,
      y: 0,
      size: 20,
      color: "#000000",
      text: creditsLeft,
    });
    credits1.setStroke("#FFF", 4);
    credits1.setPadding(2);
    credits1.setLineSpacing(0);
    this.credits.add(credits1);

    let credits2 = this.addText({
      x: this.W - 120,
      y: 0,
      size: 20,
      color: "#000000",
      text: creditsRight,
    });
    credits2.setStroke("#FFF", 4);
    credits2.setPadding(2);
    credits2.setLineSpacing(0);
    this.credits.add(credits2);

    // Music
    if (!this.musicTitle) {
      this.musicTitle = new Music(this, "m_main_menu", { volume: 0.4 });

      // this.select = this.sound.add("dayShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
      // this.select2 = this.sound.add("nightShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
    }
    this.musicTitle.play();

    // Input

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      .on("down", this.progress, this);
    this.input.on(
      "pointerdown",
      (pointer: PointerEvent) => {
        if (pointer.button == 0) {
          this.progress();
        }
      },
      this
    );
    this.isStarting = false;
  }

  update(time: number, delta: number) {
    this.tap.alpha += 0.01 * (1 - this.tap.alpha);

    if (this.musicTitle.seek > 0) {
      //this.background.setVisible(true);
      this.tap.setVisible(false);
    }

    this.subtitle.setScale(1 + 0.02 * Math.sin((5 * time) / 1000));

    if (this.isStarting) {
      this.subtitle.setAlpha(0.6 + 0.4 * Math.sin((50 * time) / 1000));
    }
  }

  progress() {
    this.tweens.add({
      targets: this.bg1,
      scale: 1,
      y: this.CY,
      ease: "Cubic",
      duration: 1000,
      delay: 100,
    });

    this.tweens.add({
      targets: this.bg2,
      x: this.CX,
      y: this.CY,
      ease: "Cubic",
      duration: 2000,
      delay: 200,
    });
    this.tweens.add({
      targets: this.bg3,
      x: this.CX,
      ease: "Cubic",
      duration: 2000,
      delay: 300,
    });
    this.tweens.add({
      targets: this.bg4,
      y: this.CY,
      scale: 1,
      ease: "Cubic",
      duration: 2000,
      delay: 600,
    });
    this.tweens.add({
      targets: this.bg5,
      y: this.CY,
      x: this.CX,
      ease: "Cubic",
      duration: 2000,
      delay: 600,
    });
    this.tweens.add({
      targets: this.bg6,
      y: this.CY,
      x: this.CX,
      ease: "Cubic",
      duration: 2000,
      delay: 600,
    });
    this.tweens.add({
      targets: this.title,
      alpha: 1,
      ease: "Cubic",
      duration: 500,
      delay: 2000,
    });
    this.tweens.add({
      targets: this.subtitle,
      alpha: 1,
      ease: "Cubic",
      duration: 500,
      delay: 2300,
    });
    this.tweens.add({
      targets: this.credits,
      alpha: 1,
      ease: "Cubic",
      duration: 500,
      delay: 2300,
    });

    if (this.focused) {
      this.sound.play("t_rustle", { volume: 0.3 });
      // this.sound.play("m_slice", { volume: 0.3 });
      // this.sound.play("u_attack_button", { volume: 0.5 });
      // this.select2.play();
      this.isStarting = true;
      this.flash(3000, 0xffffff, 0.6);

      this.addEvent(1000, () => {
        this.fade(true, 1000, 0x000000);
        this.addEvent(1050, () => {
          this.musicTitle.stop();
          this.scene.start("GameScene");
        });
      });
    }
    this.focused = true;
  }
}
