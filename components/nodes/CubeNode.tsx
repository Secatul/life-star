import { Handle, Position } from '@xyflow/react'
import { ReactNode } from 'react'

interface CubeNodeProps {
  data: {
    icon: ReactNode
    level: 'star' | 'macro' | 'category' | 'micro'
  }
  selected?: boolean
}

export default function CubeNode({ data, selected }: CubeNodeProps) {
  const base =
    "bg-zinc-900 border flex items-center justify-center cursor-pointer transition duration-200"

  const levelStyles =
    data.level === 'star'
      ? "w-32 h-32 border-pink-500 clip-pentagon shadow-[0_0_50px_rgba(236,72,153,0.9)]"
      : data.level === 'macro'
      ? "w-24 h-24 border-purple-500 clip-octagon"
      : data.level === 'category'
      ? "w-20 h-20 border-yellow-500 rounded-xl"
      : "w-12 h-12 border-green-500"

  const selectedStyle = selected
    ? "opacity-100 scale-105"
    : "opacity-20"

  return (
    <div className={`${base} ${levelStyles} ${selectedStyle}`}>
      {data.icon}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}