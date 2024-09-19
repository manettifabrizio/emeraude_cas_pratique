import * as THREE from "three";

export default class Controller {
	constructor(player, scene) {
		this.player = player;
		this.scene = scene;
		this.camera = scene.instance;

		this.touchStartX = 0;
		this.playerStartX = 0;

		this.moveSpeed = 0.1;
		this.moveDirection = 0;

		this.addTouchListeners();
		this.addKeyboardListeners();
	}

	addTouchListeners() {
		window.addEventListener(
			"touchstart",
			this.onTouchStart.bind(this),
			false
		);
		window.addEventListener(
			"touchmove",
			this.onTouchMove.bind(this),
			false
		);
	}

	addKeyboardListeners() {
		window.addEventListener("keydown", this.onKeyDown.bind(this), false);
		window.addEventListener("keyup", this.onKeyUp.bind(this), false);
	}

	onTouchStart(event) {
		const touch = event.touches[0];
		this.touchStartX = touch.clientX;
		this.playerStartX = this.player.position.x;
	}

	onTouchMove(event) {
		const touch = event.touches[0];
		const deltaX = touch.clientX - this.touchStartX;

		this.player.position.x = this.playerStartX + deltaX * 0.02;

		this.restrainBucketPosition();
	}

	onKeyDown(event) {
		if (event.key === "ArrowLeft") {
			this.moveDirection = -1;
		} else if (event.key === "ArrowRight") {
			this.moveDirection = 1;
		}
	}

	onKeyUp(event) {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			this.moveDirection = 0;
		}
	}

	restrainBucketPosition() {
		const minX = -4.2 / 2;
		const maxX = 4.2 / 2;

		this.player.position.x = Math.max(
			minX,
			Math.min(maxX, this.player.position.x)
		);
	}

	update() {
		if (this.moveDirection !== 0) {
			this.player.position.x += this.moveSpeed * this.moveDirection;
			this.restrainBucketPosition();
		}
	}
}
