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
        case '#f5d76e': case '#f4d03f':{
            return 'class';
        }
        default: {
            return 'any';
        }
    }
};

export const getColorsByType = (type: string) => {
    let unselectedColor: string = 'white';
    let hoveredColor: string = 'yellow';
    switch (type) {
        case 'boolean': {
            unselectedColor = '#78C13B';
            hoveredColor = '#3A940E';
            break;
        }
        case 'object': {
            unselectedColor = '#FC7391';
            hoveredColor = '#FB3862';
            break;
        }
        case 'vector3': {
            unselectedColor = '#D85C1F';
            hoveredColor = '#D8431F';
            break;
        }
        case 'number': {
            unselectedColor = '#68E4E5';
            hoveredColor = '#68E5D5';
            break;
        }
        case 'class': {
            unselectedColor = '#f5d76e';
            hoveredColor = '#f4d03f';
            break;
        }
        case 'any': {
            break;
        }
    }
    return [unselectedColor, hoveredColor];
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