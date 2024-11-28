import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin";

export default class MagicCircle extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  private buttons: Array<Button>;

  private pathGraphics: Phaser.GameObjects.Graphics;
  private currentPath: Array<Button>;

  private path: Phaser.Curves.Path;

  private isDragging = false;
  private interactive = false;

  private lineColor = 0xffffff;

  private lineOutline: OutlinePipelinePlugin;

  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    radius: number,
    scale: number,
    interactive = false
  ) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    this.interactive = interactive;

    if (!interactive) {
      this.lineColor = 0xff0000;
    }

    const points = 6;

    this.buttons = [];
    this.currentPath = [];

    this.lineOutline = scene.plugins.get(
      "rexOutlinePipeline"
    ) as OutlinePipelinePlugin;

    type SpriteButton = Button & { sprite?: Phaser.GameObjects.Sprite };

    const addButton = (x: number, y: number, index: number, tint: number) => {
      const btn: SpriteButton = new Button(scene, x, y);
      btn.setSize(100, 100);
      if (interactive) {
        btn.setInteractive();
        const buttonSprite = scene.add
          .sprite(0, 0, "circle")
          .setScale(scale)
          .setTint(tint)
          .setOrigin(0.5, 0.5);
        btn.sprite = buttonSprite;
        btn.add(buttonSprite);
      }
      btn.setName(index.toString());
      this.buttons.push(btn);
      this.add(btn);
      return btn;
    };
    {
      const button = addButton(0, 0, 0, 0x0000ff);
      button
        .on("pointerover", () => {
          this.scene.tweens.add({
            targets: button.sprite,
            scale: scale * 1.2,
            tint: 0x00ffff,
            ease: "Linear",
            duration: 100,
          });
        })
        .on("pointerout", () => {
          this.scene.tweens.add({
            targets: button.sprite,
            scale: scale * 1,
            tint: 0x0000ff,
            ease: "Linear",
            duration: 100,
          });
        });
      for (let i = 0; i < points; i++) {
        const p = Math.PI * 2 * (i / points) + (Math.PI * 3) / points;
        const x = Math.cos(-p) * radius;
        const y = Math.sin(-p) * radius;
        const button = addButton(x, y, i + 1, 0xff0000);
        button
          .on("pointerover", () => {
            if (this.currentPath.indexOf(button) < 0) {
              console.log("found", button.name);
              this.scene.tweens.add({
                targets: button,
                scale: scale * 1.2,
                ease: "Linear",
                duration: 100,
              });
            }
          })
          .on("pointerout", () => {
            this.scene.tweens.add({
              targets: button,
              scale: scale * 1,
              ease: "Linear",
              duration: 100,
            });
          });
      }
    }
    /*
    this.buttons.forEach((btn, index) => {
      btn.add(scene.add.text(0, 0, `${index}`));
    });
*/
    this.buttons.forEach((button, index) => {
      button.setName(`${index}`);
    });

    this.pathGraphics = scene.add.graphics();
    this.add(this.pathGraphics);
    this.lineOutline.add(this.pathGraphics, {
      thickness: 8,
      outlineColor: 0x00cccc,
      quality: 0.1,
    });

    if (interactive) {
      this.scene.input.on("pointerdown", this.#startDrag, this);
      this.scene.input.on("pointermove", this.#moveDrag, this);
      this.scene.input.on("pointerup", this.#stopDrag, this);
      this.scene.input.on("gameout", this.#stopDrag, this);
    }
  }

  #startDrag(pointer: Phaser.Input.Pointer, buttons: Button[]): void {
    if (buttons.length <= 0) return;
    this.isDragging = true;
    this.path = this.scene.add.path(0, 0);
  }

  #moveDrag(pointer: Phaser.Input.Pointer, buttons: Button[]): void {
    if (!this.isDragging) return;
    const findIndex = this.currentPath.indexOf(buttons[0]);

    if (buttons[0] && findIndex === -1) {
      this.currentPath.push(buttons[0]);
    }

    if (
      buttons[0] &&
      Number(buttons[0].name) == 0 &&
      Number(this.currentPath[this.currentPath.length - 1].name) != 0
    ) {
      this.currentPath.push(buttons[0]);
    }

    if (
      findIndex == 0 &&
      this.currentPath.length > 2 &&
      Number(buttons[0].name) != 0
    ) {
      this.currentPath.push(buttons[0]);
      this.#stopDrag();
      return;
    }

    this.#drawPath();
    if (this.currentPath[0]) {
      this.path.lineTo(pointer.x - this.x, pointer.y - this.y);
      this.path.draw(this.pathGraphics);
    }
  }

  #drawPath() {
    if (this.currentPath[0]) {
      this.path = this.scene.add.path(0, 0);
      this.path.startPoint.set(this.currentPath[0].x, this.currentPath[0].y);
      this.pathGraphics.clear();
      this.pathGraphics.lineStyle(10, this.lineColor);
    }
    if (this.currentPath.length >= 2) {
      this.currentPath.forEach((path) => {
        this.path.lineTo(path.x, path.y);
      });
    }
    this.path.draw(this.pathGraphics);
  }

  #stopDrag() {
    if (!this.path || !this.isDragging) return;
    this.#drawPath();
    this.isDragging = false;
    this.path.destroy();
    this.#emitPattern();
    this.currentPath = [];
  }

  #emitPattern() {
    const pattern = this.currentPath.map((button) => Number(button.name));
    const edges = this.findEdges(pattern);
    this.emit("spell", edges);
  }

  findEdges(pattern: number[]) {
    const opposites: Record<number, number> = {
      [1]: 4,
      [2]: 5,
      [3]: 6,
    };
    const isOpposite = (a: number, b: number) => {
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      return opposites[min] == max;
    };

    // Insert center verteces if points are opposite on the circle
    for (let i = 1; i < pattern.length; i++) {
      if (isOpposite(pattern[i - 1], pattern[i])) {
        pattern.splice(i, 0, 0);
      }
    }

    const edgeSet = new Set<string>();
    for (let i = 1; i < pattern.length; i++) {
      const min = Math.min(pattern[i], pattern[i - 1]);
      const max = Math.max(pattern[i], pattern[i - 1]);
      edgeSet.add(`${min}${max}`);
    }
    const edges = [...edgeSet];
    edges.sort();

    return edges;
  }

  comparePattern(edgeSet1: string[], edgeSet2: string[]) {
    if (edgeSet1.length != edgeSet2.length) return false;
    for (let i = 0; i < edgeSet1.length; i++) {
      if (edgeSet1[i] != edgeSet2[i]) return false;
    }
    return true;
  }

  setSpellPattern(pattern: number[]) {
    this.clearSpellPattern();
    this.pathGraphics.lineStyle(10, this.lineColor);
    pattern.forEach((vert) => {
      this.currentPath.push(this.buttons[vert]);
    });
    this.#drawPath();
  }

  clearSpellPattern() {
    this.path = this.scene.add.path(0, 0);
    this.pathGraphics.clear();
    this.currentPath = [];
  }

  setLineColor(color: number) {
    this.lineColor = color;
    this.#drawPath();
  }

  public destroyPath() {
    this.pathGraphics.clear();
    this.pathGraphics.lineStyle(10, this.lineColor);
  }
}
