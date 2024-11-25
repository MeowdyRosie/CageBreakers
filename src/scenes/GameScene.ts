import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
  private dragon: Phaser.GameObjects.Image;
  private kobolds: Phaser.GameObjects.Image;
	private player: Player;
	private ui: UI;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
    const dragonX: number = 0;
    const dragonY: number = 100;
    const numberOfKobolds: number = 3;

		this.fade(false, 200, 0x000000);

		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0);

    this.dragon = this.add.image(dragonX, dragonY, "dragon")
    this.dragon.setOrigin(0.0,0.0)
    this.dragon.scale = 0.5
    


    for ( let i=0; i < numberOfKobolds; i++) {

        this.kobolds = this.add.image(i*this.W/numberOfKobolds,400,"kobold")
        this.kobolds.setOrigin(0,0)
        this.kobolds.scale = 0.3
    }
      
    
		const startX: number = this.CX;
		const startY: number = 800;
		const distance: number = 200;

		this.fitToScreen(this.background);
		for (let i = 0; i < 6; i++) {
			const p = (Math.PI * 2) * (i / 6);
			this.add.circle(startX + Math.cos(p) * distance, startY + Math.sin(p) * distance, 50, 0xFF0000);
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
