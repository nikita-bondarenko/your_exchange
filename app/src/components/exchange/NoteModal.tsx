import clsx from "clsx"
import Button from "../ui/Button"
import Icon from "../helpers/Icon"

type NoteModalProps = {
    mode: "dark" | 'light'
    children: React.ReactNode
    isOpen: boolean,
    handleClose: () => void
}

const NoteModal = ({ mode, children, isOpen, handleClose }: NoteModalProps) => {
    return (
        <div onClick={handleClose} className={clsx("fixed top-0 left-0 w-full h-full bg-[#4e4e4e]/60 flex justify-center items-center transition-all duration-500 z-[200] p-[21px]", {
            "pointer-events-none opacity-0": !isOpen,
            "pointer-events-auto opacity-100": isOpen
        })}>
            <div onClick={(e) => e.stopPropagation()} className={clsx(" relative w-full max-w-[400px] rounded-[16px] p-[28px] pt-[36px] flex flex-col gap-[30px]", mode === "dark" ? "bg-[#303030]" : "bg-white")}>
                <div className={clsx(" text-[16px] ", mode === "dark" ? "text-white" : "text-black")}>{children}</div>
                <Button type='primary' onClick={handleClose}>Понятно!</Button>
                <button className="absolute top-[19px] right-[17px]" onClick={handleClose}> <Icon
                    src="close.svg"
                    className={clsx("w-13 h-13")}
                /></button>
            </div>
        </div>
    )
}


export default NoteModal