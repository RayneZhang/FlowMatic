export const getTypeByColor = (color: string) => {
    switch (color) {
        case '#78C13B': case '#3A940E': {
            return 'boolean';
        }
        case '#FC7391': case '#FB3862': {
            return 'object';
        }
        case '#D85C1F': case '#D8431F': {
            return 'vector3';
        }
        case '#68E4E5': case '#68E5D5':{
            return 'number';
        }
        default: {
            return 'any';
        }
    }
};

export const getBehaviorByShape = (shape: string) => {
    switch (shape) {
        case 'cone': {
            return 'signal';
        }
        case 'sphere': {
            return 'event';
        }
        default: {
            return 'none';
        }
    }
};