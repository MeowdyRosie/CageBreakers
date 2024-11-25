import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Button } from "@/components/elements/Button";
import GameObject = Phaser.GameObjects.GameObject;

export class GameScene extends BaseScene {
  private background: Phaser.GameObjects.Image;
  private dragon: Phaser.GameObjects.Image;
  private frontKobolds: Phaser.GameObjects.Image;
  private backKobolds: Phaser.GameObjects.Image;
  private player: Player;
  private ui: UI;
  private line: Phaser.GameObjects.Line;
  private pathGraphics: Phaser.GameObjects.Graphics;
  private currentPath: Array<Button>;
  private nbPoints = 6;
  private pointImage: Phaser.GameObjects.Sprite;
  private isDragging = false;

  private path: Phaser.Curves.Path;

  constructor() {
    super({ key: "GameScene" });
    this.currentPath = [];
  }

  create(): void {
    const dragonX: number = 0;
    const dragonY: number = 100;
    const numberOfKobolds: number = 5;

    this.line = this.add.line(0, 0, 0, 0, 100, 100, 0xffffff).setOrigin(0);
    this.line.setLineWidth(5);
    this.line.visible = false;

    this.fade(false, 200, 0x000000);

    this.background = this.add.image(0, 0, "background");
    const frontRow = Math.ceil(numberOfKobolds / 2);
    const backRow = Math.floor(numberOfKobolds / 2);

    for (let i = 0; i < frontRow; i++) {
      let offset = this.W / frontRow / 2;
      this.frontKobolds = this.add.image(
        (i * this.W) / frontRow + offset,
        500,
        "kobold"
      );
      this.frontKobolds.setOrigin(0.5, 0);
      this.frontKobolds.scale = 0.3;
    }
    for (let i = 0; i < backRow; i++) {
      this.backKobolds = this.add.image(
        ((i + 1) * this.W) / frontRow,
        450,
        "kobold"
      );
      this.backKobolds.setOrigin(0.5, 0);
      this.backKobolds.scale = 0.25;
    }
    this.dragon = this.add.image(this.CX, 300, "dragon");
    this.dragon.setScale(0.8);
    this.background.setOrigin(0, 0);

    const startX: number = this.CX;
    const startY: number = 900;
    const distance: number = 200;

    this.fitToScreen(this.background);

    const addButton = (x: number, y: number) => {
      const btn = new Button(this, x, y);
      this.pointImage = new Phaser.GameObjects.Sprite(this, 0, 0, "circle");
      btn.setSize(100, 100);
      btn.setInteractive();
      btn.add(this.pointImage);
    };

    addButton(startX, startY);
    for (let i = 0; i < this.nbPoints; i++) {
      const p = Math.PI * 2 * (i / this.nbPoints) + Math.PI / this.nbPoints;
      const x = startX + Math.cos(p) * distance;
      const y = startY + Math.sin(p) * distance;
      addButton(x, y);
    }

    this.pathGraphics = this.add.graphics();

    this.initTouchControls();
  }

  update(time: number, delta: number) {}

  initTouchControls() {
    this.input.addPointer(2);

    // let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
    // touchArea.setInteractive({ useHandCursor: true, draggable: true });

    let touchId: number = -1;
    let touchButton: number = -1;

    this.input.on("pointerdown", this.startDrag, this);
    this.input.on("pointermove", this.moveDrag, this);
    this.input.on("pointerup", this.stopDrag, this);
  }

  startDrag(pointer: Phaser.Input.Pointer, Buttons: Button[]): void {
    this.isDragging = true;

    if (Buttons.length <= 0) return;

    // initialize Path
    this.currentPath = [Buttons[0]];

    this.line.x = Buttons[0].x;
    this.line.y = Buttons[0].y;
    //this.line.setTo(0, 0, 0, 0);
    this.line.visible = true;
  }

  moveDrag(pointer: Phaser.Input.Pointer, buttons: Button[]): void {
    if (!this.isDragging) return;
    if (buttons[0] && this.currentPath.indexOf(buttons[0]) === -1) {
      this.currentPath.push(buttons[0]);
      const lineStart = this.currentPath[this.currentPath.length - 2];
      const lineEnd = this.currentPath[this.currentPath.length - 1];

      if (lineEnd) {
        this.line.setTo(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
      }
    }

    this.path = this.add.path(0, 0);
    this.drawPath();
    if (this.currentPath[0]) {
      this.path.lineTo(pointer.x, pointer.y);
      this.path.draw(this.pathGraphics);
    }
  }

  drawPath() {
    if (this.currentPath[0]) {
      this.path = this.add.path(0, 0);
      this.path.startPoint.set(this.currentPath[0].x, this.currentPath[0].y);
      this.pathGraphics.clear();
      this.pathGraphics.lineStyle(10, 0xffffff);
    }
    if (this.currentPath.length >= 2) {
      this.currentPath.forEach((path) => {
        this.path.lineTo(path.x, path.y);
      });
    }
  }

  stopDrag() {
    this.drawPath();
    this.path.draw(this.pathGraphics);
    this.currentPath = [];
    this.isDragging = false;
    this.path.destroy();
  }
}
