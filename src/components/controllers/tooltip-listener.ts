const tooltipListener = {
    init: function(): void {
        const leftTooltips: any = document.querySelector("#leftTooltips");
        const rightTooltips: any = document.querySelector("#rightTooltips");
        this.el.addEventListener('surfacetouchstart', (event) => {
            leftTooltips.setAttribute('visible', true);
            rightTooltips.setAttribute('visible', true);
        });

        this.el.addEventListener('surfacetouchend', (event) => {
            leftTooltips.setAttribute('visible', false);
            rightTooltips.setAttribute('visible', false);
        });        
    },

    tick: function(time, timeDelta): void {

    }
}

export default tooltipListener;