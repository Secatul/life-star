import { Handle, Position } from '@xyflow/react'
import { JSX } from 'react'

interface CubeNodeProps {
  data: {
    icon: JSX.Element
    level: 'star' | 'macro' | 'category' | 'micro'
  }
  onClick?: () => void
}

export default function CubeNode({ data, onClick }: CubeNodeProps) {
  const base =
    "bg-zinc-900 border flex items-center justify-center cursor-pointer transition duration-200 relative"

  const levelStyles =
    data.level === 'star'
      ? "w-32 h-32 border-pink-500 clip-pentagon shadow-[0_0_50px_rgba(236,72,153,0.9)]"
      : data.level === 'macro'
      ? "w-24 h-24 border-purple-500 clip-octagon"
      : data.level === 'category'
      ? "w-20 h-20 border-yellow-500 rounded-xl"
      : "w-12 h-12 border-green-500"

  return (
    <div onClick={onClick} className={`${base} ${levelStyles}`}>
      {data.icon}

      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  )
}