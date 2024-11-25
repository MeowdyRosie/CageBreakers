import {BaseScene} from "@/scenes/BaseScene";
import {Player} from "@/components/Player";
import {UI} from "@/components/UI";
import {Button} from "@/components/elements/Button";
import GameObject = Phaser.GameObjects.GameObject;

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private dragon: Phaser.GameObjects.Image;
	private frontKobolds: Phaser.GameObjects.Image;
	private backKobolds: Phaser.GameObjects.Image;
	private player: Player;
	private ui: UI;
	private line: any;
	private pathGraphics: any;
	private currentPath: Array<Button>;
	private lineStartPosition = {x: 0, y: 0};
	private nbPoints = 6;
	private pointImage: Phaser.GameObjects.Sprite;
	private isDragging = false;

	constructor() {
		super({key: "GameScene"});
	}

	create(): void {
		const dragonX: number = 0;
		const dragonY: number = 100;
		const numberOfKobolds: number = 5;

		this.line = this.add.line(0, 0, 0, 0, 100, 100, 0xffffff).setOrigin(0);
		this.line.setLineWidth(5);
		this.line.visible = false;

		this.pathGraphics = this.add.graphics();

		this.fade(false, 200, 0x000000);

		this.background = this.add.image(0, 0, "background")
		const frontRow = Math.ceil(numberOfKobolds / 2)
		const backRow = Math.floor(numberOfKobolds / 2)

		for (let i = 0; i < frontRow; i++) {
			let offset = (this.W / frontRow) / 2
			this.frontKobolds = this.add.image(i * this.W / frontRow + offset, 500, "kobold")
			this.frontKobolds.setOrigin(0.5, 0)
			this.frontKobolds.scale = 0.3
		}
		for (let i = 0; i < backRow; i++) {
			this.backKobolds = this.add.image((i + 1) * this.W / frontRow, 450, "kobold")
			this.backKobolds.setOrigin(0.5, 0)
			this.backKobolds.scale = 0.25
		}
		this.dragon = this.add.image(this.CX, 300, "dragon");
		this.dragon.setScale(0.8);
		this.background.setOrigin(0, 0);

		const startX: number = this.CX;
		const startY: number = 900;
		const distance: number = 200;

		this.fitToScreen(this.background);
		for (let i = 0; i < this.nbPoints; i++) {
			const p = (Math.PI * 2) * (i / this.nbPoints);
			const x = startX + Math.cos(p) * distance;
			const y = startY + Math.sin(p) * distance;


			console.log();
			const btn = new Button(this, x, y);
			this.pointImage = new Phaser.GameObjects.Sprite(this, 0, 0, "circle");
			btn.setSize(100, 100);
			btn.setInteractive();
			btn.add(this.pointImage);
		}

		/*for (let i = 0; i < 6; i++) {
			const p = (Math.PI * 2) * (i / 6);
			const circle = this.add.circle(startX + Math.cos(p) * distance, startY + Math.sin(p) * distance, 50, 0xFF0000);
			circle.setInteractive();
		}*/

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
		this.input.on("pointerdown", this.startDrag, this);
		this.input.on('pointermove', this.moveDrag, this);
	}

	startDrag(pointer: Phaser.Input.Pointer, Buttons: Button[]): void {
		this.isDragging = true;

		console.log(Buttons[0].x);


		// initialize Path
		this.currentPath = [Buttons[0]];

		// draw/save last segment of the path
		this.lineStartPosition.x = Buttons[0].x;
		this.lineStartPosition.y = Buttons[0].y;

		this.line.x = Buttons[0].x;
		this.line.y = Buttons[0].y;
		this.line.setTo(0, 0, 0, 0);
		this.line.visible = true;
	}

	moveDrag(pointer: Phaser.Input.Pointer, buttons: Button[]): void {
		console.log(this.isDragging);
		if (this.isDragging) {
			// Check If Circle is allowed to be added, to path
			// Here you would also check if the line is horizontal or vertical  (this part is currently not implemented)
			if (buttons[0] && this.currentPath.indexOf(buttons[0]) === -1) {
				this.currentPath.push(buttons[0]);

				this.line.x = buttons[0].x;
				this.line.y = buttons[0].y;

				this.lineStartPosition.x = buttons[0].x;
				this.lineStartPosition.y = buttons[0].y;

			}
			this.line.setTo(0, 0, pointer.x - this.lineStartPosition.x, pointer.y - this.lineStartPosition.y);
			this.drawPath();
		}
	}

	drawPath() {
		this.pathGraphics.clear();
		if (this.currentPath.length > 0) {
			this.pathGraphics.lineStyle(10, 0xffffff);
			let path = new Phaser.Curves.Path(this.currentPath[0].x, this.currentPath[0].y);
			for (let idx = 1; idx < this.currentPath.length; idx++) {
				let point = this.currentPath[idx];
				path.lineTo(point.x, point.y);
			}
			path.draw(this.pathGraphics);
		}
	}

}
