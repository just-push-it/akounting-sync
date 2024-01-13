import { useState } from "react"

export type TooltipProps = {
    content: React.ReactNode
    children: React.ReactNode
    showDelay?: number
    hideDelay?: number
}

export const Tooltip = (props: TooltipProps) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [hovering, setHovering] = useState<boolean>(false)
    const [timeout, setTimeout] = useState<number | null>(null)

    const onMouseEnter = () => {
        setHovering(true)
        setTimeout(window.setTimeout(() => setVisible(true), props.showDelay || 500))
    }

    const onMouseLeave = () => {
        setHovering(false)
        if (timeout) {
            window.clearTimeout(timeout)
        }

        if(props.hideDelay === 0) {
            setVisible(false)
            return;
        }

        setTimeout(window.setTimeout(() => {
            if (!hovering) setVisible(false);
        }, props.hideDelay || 500))
    }

    const onContentMouseEnter = () => {
        if (timeout) {
            window.clearTimeout(timeout)
        }
    }

    return (
        <div className="relative inline-block">
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                {props.children}
            </div>
            {visible && (
                <div 
                    className="absolute z-10 bg-slate-500 text-white p-4 rounded-md shadow-md" 
                    onMouseEnter={onContentMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {props.content}
                </div>
            )}
        </div>
    )
}