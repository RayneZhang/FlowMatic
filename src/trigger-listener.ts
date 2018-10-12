const triggerListener = {
    schema: {
        triggering: {type: 'boolean', default: 'false'},
        createdEl: {type: 'selector', default: null}
    },

    init: function(): void {

        const el = this.el;
        const sceneEl = document.querySelector('a-scene');

        this.el.addEventListener('triggerdown', (event) => {
            
            // Create an entity and append it to the scene.
            let newEntity: any = document.createElement('a-entity');
            sceneEl.appendChild(newEntity);

            // Add geometry component to the entity.
            newEntity.setAttribute('geometry', {
                primitive: 'box',
                height: 0.1,
                width: 0.1,
                depth: 0.1
            }); 

            // Add class component to the entity.
            newEntity.setAttribute('class', 'movable');

            // Add position component to the entity.
            const controllerPos: any = el.object3D.position;
            newEntity.object3D.position.set(controllerPos.x, controllerPos.y, controllerPos.z);

            // Set the boolean 'triggering' and the createdEl.
            el.setAttribute('trigger-listener', {createdEl: newEntity, triggering: 'true'});
        });

        this.el.addEventListener('triggerup', (event) => {
            el.setAttribute('trigger-listener', {createdEl: null, triggering: 'false'});
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default triggerListener;