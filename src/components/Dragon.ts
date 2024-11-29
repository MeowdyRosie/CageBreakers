import {BaseScene} from "@/scenes/BaseScene";
import MagicCircle from "./MagicCircle";
import TimerEvent = Phaser.Time.TimerEvent;
import Timeline = Phaser.Time.Timeline;


export class Dragon extends Phaser.GameObjects.Container {
	public declare scene: BaseScene;
	public dragon: Phaser.GameObjects.Sprite;
	public fire: Phaser.GameObjects.Sprite;
	public IsApproaching: boolean = false;
	public isCompleted: boolean = false;
	private endPosy = 90;
	private scaleDragon = 1.4;
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
			.sprite(0, 140, "dragon_walk")
			.setScale(scale)
			.setOrigin(0.5, 0.5);
		this.add(this.dragon);
		this.idleTimer = this.scene.time.addEvent({
			delay: 1500, // ms
			callback: () => {
				this.dragon.toggleFlipX();
				this.dragon.y  = Phaser.Math.Linear(140, this.endPosy, t);
				this.dragon.scale = Phaser.Math.Linear(0.5, this.scaleDragon, t);
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
						.sprite(0, this.endPosy, "dragon_sit")
						.setScale(this.scaleDragon)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 1000,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, this.endPosy, "dragon_charge")
						.setScale(this.scaleDragon)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
				},

			}, {
				at: 2000,
				run: () => {
					this.dragon.destroy();
					this.dragon = this.scene.add
						.sprite(0, this.endPosy, "dragon_fire")
						.setScale(this.scaleDragon)
						.setOrigin(0.5, 0.5);
					this.add(this.dragon);
					this.fire = scene.add
						.sprite(0, this.endPosy+ 30, "dragon_firing")
						.setScale(this.scaleDragon)
						.setOrigin(0.5, 0.5);
					this.fire.setZ(10);
					this.fire.anims.create({
						key: "fire",
						frames: scene.anims.generateFrameNames("dragon_firing", {
							frames: [0, 1, 2, 3],
						}),
						frameRate: 4,
						repeat: -1,
					});
					this.add(this.fire);
					this.fire.play("fire");
					this.emit("burnPrisoners");
					},

			}, {
				at: 4000,
				run: () => {
					this.fire.destroy();
					this.dragon.destroy();
					if(this.isCompleted)
					{
						this.dragon = this.scene.add
							.sprite(0, this.endPosy, "dragon_anger")
							.setScale(this.scaleDragon)
							.setOrigin(0.5, 0.5);
					}
					else{
						this.dragon = this.scene.add
							.sprite(0, this.endPosy, "dragon_smug")
							.setScale(this.scaleDragon)
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
