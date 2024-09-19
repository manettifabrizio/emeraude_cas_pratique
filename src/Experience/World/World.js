import * as THREE from "three";

import GlobalParameter from "./GlobalParameter";

import Layout from "./GameElements/Layout";
import Player from "./GameElements/Player/Player";
import ObjectSpawner from "./GameElements/Corns/ObjectSpawner";
import CollisionChecker from "./CollisionChecker";
import Score from "./Score";

export default class World {
	constructor(_options) {
		this.event = _options.event;
		this.scene = _options.scene;
		this.resources = _options.resources;

		this.parameter = new GlobalParameter({
			event: this.event,
			scene: this.scene,
		});
	}

	ready() {
		this.layout = new Layout({
			scene: this.scene,
			resources: this.resources,
			parameter: this.parameter,
		});

		this.player = new Player({
			event: this.event,
			scene: this.scene,
			resources: this.resources,
			parameter: this.parameter,
		});

		this.spawner = new ObjectSpawner({
			event: this.event,
			scene: this.scene,
			resources: this.resources,
			parameter: this.parameter,
			player: this.player,
		});

		this.collisionChecker = new CollisionChecker({
			event: this.event,
			parameter: this.parameter,
			player: this.player.player,
			spawner: this.spawner,
		});

		this.score = new Score({
			scene: this.scene,
			parameter: this.parameter,
		});

		this.isReady = true;
		this.event.start();
	}

	update(deltaT) {
		this.parameter.canUpdate = true;

		if (this.isReady && this.parameter.canUpdate) {
			this.player.update(deltaT);
			this.score.update(deltaT);
			this.spawner.update(deltaT);
			this.collisionChecker.update(deltaT);
		}

		// If the score is 15 the game is finished, destroy all corns
		if (this.parameter.score > 14) {
			this.spawner.destroyCorns();
		}
	}
}
