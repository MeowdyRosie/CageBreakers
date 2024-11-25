import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Button } from "@/components/elements/Button";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private player: Player;
	private ui: UI;

	private nbPoints = 6;
	private pointImage: Phaser.GameObjects.Sprite;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0);

		const startX: number = this.CX;
		const startY: number = 800;
		const distance: number = 200;

		this.fitToScreen(this.background);
		for (let i = 0; i < this.nbPoints; i++) {
			const p = (Math.PI * 2) * (i / this.nbPoints);
			const x = startX + Math.cos(p) * distance;
			const y = startY + Math.sin(p) * distance;
			console.log();
			const btn = new Button(this, x, y);
			this.pointImage = new Phaser.GameObjects.Sprite(this, 0, 0, "");
			btn.add(this.pointImage);
			
		}

		this.ui = new UI(this);

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

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
		});

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
		});

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
		});
	}
}
