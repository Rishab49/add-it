export default function Target({ currentAddition, currentTarget }: {
    currentAddition: number | boolean,
    currentTarget: number | boolean
}) {
    return <div className="flex">
        <p className="flex items-center justify-center px-4 py-2 rounded-md bg-orange-400 w-fit translate-x-3 text-2xl relative before:content-[''] before:absolute before:top-[5px] before:right-[5px] before:bg-[#ffffff5c] before:h-[10px] before:w-[15px]  before:rounded-full before:rotate-45" style={{
            boxShadow: `rgba(0, 0, 0, 0.25) 0px -5px inset`
        }}>{currentAddition}</p>
        <div className="p-2 z-10 bg-[#272a57]  bg-yellow rounded-md border-orange-400 border-2 text-white" > = </div>
        <p className="flex items-center justify-center px-4 py-2 rounded-md bg-orange-400 w-fit -translate-x-3 text-2xl relative before:content-[''] before:absolute before:top-[5px] before:right-[5px] before:bg-[#ffffff5c] before:h-[10px] before:w-[15px]  before:rounded-full before:rotate-45" style={{
            boxShadow: `rgba(0, 0, 0, 0.25) 0px -5px inset`
        }}>{currentTarget}</p>

    </div>
}