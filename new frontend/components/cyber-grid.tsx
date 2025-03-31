"use client"

import { useEffect, useRef } from "react"

export default function CyberGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Grid properties
    const gridSize = 40
    const dotSize = 1
    const lineWidth = 0.3

    // Animation properties
    let time = 0
    const waveSpeed = 0.002
    const waveHeight = 5

    // Draw the grid
    const drawGrid = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.strokeStyle = "rgba(6, 182, 212, 0.15)"
        ctx.lineWidth = lineWidth

        for (let x = 0; x < canvas.width; x += 2) {
          const waveY = Math.sin(x * 0.01 + time) * waveHeight

          if (x === 0) {
            ctx.moveTo(x, y + waveY)
          } else {
            ctx.lineTo(x, y + waveY)
          }
        }

        ctx.stroke()
      }

      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.strokeStyle = "rgba(6, 182, 212, 0.15)"
        ctx.lineWidth = lineWidth

        for (let y = 0; y < canvas.height; y += 2) {
          const waveX = Math.sin(y * 0.01 + time) * waveHeight

          if (y === 0) {
            ctx.moveTo(x + waveX, y)
          } else {
            ctx.lineTo(x + waveX, y)
          }
        }

        ctx.stroke()
      }

      // Draw dots at intersections
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const waveX = Math.sin(y * 0.01 + time) * waveHeight
          const waveY = Math.sin(x * 0.01 + time) * waveHeight

          const distanceToCenter = Math.sqrt(
            Math.pow((x - canvas.width / 2) / canvas.width, 2) + Math.pow((y - canvas.height / 2) / canvas.height, 2),
          )

          const dotOpacity = 0.3 - distanceToCenter * 0.3

          ctx.beginPath()
          ctx.fillStyle = `rgba(6, 182, 212, ${Math.max(0.05, dotOpacity)})`
          ctx.arc(x + waveX, y + waveY, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Update time for animation
      time += waveSpeed

      // Continue animation loop
      animationFrameId = requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" />
}

