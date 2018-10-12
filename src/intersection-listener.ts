const intersectionListener = {
    init: function() {
        const el = this.el;
        el.addEventListener('raycaster-intersection', function(event) {
            const els = event.detail.els;
            console.log('Raycast intersection detected: ' + els);
            console.log('The first element in the intersection is : ' + els[0].id);
        })
    }
}

export default intersectionListener;