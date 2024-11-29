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

    if (interactive) {
      const tabletStripes = scene.add
        .sprite(0, 0, "runetablet_stripes")
        .setScale(0.625);
      const tabletRunes = scene.add
        .sprite(0, 0, "runetablet_runes")
        .setScale(0.625);
      this.add(
        scene.add
          .sprite(0, 0, "runetablet_base")
          .setScale(0.625)
          .setAlpha(0.1, 0.1, 1, 1)
          .setCrop(0, 0, 1230, 615)
      );
      this.add(
        scene.add
          .sprite(0, 0, "runetablet_base")
          .setScale(0.625)
          .setCrop(0, 615, 1230, 615)
      );
      this.add(tabletStripes);
      this.add(tabletRunes);
      scene.tweens
        .add({
          from: 0,
          to: 1,
          duration: 60000,
          targets: tabletRunes,
          loop: Number.MAX_SAFE_INTEGER,
          onUpdate(tween) {
            const rot = tween.progress * Math.PI * 2;
            tabletStripes.setRotation(rot);
            tabletRunes.setRotation(-rot);
          },
        })
        .play();
    }

    type SpriteButton = Button & {
      sprite?: Phaser.GameObjects.Sprite;
      sprite2?: Phaser.GameObjects.Sprite;
    };

    const addButton = (x: number, y: number, index: number) => {
      const btn: SpriteButton = new Button(scene, x, y);
      btn.setSize(100, 100);
      if (interactive) {
        btn.setInteractive();
        const buttonSprite = scene.add
          .sprite(0, 0, "runetablet_node_inactive")
          .setScale(scale * 0.625)
          .setOrigin(0.5, 0.5);
        buttonSprite.preFX
          ?.addColorMatrix()
          .hue(Math.floor((Math.random() * 360) / 45) * 45);
        const buttonSprite2 = scene.add
          .sprite(0, 0, "runetablet_node_active")
          .setScale(scale * 0.625)
          .setOrigin(0.5, 0.5);
        buttonSprite2.preFX
          ?.addColorMatrix()
          .hue(Math.floor((Math.random() * 360) / 45) * 45);
        btn.sprite = buttonSprite;
        btn.sprite2 = buttonSprite2;
        btn.add(buttonSprite);
        btn.add(buttonSprite2);
      }
      btn.setName(index.toString());
      this.buttons.push(btn);
      this.add(btn);
      return btn;
    };
    {
      const button = addButton(0, 0, 0);
      button
        .on("pointerover", () => {
          this.scene.tweens.add({
            targets: button.sprite,
            scale: scale * 1.2 * 0.625,
            ease: "Linear",
            duration: 100,
          });
        })
        .on("pointerout", () => {
          this.scene.tweens.add({
            targets: button.sprite,
            scale: scale * 0.625,
            ease: "Linear",
            duration: 100,
          });
        });
      for (let i = 0; i < points; i++) {
        const p = Math.PI * 2 * (i / points) + (Math.PI * 3) / points;
        const x = Math.cos(-p) * radius;
        const y = Math.sin(-p) * radius;
        const button = addButton(x, y, i + 1);
        button
          .on("pointerover", () => {
            if (this.currentPath.indexOf(button) < 0) {
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
      thickness: interactive ? 8 : 4,
      outlineColor: interactive ? 0x00cccc : 0xffaaaa,
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
