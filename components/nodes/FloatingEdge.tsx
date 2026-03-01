import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react'

export default function FloatingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#00ff88',
          strokeWidth: 3,
          filter: 'url(#glow)',
          ...style,
        }}
      />
    </>
  )
}