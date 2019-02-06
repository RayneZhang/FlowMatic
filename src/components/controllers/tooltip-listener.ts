const tooltipListener = {
    init: function(): void {
        this.visible = true;
        const leftTooltips: any = document.querySelector("#leftTooltips");
        const rightTooltips: any = document.querySelector("#rightTooltips");
        this.el.addEventListener('bbuttondown', (event) => {
            leftTooltips.setAttribute('visible', !this.visible);
            rightTooltips.setAttribute('visible', !this.visible);
            this.visible = !this.visible;
        });

        // this.el.addEventListener('surfacetouchend', (event) => {
        //     leftTooltips.setAttribute('visible', false);
        //     rightTooltips.setAttribute('visible', false);
        // });        
    },

    tick: function(time, timeDelta): void {

    }
}

export default tooltipListener;