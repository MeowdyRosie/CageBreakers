import { GameScene } from "@/scenes/GameScene";

export class UI extends Phaser.GameObjects.Container {
  public scene: GameScene;

  private panel: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;

  constructor(scene: GameScene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.scene = scene;

    const panelHeight = 200;

    this.panel = this.scene.add.container(0, 0);
    this.add(this.panel);

    this.background = this.scene.add.image(0, 0, "dragon_sit");
    this.background.setScale(panelHeight / this.background.height);
    this.panel.add(this.background);

    this.text = this.scene.addText({
      x: 0,
      y: 60,
      size: 60,
      color: "#FFFFFF",
      text: "Round 1",
    });
    this.text.setStroke("black", 4);
    this.text.setOrigin(0.5, 0.5);
    this.panel.add(this.text);
    this.text.setBackgroundColor("#FF5550");

    this.panel.setPosition(this.scene.W / 2, -100);
  }

  showNewRound(roundNumber: number) {
    this.text.text = "Round " + (roundNumber + 1);
    this.scene.tweens.add({
      targets: this.panel,
      y: this.scene.H / 2,
      duration: 500,
    });
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.tweens.add({
          targets: this.panel,
          y: this.scene.H + 100,
          duration: 500,
        });
		this.emit("startRound");
      },
    });
  }

  update(time: number, delta: number) {}
}
