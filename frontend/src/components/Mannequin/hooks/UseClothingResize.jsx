"use client"

import { useState, useEffect } from "react"

export const useClothingResize = (setAppliedClothing) => {
    const [resizeStart, setResizeStart] = useState({
        part: null,
        startX: 0,
        startY: 0,
        initialWidth: 0,
        initialHeight: 0,
    })

    const handleResizeMouseDown = (e, part, width, height) => {
        e.stopPropagation()
        setResizeStart({
            part,
            startX: e.clientX,
            startY: e.clientY,
            initialWidth: width,
            initialHeight: height,
        })
    }

    const handleMouseMove = (e) => {
        if (resizeStart.part) {
            const deltaX = e.clientX - resizeStart.startX
            const deltaY = e.clientY - resizeStart.startY
            const aspectRatio = resizeStart.initialWidth / resizeStart.initialHeight

            let newWidth = resizeStart.initialWidth + deltaX
            let newHeight = resizeStart.initialHeight + deltaY

            if (newWidth / newHeight > aspectRatio) {
                newWidth = newHeight * aspectRatio
            } else {
                newHeight = newWidth / aspectRatio
            }

            setAppliedClothing((prev) => ({
                ...prev,
                [resizeStart.part]: {
                    ...prev[resizeStart.part],
                    width: newWidth,
                    height: newHeight,
                },
            }))
        }
    }

    const handleMouseUp = () => {
        setResizeStart({ part: null, startX: 0, startY: 0, initialWidth: 0, initialHeight: 0 })
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [resizeStart])

    return {
        handleResizeMouseDown,
    }
}

