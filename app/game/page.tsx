'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { MatElement, Matrix, SelectedElement, SelectedElementStack, getRandomNumber } from "../app";



export default function Home() {


    const [matrix, setMatrix] = useState<Matrix | {}>({});
    const [currentID, setCurrentID] = useState<number>(32);
    const [totalNumber, setTotalNumber] = useState<number>(20);
    const [currentAddition, setCurrentAddition] = useState<number>(0);
    const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
    const [selectedElements, setSelectedElements] = useState<SelectedElementStack>(new SelectedElementStack([]));


    function onMouseUp() {
        console.log(isPointerDown,"mouseup");
        if (isPointerDown) {
            setIsPointerDown(false);
            deleteSelectedElements();
            setSelectedElements(new SelectedElementStack([]));
        }
    }

    function deleteSelectedElements() {
        let indices: { index: number, ind: number, value: number }[] = [];
        selectedElements.stack.forEach(e => {
            let [index, ind] = e.element.getAttribute("data-id")?.split("-") ?? [];
            matrix instanceof Matrix && indices.push({
                index: Number(index) ?? null,
                ind: Number(ind) ?? null,
                value: matrix.elements[Number(index)][Number(ind)].value
            });
            e.element.style.height = "0";
            e.element.style.background = "black";
        });

        setTimeout(() => {
            //@ts-ignore
            let newMatrix = matrix.updateMatrix(indices, currentID);
            setCurrentID((value) => value + 4);
            console.log(newMatrix);
            setMatrix(newMatrix);
        }, 510);

    }
    useEffect(() => {
        setMatrix(new Matrix(8, 4));
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        }
    }, []);

    return (
        <main className="flex flex-col items-stretch justify-stretch h-full w-full">
            <div className="flex items-center justify-between h-[60px] w-full p-4">
                <span>Time : 33</span>
                <span>Score : 100</span>
                <Link href={"/blog"}>blog</Link>
            </div>
            <div className="flex items-center justify-center flex-col flex-1 gap-20">
                <div className="text-xl">
                    {currentAddition} = 35
                </div>
                <div className="flex border-[4px] border-black rounded-lg flex-row h-[300px] w-[300px] items-end justify-end overflow-hidden">

                    {
                        matrix instanceof Matrix && matrix.elements.map((column: { id: number, value: number }[], index) => {

                            return <div className="flex flex-col" key={`${index}`}>

                                {column.map((row, ind) => {

                                    return <div
                                        data-id={`${index}-${ind}`}
                                        key={`${index}-${row.id}=${row.value}`}
                                        className="flex items-center justify-center text-3xl h-[75px] w-[75px] hover:bg-orange-400 select-none duration-[500ms] overflow-hidden"
                                        onMouseDown={(e) => {
                                            setCurrentAddition(0);
                                            setIsPointerDown(true);
                                            let { stack, value } = selectedElements.addElement(e, true);
                                            setSelectedElements(stack);
                                            setCurrentAddition((add: number) => add + value);

                                        }}
                                        onMouseOver={(e) => {
                                            if (isPointerDown) {
                                                let { stack, value } = selectedElements.addElement(e, true);
                                                setSelectedElements(stack);
                                                setCurrentAddition((add: number) => add + (value));
                                            }
                                        }}
                                        onMouseUp={onMouseUp}
                                    >{matrix.elements[index][ind].value}</div>
                                })}
                            </div>
                        })
                    }
                </div>
            </div>
        </main >
    );
}
