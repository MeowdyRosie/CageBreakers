import {BaseScene} from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;


export class Dragon extends Phaser.GameObjects.Container {
	public declare scene: BaseScene;
	public dragon: Phaser.GameObjects.Sprite;
	public IsApproaching: boolean = false;
	public isCompleted: boolean = false;
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


		this.dragon = scene.add
			.sprite(0, 0, "dragon_walk")
			.setScale(scale)
			.setOrigin(0.5, 0.5);
		this.add(this.dragon);
		this.idleTimer = this.scene.time.addEvent({
			delay: 1000, // ms
			callback: () => {
				//this.dragon.toggleFlipX();
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
					if(this.isCompleted)
					{
						this.dragon = this.scene.add
							.sprite(0, 0, "dragon_anger")
							.setScale(1)
							.setOrigin(0.5, 0.5);
					}
					else{
						this.dragon = this.scene.add
							.sprite(0, 0, "dragon_smug")
							.setScale(1)
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

	update(time: number, delta: number, duration: number) {
		/*console.log("update");
		if (this.lerpActive) {
			this.elapsedTime += delta;

			// Calculate progress (0 to 1)
			const t = Math.min(this.elapsedTime / duration, 1);

			this.dragon.scale = Phaser.Math.Linear(0.8, 1, t);
			// Interpolate position using Phaser.Math.Linear
			this.dragon.y  = Phaser.Math.Linear(0, 300, t);
			console.log(this.dragon.y);

			// Stop lerping when complete
			if (t === 1) {
				this.lerpActive = false;
				console.log('Lerp complete!');
			}
		}*/
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
