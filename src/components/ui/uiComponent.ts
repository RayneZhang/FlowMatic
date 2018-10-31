import Menu from "./menu";

const uiComponent = {
    init: function(): void {
        // Create a Menu class for the controller entity.
        const menu: any = new Menu(this.el);
    },

    tick: function(time, timeDelta): void {

    }
}

export default uiComponent;