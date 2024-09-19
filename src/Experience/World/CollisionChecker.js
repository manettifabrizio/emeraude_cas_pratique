import * as THREE from "three";

export default class CollisionChecker {
	constructor(_options) {
		this.event = _options.event;
		this.parameter = _options.parameter;
		this.player = _options.player;
		this.spawner = _options.spawner;
	}

	// Since popcorns lay on the floor if not catched, to avoid
	// the collisions I only consider them with the top of the bucket
	createTopBoundingBox() {
		const topHeight = 0.2;
		const box3 = new THREE.Box3().setFromObject(this.player);
		const center = box3.getCenter(new THREE.Vector3());
		const size = box3.getSize(new THREE.Vector3());

		const topBox = new THREE.Box3(
			new THREE.Vector3(
				center.x - size.x / 2,
				center.y + size.y / 2 - topHeight,
				center.z - size.z / 2
			),
			new THREE.Vector3(
				center.x + size.x / 2,
				center.y + size.y / 2,
				center.z + size.z / 2
			)
		);

		return topBox;
	}

	checkCollision() {
		const topBoundingBox = this.createTopBoundingBox();

		// Go through each list in spawner.objectList (good, bad, bonus)
		this.spawner.objectLists.forEach((itemList, itemTypeIndex) => {
			itemList.forEach((item, itemIndex) => {
				const itemBox = new THREE.Box3().setFromObject(item);

				// Check if the item's bounding box intersects with the top bounding box
				if (topBoundingBox.intersectsBox(itemBox)) {
					this.handleCollision(item, itemTypeIndex, itemIndex);
				}
			});
		});
	}

	// Handle the collision between the player and a falling item
	handleCollision(item, itemTypeIndex, itemIndex) {
		this.addPoint(item);

		// Remove the popcorn from the spawner
		this.spawner.objectLists[itemTypeIndex].splice(itemIndex, 1);
		this.spawner.parameter.destroy(item);
	}

	addPoint(item) {
		if (item.name == "good") {
			this.parameter.score += 1;
		} else if (item.name == "bad") {
			if (this.parameter.score > 0) {
				this.parameter.score -= 1;
			}
			this.parameter.multiplier = 1;
		} else {
			this.parameter.score += 5 * this.parameter.multiplier;
			this.parameter.multiplier += 1;
		}
		this.event.updateScoreIndicator();
	}

	update() {
		this.checkCollision();
	}
}
