import * as THREE from "three";

export default class Layout {
	constructor(_options) {
		this.scene = _options.scene;
		this.resources = _options.resources;
		this.parameter = _options.parameter;

		this.setLayout();
	}

	setLayout() {
		this.setBackground();
		// this.setForeground();
	}

	setBackground() {
		const geometry = new THREE.PlaneGeometry(5.7, 9.5);

		const material = new THREE.MeshBasicMaterial({
			map: this.resources.items.background,
			transparent: true,
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.renderOrder = 0;
		this.scene.add(mesh);
	}

	setForeground() {
		const geometry = new THREE.PlaneGeometry(5, 10);

		const material = new THREE.MeshBasicMaterial({
			map: this.resources.items.foreground,
			transparent: true,
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.renderOrder = 5;
		this.scene.add(mesh);
	}
}
