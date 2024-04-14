'use client'

import StarIcon from "@/assets/star.png";
import ClockIcon from "@/assets/clock.png";
import Image from "next/image";
import { Timer } from "@/app/app";


export default function Header({ score, clock }: { score: number | boolean, clock: Timer }) {
    return <header className="absolute top-0 right-0 flex flex-col items-end justify-center gap-4 h-fit w-fit p-4">

        <span className="flex h-[50px] w-fit">
            <Image alt="star" src={StarIcon} height="45" width="45" className="p-2 z-10 bg-[#272a57]  bg-yellow rounded-md border-orange-400 border-2" />
            <p className="flex items-center justify-center p-2 rounded-md bg-orange-400 w-[50px] -translate-x-3 text-2xl relative before:content-[''] before:absolute before:top-[5px] before:right-[5px] before:bg-[#ffffff5c] before:h-[10px] before:w-[15px]  before:rounded-full before:rotate-45" style={{
                boxShadow: `rgba(0, 0, 0, 0.25) 0px -5px inset`
            }}>{score}</p>
        </span>
        <span className="flex h-[50px] w-fit">
            <Image alt="clock" src={ClockIcon} height="45" width="45" className="aspect-square p-2 z-10 bg-[#272a57]  bg-yellow rounded-md border-orange-400 border-2" />
            <p className="flex items-center justify-center px-4 py-2 rounded-md bg-orange-400 w-fit -translate-x-3 text-2xl relative before:content-[''] before:absolute before:top-[5px] before:right-[5px] before:bg-[#ffffff5c] before:h-[10px] before:w-[15px]  before:rounded-full before:rotate-45" style={{
                boxShadow: `rgba(0, 0, 0, 0.25) 0px -5px inset`
            }}>{clock.minutes}:{clock.seconds}</p>
        </span>
    </header>
}