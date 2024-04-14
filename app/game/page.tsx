'use client'
import { useEffect, useRef, useState } from "react";
import { Master, Matrix, SelectedElementStack, Timer, } from "../app";
import { Titan_One } from "next/font/google";
import Header from "./components/Header";
import Target from "./components/Target";


const titan = Titan_One({
    subsets: ["latin"],
    weight: "400"
});
export default function Home() {


    const [matrix, setMatrix] = useState<Matrix | {}>({}); // done
    const [master, setMaster] = useState<Master | {}>({});
    const [clock, setClock] = useState(new Timer(0, 0));
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
                        e.element.style.color = "black";
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

    function reset() {
        let initialRow = 8;
        let initialColumn = 4;
        let mat = new Matrix(initialRow, initialColumn);
        setMatrix(mat);
        setMaster(new Master(initialRow * initialColumn, mat));
        setClock(new Timer(1, 0));
    }
    useEffect(() => {
        let initialRow = 8;
        let initialColumn = 4;
        let mat = new Matrix(initialRow, initialColumn);
        setMatrix(mat);
        setMaster(new Master(initialRow * initialColumn, mat));

    }, []);

    useEffect(() => {
        console.log(clock);
        if (!clock.shouldStop) {
            document.querySelector("dialog") ? document.querySelector("dialog")?.close() : null;
            setTimeout(() => {
                setClock((clock) => {
                    let timer = clock.update();
                    return new Timer(timer.minutes, timer.seconds, timer.shouldStop);
                });
            }, 1000);
        } else {
            console.log("showing modal");
            document.querySelector("dialog")?.showModal();
        }
        // return () => clearTimeout(clockInterval);
    }, [clock]);

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        gameContainer.current?.addEventListener("transitionend", () => gameContainer.current?.classList.remove("animate-wiggle"));
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        }
    }, [selectedElements]);

    return (
        <main className="flex flex-col items-stretch justify-stretch h-full w-full relative">
            <dialog
                onCancel={(e) => e.preventDefault()}
                className="absolute top-0 left-0 h-fit w-fit max-h-screen max-w-[100vw] bg-transparent">
                {clock.shouldStop &&
                    <div className="relative h-screen w-screen flex items-center justify-center bg-[rgba(255,255,255,0.25)]  z-50 " style={{
                        backdropFilter: "blur(8px)"
                    }}>
                        <div
                            className={`${titan.className} flex items-center justify-center flex-col min-h-[300px] min-w-[300px] p-4 bg-orange-400 rounded-md gap-4`}>

                            <h1 className="text-white text-3xl">Times Up!!!</h1>
                            <div className="flex items-center justify-center flex-col text-white">
                                <h3>Your Score</h3>
                                <div className="bg-[rgba(0,0,0,0.25)] w-full p-4 rounded-md text-xl flex items-center justify-center shadow-[5px_5px_0px_#00000014_inset]">
                                    {master instanceof Master && master.score}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="bg-blue-600 rounded-[50px] text-white  p-6 shadow-[0px_0px_0px_8px_rgba(255,255,255,0.25)_inset] bg-[linear-gradient(to_bottom,#0000ff54,#1919ff)] relative before:absolute before:h-[10px] before:w-[20px] before:bg-[rgba(255,255,255,0.85)] before:content-[''] before:top-[10px] before:left-[10px] before:rounded-[50%] before:-rotate-45"
                                onClick={reset}
                            >Play Again</button>
                        </div></div>}
            </dialog>
            <div className="absolute top-0 left-0 h-screen w-screen z-[-10]"
                style={{
                    background: "repeating-linear-gradient(0deg,rgba(255,255,255,0.25) 0px 1px,transparent 1px 20px),repeating-linear-gradient(90deg,rgba(255,255,255,0.25) 0px 1px,transparent 1px 20px)"
                }}
            >
            </div>
            <Header score={master instanceof Master && master.score} clock={clock} />
            <div className="flex items-center justify-center flex-col flex-1 gap-20">
                <Target currentAddition={master instanceof Master && master.currentAddition} currentTarget={master instanceof Master && master.currentTarget} />
                <div className="gap-[0.15rem] flex border-[4px] border-black rounded-lg flex-row h-[315.2px] w-[315.2px] items-end justify-end overflow-hidden" ref={gameContainer}>

                    {
                        matrix instanceof Matrix && matrix.elements.map((column: { id: number, value: number }[], index) => {

                            return <div className="flex flex-col gap-[0.15rem]" key={`${index}`}>

                                {column.map((row, ind) => {

                                    return <div
                                        data-id={`${index}-${ind}-${row.id}`}
                                        key={`${index}-${row.id}=${row.value}`}
                                        className="relative flex items-center justify-center text-3xl h-[75px] w-[75px] hover:bg-orange-400 select-none duration-[500ms] overflow-hidden rounded-md before:content-[''] before:absolute before:top-[5px] before:left-[5px] before:bg-[#ffffff5c] before:h-[10px] before:w-[15px]  before:rounded-full before:-rotate-45"
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
                                            boxShadow: `0px -5px rgba(0,0,0,0.25) inset`
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
