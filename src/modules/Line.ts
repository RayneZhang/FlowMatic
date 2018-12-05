declare const THREE:any;

class Line {
    LinesEntity: any = document.querySelector("#lines");
    curLineEntity: any = null;

    constructor() {
        this.curLineEntity = document.createElement('a-entity');
        this.LinesEntity.appendChild(this.curLineEntity);
        this.LinesEntity.setAttribute('draw-line', 'currentLine', this.curLineEntity);
    }

    // Destroy current line.
    destroyLine() {
        this.LinesEntity.setAttribute('draw-line', 'currentLine', null);
        this.curLineEntity.parentNode.removeChild(this.curLineEntity);
    }
}

export default Line;