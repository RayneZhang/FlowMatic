const intersectedListener = {
    init: function() {
        const el = this.el;
        el.addEventListener('raycaster-intersected', function(event) {
            console.log('Raycasted Object is me: ' + el.id);
        })
    }
}

export default intersectedListener;