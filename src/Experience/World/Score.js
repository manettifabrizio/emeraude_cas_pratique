import * as THREE from "three";

export default class Score {
	constructor(_options) {
		this.scene = _options.scene;
		this.parameter = _options.parameter;

		this.setUpScoreDisplay();
	}

	// Creates the plane that will show the score
	setUpScoreDisplay() {
		this.mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(3.2, 2.16),
			new THREE.MeshBasicMaterial({
				map: null,
				transparent: true,
				visible: false,
			})
		);
		this.scene.add(this.mesh);
	}

	// Creates a texture for the score display
	createNumberTexture(score, width = 400, height = 256) {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext("2d");

		// Set the font and styling
		context.font = "bold 50px Arial";
		context.fillStyle = "maroon";
		context.textAlign = "center";
		context.textBaseline = "middle";

		// Add glow effect (shadow)
		context.shadowColor = "white";
		context.shadowBlur = 20;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;

		if (score > 14) {
			// Display "You Won!" if score is 15
			context.font = "bold 70px Arial";
			context.fillText("YOU\n WON!", canvas.width / 2, canvas.height / 2);
			this.parameter.canUpdate = false;
		} else {
			context.fillText("Points", canvas.width / 2, canvas.height / 4);
			context.font = "bold 150px Arial";
			context.fillText(score, canvas.width / 2, (canvas.height / 4) * 3);
		}

		const texture = new THREE.CanvasTexture(canvas);
		return texture;
	}

	update() {
		// Wait for the Starter counter to finish to display score
		if (this.parameter.counterOn === false) {
			// Remove the old texture and create a new one with the updated score
			if (this.mesh.material.map) this.mesh.material.map.dispose();
			this.mesh.material.map = this.createNumberTexture(
				this.parameter.score
			);
			this.mesh.material.visible = true;
			this.mesh.visible = true;
			this.mesh.material.needsUpdate = true;
		}
	}
}
