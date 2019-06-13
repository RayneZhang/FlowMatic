declare const THREE:any;

const eventReceiver = {
    schema: {
        dataType: {type: 'string', default: 'event'},
        dataValue: {type: 'string', default: ''},
        targetEntities: {type: 'array', default: []},
        sourceEvents: {type: 'array', default: []},
        targetEvents: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("event-receiver");

        this.el.addEventListener('event-triggered', (event) => {
            const eventName: string = event.detail.eventName;
            if (!eventName) return;
            // TODO
        });
    },

    // Even receivers can emit events.
    tick: function(time, timeDelta): void {
        
    },

    update: function (oldData): void {
        
    }
}

export default eventReceiver;