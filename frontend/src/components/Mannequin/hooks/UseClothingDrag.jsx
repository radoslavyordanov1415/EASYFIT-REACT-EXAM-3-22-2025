"use client"

import { useState, useEffect, useRef } from "react"

export const useClothingDrag = (setAppliedClothing) => {
    const [draggingPart, setDraggingPart] = useState(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const containerRef = useRef(null)

    const handleMouseDown = (e, part, x, y) => {
        e.stopPropagation()
        const containerRect = containerRef.current.getBoundingClientRect()
        setDraggingPart(part)
        setDragOffset({
            x: e.clientX - containerRect.left - x,
            y: e.clientY - containerRect.top - y,
        })
    }

    const handleMouseMove = (e) => {
        if (draggingPart) {
            const containerRect = containerRef.current.getBoundingClientRect()
            const newX = e.clientX - containerRect.left - dragOffset.x
            const newY = e.clientY - containerRect.top - dragOffset.y

            setAppliedClothing((prev) => ({
                ...prev,
                [draggingPart]: {
                    ...prev[draggingPart],
                    x: newX,
                    y: newY,
                },
            }))
        }
    }

    const handleMouseUp = () => {
        setDraggingPart(null)
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [draggingPart, dragOffset])

    return {
        containerRef,
        handleMouseDown,
    }
}

