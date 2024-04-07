'use client'
import { useEffect, useRef, useState } from "react";
import { Master, Matrix, SelectedElementStack, } from "../app";

export default function Home() {


    const [matrix, setMatrix] = useState<Matrix | {}>({}); // done
    const [master, setMaster] = useState<Master | {}>({});
    // const [currentID, setCurrentID] = useState<number>(32);
    // const [totalNumber, setTotalNumber] = useState<number>(20);
    // const [currentAddition, setCurrentAddition] = useState<number>(0);
    const [isPointerDown, setIsPointerDown] = useState<boolean>(false); // done
    const [selectedElements, setSelectedElements] = useState<SelectedElementStack>(new SelectedElementStack([])); // done
    const gameContainer = useRef<HTMLDivElement>(null);

    function onMouseUp() {
        console.log(isPointerDown, "mouseup");
        if (master instanceof Master) {

            if (isPointerDown) {
                if (master.currentAddition == master.getCurrentTarget) {
                    setIsPointerDown(false);
                    deleteSelectedElements();
                    setSelectedElements(new SelectedElementStack([]));
                    console.log("if executed", master.currentAddition == master.getCurrentTarget)
                } else {
                    setIsPointerDown(false);
                    selectedElements.stack.forEach(e => {
                        e.element.style.background = "";
                        e.element.style.backgroundColor = `hsla(${360 * (Number(e.element.innerText) / 100)},100%,50%)`;
                        e.element.style.color="black";
                    });
                    console.log("else executed", master.currentAddition == master.getCurrentTarget)
                    setSelectedElements(new SelectedElementStack([]));
                    gameContainer.current && gameContainer.current.classList.add("animate-wiggle");
                }
            }
        }
    }

    function deleteSelectedElements() {
        let indices: { index: number, ind: number, id: number, value: number }[] = [];
        selectedElements.stack.forEach(e => {
            let [index, ind, id] = e.element.getAttribute("data-id")?.split("-") ?? [];
            matrix instanceof Matrix && indices.push({
                index: Number(index) ?? null,
                ind: Number(ind) ?? null,
                id: Number(id),
                value: matrix.elements[Number(index)][Number(ind)].value
            });
            e.element.style.height = "0";
            e.element.style.backgroundColor = "black";
        });

        setTimeout(() => {

            //@ts-ignore
            let newMatrix = matrix.updateMatrix(indices, master.currentID);
            setMaster((master: Master) => {
                master.currentTarget = master.updateCurrentTarget(newMatrix as Matrix);
                master.currentAddition = 0;
                master.score++;
                return master;
            });
            master instanceof Master && setMaster((master: Master) => master.updateCurrentID(4));
            // setCurrentID((value) => value + 4);
            console.log(newMatrix);
            setMatrix(newMatrix);
        }, 510);

    }
    useEffect(() => {
        let initialRow = 8;
        let initialColumn = 4;
        let mat = new Matrix(initialRow, initialColumn);
        setMatrix(mat);
        setMaster(new Master(initialRow * initialColumn, mat));

    }, []);

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        gameContainer.current?.addEventListener("transitionend", () => gameContainer.current?.classList.remove("animate-wiggle"));
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        }
    }, [selectedElements]);

    return (
        <main className="flex flex-col items-stretch justify-stretch h-full w-full relative">
            <div className="absolute top-0 left-0">
                <div 
                className={`h-10 w-10 bg-red-600 `}
                style={{
                    transform:`translateX(${Math.round(Math.random() * 100)}vw) translateY(${Math.round(Math.random() * 100)}vh)`
                }}
                ></div>
            </div>
            <div className="flex items-center justify-between h-[60px] w-full p-4">
                <span>Time : 33</span>
                <span>Score : {master instanceof Master && master.score}</span>
            </div>
            <div className="flex items-center justify-center flex-col flex-1 gap-20">
                <div className="text-xl">
                    {master instanceof Master && master.currentAddition} = {master instanceof Master && master.getCurrentTarget}
                </div>
                <div className="gap-[0.15rem] flex border-[4px] border-black rounded-lg flex-row h-[315.2px] w-[315.2px] items-end justify-end overflow-hidden" ref={gameContainer}>

                    {
                        matrix instanceof Matrix && matrix.elements.map((column: { id: number, value: number }[], index) => {

                            return <div className="flex flex-col gap-[0.15rem]" key={`${index}`}>

                                {column.map((row, ind) => {

                                    return <div
                                        data-id={`${index}-${ind}-${row.id}`}
                                        key={`${index}-${row.id}=${row.value}`}
                                        className="flex items-center justify-center text-3xl h-[75px] w-[75px] hover:bg-orange-400 select-none duration-[500ms] overflow-hidden rounded-md"
                                        onMouseDown={(e) => {
                                            master instanceof Master && setMaster((master: Master) => master.resetCurrentAddition());
                                            // setCurrentAddition(0);
                                            setIsPointerDown(true);
                                            let { stack, value } = selectedElements.addElement(e, true);
                                            setSelectedElements(stack);
                                            // setCurrentAddition((add: number) => add + value);
                                            master instanceof Master && setMaster((master: Master) => master.updateCurrentAddition(value));
                                        }}
                                        onMouseOver={(e) => {
                                            if (isPointerDown) {
                                                let { stack, value } = selectedElements.addElement(e, true);
                                                setSelectedElements(stack);
                                                // setCurrentAddition((add: number) => add + (value));
                                                master instanceof Master && setMaster((master: Master) => master.updateCurrentAddition(value));
                                            }
                                        }}
                                        onMouseUp={onMouseUp}
                                        style={{
                                            backgroundColor: `hsla(${360 * (matrix.elements[index][ind].value / 100)},100%,50%)`,
                                            boxShadow:`0px -5px rgba(0,0,0,0.25) inset`
                                        }}
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
