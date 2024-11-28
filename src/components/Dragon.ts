import {BaseScene} from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;


export class Dragon extends Phaser.GameObjects.Container {
	public declare scene: BaseScene;
	public dragon: Phaser.GameObjects.Sprite;

	private idleTimer: TimerEvent;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		scale: number,
	) {
		super(scene, x, y);
		scene.add.existing(this);

		this.dragon = scene.add
			.sprite(0, 0, "dragon_walk")
			.setScale(scale)
			.setOrigin(0.5, 0.5);
		this.add(this.dragon);

		this.idleTimer = this.scene.time.addEvent({
			delay: 1000, // ms
			callback: () => {
				this.dragon.scaleX *= -1;
			},
			//args: [],
			loop: true,
		});
	}

	stopIdle() {
		this.idleTimer.destroy();
	}

	approaching() {
		const timeline = this.scene.add.timeline([
			{
				at: 0,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, 0, "dragon_sit")
						.setScale(1)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 3000,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, 0, "dragon_charge")
						.setScale(1)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 3500,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, 0, "dragon_fire")
						.setScale(1)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 5000,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, 0, "dragon_anger")
						.setScale(1)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			},
			/*{
			  at: 8000,
			  event: 'HURRY_PLAYER',
			  target: this.background,
			  set: {
				tint: 0xff0000
			  }
			}*/
		]);

		timeline.play();
	}
}
