const xbuttonListener = {
    init: function(): void {

        const el = this.el;
        const sceneEl = document.querySelector('a-scene');
    
        // Create a menu entity and append it to the controller.
        let menuEntity: any = document.createElement('a-entity');
        el.appendChild(menuEntity);

        // Add plane as geometry component to the entity.
        menuEntity.setAttribute('geometry', {
            primitive: 'plane',
            width: 0.2,
            height: 0.2
        }); 

        // Set color of the menu entity.
        menuEntity.setAttribute('material', 'color', 'grey'); 

        // Set id of the menu entity.
        menuEntity.setAttribute('id', 'menu');

        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        this.el.addEventListener('xbuttondown', (event) => {
            menuEntity.object3D.visible = !menuEntity.object3D.visible;
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default xbuttonListener;