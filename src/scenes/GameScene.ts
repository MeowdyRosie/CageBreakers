import {BaseScene} from "@/scenes/BaseScene";
import MagicCircle from "@/components/MagicCircle";
import {Kobold} from "@/components/Kobold";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;
import {Dragon} from "@/components/Dragon";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	//private dragon: Phaser.GameObjects.Image;
	private kobolds: Kobold[];
	private dragon: Dragon;
	private circle: MagicCircle;
	private currentLevel: number = 0;
	private timer: TimerEvent;
	private levels = [
		{
			cages: 3,
			time: 10,
			patterns: 2
		},
		{
			cages: 6,
			time: 60,
			patterns: 2
		},
	]

	constructor() {
		super({key: "GameScene"});
		this.kobolds = [];
	}

	create(): void {

		this.fade(false, 200, 0x000000);

		this.background = this.add.image(this.CX, -300, "background");

		this.dragon = new Dragon(this, this.CX, 300, 1);

        // Dragon moving
		this.background.setOrigin(0.5, 0);
    this.background.setScale(0.5,0.5)
		this.fitToScreen(this.background);
		this.initTouchControls();

		this.timer = this.time.addEvent({
			delay: (1000 * this.levels[this.currentLevel].time) - 5, // ms
			callback: () => {
				this.dragon.stopIdle();
				this.dragon.approaching();
			},
			//args: [],
		});
		this.setupGame();
	}

	setupGame() {
		const frontRow = Math.ceil(this.levels[this.currentLevel].cages / 2);
		const backRow = Math.floor(this.levels[this.currentLevel].cages / 2);

		for (let i = 0; i < backRow; i++) {
			const x = ((1 + i) * this.W) / frontRow;
			this.kobolds.push(new Kobold(this, x, 450, 0.2, this.levels[this.currentLevel].patterns));
		}

		for (let i = 0; i < frontRow; i++) {
			const offset = this.W / frontRow / 2;
			const x = (i * this.W) / frontRow + offset;
			this.kobolds.push(new Kobold(this, x, 500, 0.3, this.levels[this.currentLevel].patterns));
		}

		/*this.timer = this.time.addEvent({
			delay: this.levels[this.currentLevel].time * 1000, // ms
			callback: this.gameOver,
		});*/

		this.circle = new MagicCircle(this, this.CX, 950, 200, 1, true);
		this.circle.on("spell", (edges: string[]) => {
			this.kobolds.forEach((kobold) => {
				if (kobold.trySpell(edges)) {
					kobold.patternsLeft--;
					if (kobold.patternsLeft == 0) {
						kobold.setFree();
					} else {
						kobold.setRandomSpellPattern();
					}
				}
			});
			if (this.kobolds.every(kobold => kobold.patternsLeft == 0)) {
				this.currentLevel++;
				this.kobolds.forEach(kobold => kobold.destroy());
				this.setupGame();
			}
		});
	}

	finishGame(){

	}

	update(time: number, delta: number) {
		//console.log(this.timer.getOverallRemainingSeconds());
	}

	gameOver() {
		console.log("Game Over");
	}

	initTouchControls() {
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;
	}
}
