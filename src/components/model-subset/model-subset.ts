const modelSubset = {
    schema: {
        target: {type: 'selector', default: null},
        name: {type: 'string', default: ''}
    },

    init: function() {
        this.data.target.addEventListener('model-loaded', (event) => {
            const model = event.detail.model;
            // Check the model format and whether it is empty.
            if (event.detail.format !== 'obj' || !model.getObjectByName('huecursor')) {return;}
            const subset = model.getObjectByName(this.data.name);
            this.el.setObject3D('mesh', subset.clone());
        })
    }
}

export default modelSubset;