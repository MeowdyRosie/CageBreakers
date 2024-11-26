import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";

export default class MagicCircle extends Phaser.GameObjects.Container {
  public declare scene: BaseScene;
  private buttons: Array<Button>;

  private pathGraphics: Phaser.GameObjects.Graphics;
  private currentPath: Array<Button>;

  private path: Phaser.Curves.Path;

  private isDragging = false;

  constructor(scene: BaseScene, x: number, y: number, radius: number) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    const points = 6;

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
      button.setName(`${index}`);
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
    const findIndex = this.currentPath.indexOf(buttons[0]);

    if (buttons[0] && findIndex === -1) {
      this.currentPath.push(buttons[0]);
    }

    if (
      buttons[0] &&
      Number(buttons[0].name) == 3 &&
      Number(this.currentPath[this.currentPath.length - 1].name) != 3
    ) {
      this.currentPath.push(buttons[0]);
    }

    if (
      findIndex == 0 &&
      this.currentPath.length > 2 &&
      Number(buttons[0].name) != 3
    ) {
      this.currentPath.push(buttons[0]);
      this.#stopDrag();
      return;
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
    this.#emitPattern();
    this.currentPath = [];
  }

  #emitPattern() {
    const pattern = this.currentPath.map((button) => Number(button.name));

    const edges = this.findEdges(pattern);

    // this.normalizePattern(pattern);

    this.emit("spell", edges);
  }

  findEdges(pattern: number[]) {
    const opposites = [6, 5, 4];
    const isOpposite = (a: number, b: number) => {
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      return opposites[min] == max;
    };

    // Insert cener verteces if points are opposite on the circle
    for (let i = 1; i < pattern.length; i++) {
      if (isOpposite(pattern[i - 1], pattern[i])) {
        pattern.splice(i, 0, 3);
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

  /*
  normalizePattern(pattern: number[]) {
    let closed = pattern[0] == pattern[pattern.length - 1];

    this.findEdges(pattern);

    if (closed) {
      pattern.pop();
    }

    const opposites = [6, 5, 4];
    const isOpposite = (a: number, b: number) => {
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      return opposites[min] == max;
    };
    const insertMiddle = () => {
      for (let i = 1; i < pattern.length; i++) {
        if (isOpposite(pattern[i - 1], pattern[i])) {
          pattern.splice(i, 0, 3);
        }
      }
    };

    if (closed) {
      insertMiddle();
      const smallest = pattern.reduce(
        (prev, cur) => Math.min(prev, cur),
        Number.MAX_SAFE_INTEGER
      );
      const smallestIndex = pattern.findIndex((v) => v == smallest);
      pattern.push(...pattern.splice(0, smallestIndex));
      if (pattern[1] > pattern[pattern.length - 1]) {
        pattern.push(...pattern.splice(1, pattern.length).reverse());
      }
      pattern.push(pattern[0]);
    } else if (pattern[pattern.length - 1] < pattern[0]) {
      pattern.reverse();
    }
    insertMiddle();
  }
  */
}
