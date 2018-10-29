import Menu from "./menu";

const uiComponent = {

    init: function(): void {
        // Create a Menu class for x-button.
        const menu = new Menu(this.el);
    },

    tick: function(time, timeDelta): void {

    }
}

export default uiComponent;