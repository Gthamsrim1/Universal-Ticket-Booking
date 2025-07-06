'use client'
import React, { useEffect, useRef } from 'react'

const GRID_SIZE = 90

const InteractiveGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cells = Array.from(container.querySelectorAll<HTMLDivElement>('.cell'))

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      cells.forEach(cell => {
        const cx = parseFloat(cell.dataset.x!)
        const cy = parseFloat(cell.dataset.y!)

        const dx = cx - mouseX
        const dy = cy - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        const intensity = Math.max(0, 1 - dist / 450)

        const alpha = intensity * 0.8
        cell.style.borderColor = `rgba(0, 255, 0, ${alpha})`
        cell.style.boxShadow =
          alpha > 0.1 ? `0 0 6px rgba(0, 255, 0, ${alpha})` : 'none'
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const rows = Math.ceil(typeof window !== 'undefined' ? window.innerHeight / GRID_SIZE : 30)
  const cols = Math.ceil(typeof window !== 'undefined' ? window.innerWidth / GRID_SIZE : 30)

  const grid = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push(
        <div
          key={`${x}-${y}`}
          className={`cell w-[${GRID_SIZE}px] h-[${GRID_SIZE}px] border border-transparent transition-all duration-75`}
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        />
      )
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[0] rotate-[-6deg] translate-x-[-33px] translate-y-[-10px] bg-black grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${GRID_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${GRID_SIZE}px)`,
      }}
    >
      {grid}
    </div>
  )
}

export default InteractiveGrid
