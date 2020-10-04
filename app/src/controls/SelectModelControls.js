import * as THREE from 'three';
import {SubdivisionModifier} from "three/examples/jsm/modifiers/SubdivisionModifier";
import {MeshBasicMaterial, Vector3} from "three";

export class SelectModelControls {

    constructor(renderRoot, camera, scene, selectControls) {
        this.renderRoot = renderRoot;
        this.camera = camera;
        this.scene = scene;
        this.selectControls = selectControls;
        this.subscribers = [];
    }

    subscribe = (subscriberFunction) => {
        this.subscribers.push(subscriberFunction);
    }

    constructGlow = () => {

        if(this.glow){
            this.scene.remove(this.glow);
        }
        if(!this.selectControls.selectedMeshedModel){
            return;
        }
        let boxGeometry = new THREE.BoxGeometry(
            this.selectControls.selectedMeshedModel.positionedModel.model.width,
            this.selectControls.selectedMeshedModel.positionedModel.model.height,
            this.selectControls.selectedMeshedModel.positionedModel.model.depth,
            2,
            2,
            2
        );

        const modifier = new SubdivisionModifier( 2);
        const boxHeight = boxGeometry.parameters.height;
        boxGeometry = modifier.modify( boxGeometry );

        const basicMaterial = new MeshBasicMaterial({
            color: new THREE.Color(0xffff00),
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: .5
        });

        this.glow = new THREE.Mesh(boxGeometry, basicMaterial);
        this.glow.position.set(
            this.selectControls.selectedMeshedModel.mesh.position.x,
            0,
            this.selectControls.selectedMeshedModel.mesh.position.z
        );
        this.glow.lookAt(new Vector3(
            this.selectControls.selectedMeshedModel.positionedModel.lookAtX,
            0,
            this.selectControls.selectedMeshedModel.positionedModel.lookAtZ,
        ));
        this.glow.position.set(
            this.selectControls.selectedMeshedModel.mesh.position.x,
            boxHeight/2 + .03,
            this.selectControls.selectedMeshedModel.mesh.position.z
        );
        this.scene.add(this.glow);
    }

    select = async () => {
        this.constructGlow();
        for(let subscriber of this.subscribers){
            await subscriber(this.selectControls.selectedMeshedModel ? this.selectControls.selectedMeshedModel.positionedModel : null);
        }
        this.selectControls.clearSelection();
    }

    enable = () => {
        this.selectControls.enable();
        this.renderRoot.addEventListener('mousedown', this.select);
    }

    disable = () => {
        this.selectControls.disable();
        this.tearDown();
    }

    tearDown = () => {
        this.selectControls.tearDown();
        if(this.glow){
            this.scene.remove(this.glow);
        }
        this.renderRoot.removeEventListener('mousedown', this.select);
    }

}