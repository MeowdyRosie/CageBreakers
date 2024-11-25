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

	private nbPoints = 6;
	private pointImage: Phaser.GameObjects.Sprite;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
    const dragonX: number = 0;
    const dragonY: number = 100;
    const numberOfKobolds: number = 5;

		this.fade(false, 200, 0x000000);

		this.background = this.add.image(0, 0, "background")
    const frontRow = Math.ceil(numberOfKobolds/2)
    const backRow = Math.floor(numberOfKobolds/2)

    for ( let i=0; i < frontRow; i++) {
      let offset = (this.W/frontRow)/2
      this.frontKobolds = this.add.image(i*this.W/frontRow + offset,500,"kobold")
      this.frontKobolds.setOrigin(0.5,0)
      this.frontKobolds.scale = 0.3
    }
    for (let i=0; i < backRow; i++) {
      this.backKobolds = this.add.image((i+1)*this.W/frontRow,450,"kobold")
      this.backKobolds.setOrigin(0.5,0)
      this.backKobolds.scale = 0.25
    }
    
		this.dragon = this.add.image(this.CX, 300, "dragon");
		this.dragon.setScale(0.8);
		this.background.setOrigin(0,0);
    
		const startX: number = this.CX;
		const startY: number = 900;
		const distance: number = 200;

		this.fitToScreen(this.background);
		/*for (let i = 0; i < this.nbPoints; i++) {
			const p = (Math.PI * 2) * (i / this.nbPoints);
			const x = startX + Math.cos(p) * distance;
			const y = startY + Math.sin(p) * distance;


			console.log();
			/*const btn = new Button(this, x, y);
			this.pointImage = new Phaser.GameObjects.Sprite(this, 0, 0, "circle");
			btn.setSize(100, 100);
			btn.setInteractive();
			btn.add(this.pointImage);
			btn.on("pointerdown", () => console.log("test"));
		}*/

		for (let i = 0; i < 6; i++) {
			const p = (Math.PI * 2) * (i / 6);
			const circle = this.add.circle(startX + Math.cos(p) * distance, startY + Math.sin(p) * distance, 50, 0xFF0000);
			circle.setInteractive();
		}

		this.input.on("pointerdown", () => {
			console.log("pointer");
		});

		this.initTouchControls();
	}

	update(time: number, delta: number) {
	}


	initTouchControls() {
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;
		/*this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, gameobject: Phaser.GameObjects) => {
			console.log(gameobject);
		});*/

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
		});
		this.input.on("pointerdown", this.onPointerDown, this);
	}

	onPointerDown(pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]): void {
		console.log(pointer, currentlyOver);
	}

}
