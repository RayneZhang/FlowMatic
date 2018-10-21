const xbuttonListener = {
    init: function(): void {

        const el = this.el;
        const sceneEl = document.querySelector('a-scene');
    
        // Create a menu entity and append it to the controller.
        const menuEntity: any = document.createElement('a-entity');
        el.appendChild(menuEntity);

        // Create Menu Img by calling this function.
        this.createMenuImg(menuEntity);

        // Add geometry component to the entity.
        menuEntity.setAttribute('geometry', {
            primitive: 'plane',
            width: 0.1,
            height: 0.1
        }); 

        // Add the material component of the menu entity.
        menuEntity.setAttribute('material', 'color', 'grey'); 

        // Add text component to the entity.
        menuEntity.setAttribute('text', {
            value: 'menu',
            align: 'center',
            wrapCount: 6
        }); 

        // Set position of the menu
        menuEntity.setAttribute('position', '0 0.13 -0.08');

        // Add class for interaction.
        menuEntity.setAttribute('class', 'clickable');

        // Set id of the menu entity.
        menuEntity.setAttribute('id', 'menu');

        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        this.el.addEventListener('xbuttondown', (event) => {
            menuEntity.object3D.visible = !menuEntity.object3D.visible;
        });

        // Event Listener on hovering over the menu.
        menuEntity.addEventListener('raycaster-intersected', (event) => {
            menuEntity.setAttribute('material', 'color', 'yellow'); 
        })

        // Event Listener on Leaving from hovering over the menu.
        menuEntity.addEventListener('raycaster-intersected-cleared', (event) => {
            menuEntity.setAttribute('material', 'color', 'grey'); 
        })
    },

    tick: function(time, timeDelta): void {

    },

    createMenuImg: function(menuEntity): void {
        // Create elements in the menu.
        const menuImg: any = document.createElement('a-image');
        menuEntity.appendChild(menuImg);

        menuImg.setAttribute('src', '#uinormal');
    }
}

export default xbuttonListener;