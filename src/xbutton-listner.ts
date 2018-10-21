import Menu from "./components/ui/menu";

const xbuttonListener = {
    init: function(): void {
        const el = this.el;
        let menu = new Menu(el);
    },

    tick: function(time, timeDelta): void {

    }
}

export default xbuttonListener;