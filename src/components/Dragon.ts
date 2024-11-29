import {BaseScene} from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;


export class Dragon extends Phaser.GameObjects.Container {
	public declare scene: BaseScene;
	public dragon: Phaser.GameObjects.Sprite;
	public IsApproaching: boolean = false;
	public isCompleted: boolean = false;
	private endScale = 1.2;
	// Define the lerp parameters
	private startX = 100;
	private endX = 700;
	private duration = 2000; // Duration in milliseconds
	private elapsedTime = 0;

	private lerpActive = true;
	private xtest = 0;
	private idleTimer: TimerEvent;
	private approachingTimeLine: Timeline;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		scale: number,
	) {
		super(scene, x, y);
		scene.add.existing(this);

		var maxTime = 10;
		var step = 0.15;
		var t = 0;

		this.dragon = scene.add
			.sprite(0, 340, "dragon_walk")
			.setScale(scale)
			.setOrigin(0.5, 0.5);
		this.add(this.dragon);
		this.idleTimer = this.scene.time.addEvent({
			delay: 1500, // ms
			callback: () => {
				this.dragon.toggleFlipX();
				this.dragon.y  = Phaser.Math.Linear(340, 225, t);
				this.dragon.scale = Phaser.Math.Linear(0.5, 1.3, t);
				t += step;
			},
			//args: [],
			loop: true,
		});
		this.approachingTimeLine = this.scene.add.timeline([
			{
				at: 0,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, 225, "dragon_sit")
						.setScale(1.2)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 3000,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, 225, "dragon_charge")
						.setScale(1.2)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 3500,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, 225, "dragon_fire")
						.setScale(1.2)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 5000,
				run: () => {
					this.dragon.destroy();
					if(this.isCompleted)
					{
						this.dragon = this.scene.add
							.sprite(0, 225, "dragon_anger")
							.setScale(1.2)
							.setOrigin(0.5, 0.5);
					}
					else{
						this.dragon = this.scene.add
							.sprite(0, 225, "dragon_smug")
							.setScale(1.2)
							.setOrigin(0.5, 0.5);
					}

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
	}

	stopIdle() {
		this.idleTimer.destroy();
	}

	approaching() {
		if(!this.IsApproaching)
		{
			this.approachingTimeLine.play();
			this.IsApproaching = true;
		}
	}
}
