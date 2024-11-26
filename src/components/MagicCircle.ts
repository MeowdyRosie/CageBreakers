import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";

const alphabeth = (i: number) => {
  return String.fromCharCode("A".charCodeAt(0) + i);
};

export default class MagicCircle extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  private buttons: Array<Button>;

  private pathGraphics: Phaser.GameObjects.Graphics;
  private currentPath: Array<Button>;

  private path: Phaser.Curves.Path;

  private isDragging = false;

  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    points: number,
    radius: number
  ) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    this.buttons = [];
    this.currentPath = [];

    const addButton = (x: number, y: number, index: number) => {
      const btn = new Button(scene, x, y);
      btn.setSize(100, 100);
      btn.setInteractive();
      btn.setName(index.toString());
      btn.add(scene.add.sprite(0, 0, "circle"));
      this.buttons.push(btn);
    };

    addButton(this.x, this.y, 0);
    for (let i = 0; i < points; i++) {
      const p = Math.PI * 2 * (i / points) + Math.PI / points;
      const x = Math.cos(p) * radius + this.x;
      const y = Math.sin(p) * radius + this.y;
      addButton(x, y, i + 1);
    }

    this.buttons.sort((a, b) => {
      if (a.y !== b.y) {
        return a.y - b.y;
      } else {
        return a.x - b.x;
      }
    });

    this.buttons.forEach((button, index) => {
      button.setName(alphabeth(index));
    });

    this.pathGraphics = scene.add.graphics();

    this.scene.input.on("pointerdown", this.#startDrag, this);
    this.scene.input.on("pointermove", this.#moveDrag, this);
    this.scene.input.on("pointerup", this.#stopDrag, this);
    this.scene.input.on("gameout", this.#stopDrag, this);
  }

  #startDrag(pointer: Phaser.Input.Pointer, buttons: Button[]): void {
    if (buttons.length <= 0) return;
    this.isDragging = true;
    this.path = this.scene.add.path(0, 0);
  }

  #moveDrag(pointer: Phaser.Input.Pointer, buttons: Button[]): void {
    if (!this.isDragging) return;
    if (buttons[0] && this.currentPath.indexOf(buttons[0]) === -1) {
      this.currentPath.push(buttons[0]);
    }

    this.#drawPath();
    if (this.currentPath[0]) {
      this.path.lineTo(pointer.x, pointer.y);
      this.path.draw(this.pathGraphics);
    }
  }

  #drawPath() {
    if (this.currentPath[0]) {
      this.path = this.scene.add.path(0, 0);
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

  #stopDrag() {
    if (!this.path || !this.isDragging) return;
    this.#drawPath();
    this.path.draw(this.pathGraphics);
    this.isDragging = false;
    this.path.destroy();
    this.emit(
      "spell",
      this.currentPath.map((button) => button.name)
    );
    this.currentPath = [];
  }
}
