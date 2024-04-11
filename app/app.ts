import { MouseEvent } from "react";

export function getRandomNumber(limit: number, exception?: number): number {
    let num = Math.floor(Math.random() * limit)
    return num == exception ? getRandomNumber(limit, exception) : num;
}


export class SelectedElement {
    readonly key: string;
    readonly element: HTMLDivElement;
    constructor(key: string, element: HTMLDivElement) {
        this.key = key;
        this.element = element;
    }
}

export class SelectedElementStack {

    stack: SelectedElement[];

    constructor(stack: SelectedElement[]) {
        this.stack = stack
    }

    get length() {
        return this.stack.length;
    }
    push(element: SelectedElement) {
        this.stack.push()
    }
    pop() {
        return this.stack.pop();
    }

    addElement(e: MouseEvent, initialEvent?: boolean) {
        let key = e.currentTarget?.getAttribute("data-id");
        if (e.currentTarget instanceof HTMLDivElement) {
            if (this.stack.filter(e => e.key == key).length == 0) {
                let value = e.currentTarget.innerText ?? 0;
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.background = "repeating-linear-gradient(45deg,cyan 0 10px, transparent 10px 20px)";
                e.currentTarget.style.color = "yellow";
                return {
                    value: Number(value),
                    stack: new SelectedElementStack([
                        ...this.stack,
                        new SelectedElement(key ?? "", e.nativeEvent.target as HTMLDivElement)
                    ])
                }
            } else {
                let index = this.stack.findIndex((el) => el.key == key);
                let newStack = this.stack.slice(0, index + 1);
                let remainingStack = this.stack.slice(index + 1, this.stack.length);
                let addition = 0;
                remainingStack.forEach(e => {
                    console.log("setting style", e);
                    e.element.style.background = "";
                    e.element.style.backgroundColor = `hsla(${360 * (Number(e.element.innerText) / 100)},100%,50%)`;
                    e.element.style.color = "black";
                    addition += Number(e.element.innerText)
                });
                // console.log("else executed", newStack,remainingStack,addition,index);
                return {
                    value: -addition,
                    stack: new SelectedElementStack(newStack)
                }
            }
        }

        return {
            value: 0,
            stack: this
        }
    }
}



export class MatElement {
    readonly id: number;
    readonly value: number;

    constructor(id: number, value: number) {
        this.id = id;
        this.value = value;
    }
}

export class Matrix {
    row: number;
    column: number;
    diff: number;
    elements: MatElement[][];

    constructor(r: number, c: number) {
        this.row = r;
        this.column = c;
        this.diff = 1;
        this.elements = [];
        let currentID = 0;
        for (let column = 0; column < c; column++) {
            for (let row = 0; row < r; row++) {
                !this.elements[column] ? this.elements[column] = [] : null;
                this.elements[column][row] = new MatElement(currentID++, getRandomNumber(50));
            }
        }
    }

    updateMatrix(indices: { index: number, ind: number, id: number, value: number }[], currentID: number) {
        this.diff++;
        let newMatrix = new Matrix(this.row, this.column);
        newMatrix.diff = this.diff;
        newMatrix.elements = this.elements;
        indices.forEach(i => {
            newMatrix.elements = newMatrix.elements.map((e, index) => {
                if (index == i.index) {
                    return e.filter(elem => elem.id != i.id)
                }
                return e
            });
            // newMatrix[i.index].splice(i.ind, 1)
        });

        indices.forEach((i, ind) => {
            newMatrix.elements[i.index].unshift({ id: currentID + ind, value: getRandomNumber(this.diff + 10, i.value) });
        });

        return newMatrix;
    }
}

class Dimension {
    row: number;
    column: number;
    constructor(row: number, col: number) {
        this.row = row;
        this.column = col;
    }
}

export class Timer {
    minutes: number;
    seconds: number;
    shouldStop: boolean;
    constructor(minutes: number, seconds: number,shouldStop?:boolean) {
        this.minutes = minutes;
        this.seconds = seconds;
        this.shouldStop = shouldStop ?? false;
    }
    update() {
        if (this.minutes == 0 && this.seconds == 0) {
            this.shouldStop = true;
        }
        else {
            console.log("updating");

            if (this.seconds == 0) {
                this.minutes = this.minutes - 1;
                this.seconds = 59;
            }
            else {
                this.seconds = this.seconds - 1;
            }
        }
        return this;
    }
}

export class Master {
    currentTarget: number = 0;
    currentAddition: number;
    dimension: Dimension;
    currentID: number;
    score: number;

    constructor(currentID: number, matrix: Matrix) {
        this.currentAddition = 0;
        this.dimension = { row: matrix.row, column: matrix.column };
        this.currentID = currentID;
        this.score = 0;
        this.currentTarget = this.updateCurrentTarget(matrix);
    }

    updateCurrentID(val: number) {
        this.currentID += val;
        return this;
    }

    resetCurrentAddition() {
        this.currentAddition = 0;
        return this;
    }
    updateCurrentAddition(val: number) {
        this.currentAddition += val;
        return this;
    }
    get getCurrentTarget() {
        return this.currentTarget;
    }
    updateCurrentTarget(matrix: Matrix) {
        let cellCount = Math.floor(Math.random() * matrix.column);
        cellCount == 0 ? cellCount = 1 : null;
        let addition = 0;
        let currentRow = Math.floor(Math.random() * matrix.column);
        let currentColumn = Math.floor(Math.random() * matrix.column);
        let cells = [];
        // console.clear();
        try {
            for (let start = 0; start < cellCount; start++) {
                cells.push(`${currentRow}-${currentColumn}`);
                let num = matrix.elements[currentColumn][matrix.row - currentRow - 1].value;
                console.log(`row : ${matrix.row - currentRow - 1}, column : ${currentColumn}`, num);
                addition += num;
                console.log(addition, cells);
                [currentRow, currentColumn] = this.getNextCell(currentRow, currentColumn, cells, {
                    row: matrix.row,
                    column: matrix.column
                });
            }
        } catch (e) {
            console.log(e, currentRow, currentColumn);
        }

        return addition;
    }

    getNextCell(row: number, column: number, cells: string[], dimension: Dimension): number[] {
        let newRow = row;
        let newColumn = column;
        let binary = this.getRandomBinary();
        switch (binary) {
            case 0:
                if (row >= 3) {
                    console.log('first 0', row);
                    newRow = row - 1;
                }
                else {
                    console.log('first 1', row);
                    newRow = row + this.getRandomBinary(true);
                    newRow < 0 ? newRow = 1 : null;
                }
                break;
            case 1:
                if (column == 0) {
                    console.log('second 0', column);
                    newColumn = column + 1;
                }
                else if (column == dimension.column - 1) {
                    console.log('second 1', column);
                    newColumn = column - 1;
                }
                else {
                    console.log('second 2', column);
                    newColumn = column + this.getRandomBinary(true);
                }

                break;
        }


        if (cells.includes(`${newRow}-${newColumn}`)) {
            console.log("isEqual", newRow, newColumn, cells);
            return this.getNextCell(row, column, cells, dimension);
        }
        return [
            newRow,
            newColumn
        ]
    }

    getRandomBinary(negative?: boolean) {
        return negative ? Math.floor(Math.random() * 2) * 2 - 1 : Math.floor(Math.random() * 2);
    }

}