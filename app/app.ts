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
                e.currentTarget.style.backgroundColor = "cyan";
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
                    console.log("setting style",e);
                    e.element.style.backgroundColor = "";
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

    updateMatrix(indices: { index: number, ind: number, value: number }[], currentID: number) {
        this.diff++;
        let newMatrix = new Matrix(this.row, this.column);
        newMatrix.diff = this.diff;
        newMatrix.elements = this.elements;
        indices.forEach(i => {
            newMatrix.elements = newMatrix.elements.map((e, index) => {
                if (index == i.index) {
                    return e.filter(elem => elem.id != i.ind)
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