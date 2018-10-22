class Menu {
    
    constructor(ControllerEl: any) {
        const sceneEl = document.querySelector('a-scene');
    
        // Create a menu entity and append it to the controller.
        const menuEntity: any = document.createElement('a-entity');
        ControllerEl.appendChild(menuEntity);

        // Create Menu Img by calling this function.
        this.createMenuImg(menuEntity);

        // Add geometry component to the entity.
        menuEntity.setAttribute('geometry', {
            primitive: 'ring',
            radiusInner: 0.1,
            radiusOuter: 0.2
        }); 

        // Add the material component of the menu entity.
        menuEntity.setAttribute('material', 'color', 'grey'); 

        // Add text component to the entity.
        menuEntity.setAttribute('text', {
            value: 'Menu',
            align: 'center',
            wrapCount: 24
        }); 

        // Set position of the menu
        menuEntity.setAttribute('position', '0 0.13 -0.08');

        // Set id of the menu entity.
        menuEntity.setAttribute('id', 'menu');

        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        ControllerEl.addEventListener('xbuttondown', (event) => {
            menuEntity.object3D.visible = !menuEntity.object3D.visible;

            if (menuEntity.object3D.visible) // Add class for raycaster.
                menuEntity.setAttribute('class', 'clickable');
            else // Remove class for raycaster.
                menuEntity.removeAttribute('class');
        });

        // Event Listener on hovering over the menu.
        menuEntity.addEventListener('raycaster-intersected', (event) => {
            menuEntity.setAttribute('material', 'color', 'yellow'); 
        })

        // Event Listener on Leaving from hovering over the menu.
        menuEntity.addEventListener('raycaster-intersected-cleared', (event) => {
            menuEntity.setAttribute('material', 'color', 'grey'); 
        })
    }

    createMenuImg(menuEntity: any): void {
        // Create image primitive entity in the menu.
        const menuImg: any = document.createElement('a-image');
        menuEntity.appendChild(menuImg);

        menuImg.setAttribute('src', '#uinormal');

        menuImg.setAttribute('height', '0.1');
        menuImg.setAttribute('width', '0.1');

        menuImg.setAttribute('position', '0.2 0 0');
    }
}

export default Menu;