'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import {
  StarIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  GlobeAltIcon,
  FireIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid'

import CubeNode from './nodes/CubeNode'

type CustomNode = Node

// ============================
// FUNÇÃO PARA POSICIONAR EM CÍRCULO
// ============================

function generateRadialPositions(
  centerX: number,
  centerY: number,
  radius: number,
  items: CustomNode[]
) {
  const angleStep = (2 * Math.PI) / items.length

  return items.map((item, index) => {
    const angle = index * angleStep

    return {
      ...item,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    }
  })
}

// ============================
// SKILL TREE
// ============================

export default function SkillTree() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [nodes, setNodes] = useState<CustomNode[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const centerX = 600
  const centerY = 400

  useEffect(() => {
    // ⭐ ESTRELA
    const star: CustomNode = {
      id: 'star',
      type: 'cube',
      position: { x: centerX, y: centerY },
      data: {
        icon: <StarIcon className="w-16 h-16 text-pink-400" />,
        level: 'star',
      },
    }

    // ⬡ MACROS
    const macros = generateRadialPositions(centerX, centerY, 200, [
      {
        id: 'cyber',
        type: 'cube',
        data: { icon: <ShieldCheckIcon className="w-10 h-10 text-purple-400" />, level: 'macro' },
      },
      {
        id: 'programming',
        type: 'cube',
        data: { icon: <CpuChipIcon className="w-10 h-10 text-purple-400" />, level: 'macro' },
      },
      {
        id: 'network',
        type: 'cube',
        data: { icon: <GlobeAltIcon className="w-10 h-10 text-purple-400" />, level: 'macro' },
      },
    ] as CustomNode[])

    // ▢ CATEGORIES
    const categories = generateRadialPositions(centerX, centerY, 350, [
      {
        id: 'redteam',
        type: 'cube',
        data: { icon: <FireIcon className="w-8 h-8 text-yellow-400" />, level: 'category' },
      },
      {
        id: 'backend',
        type: 'cube',
        data: { icon: <CpuChipIcon className="w-8 h-8 text-yellow-400" />, level: 'category' },
      },
      {
        id: 'english',
        type: 'cube',
        data: { icon: <BookOpenIcon className="w-8 h-8 text-yellow-400" />, level: 'category' },
      },
    ] as CustomNode[])

    // ▪ MICROS
    const micros = generateRadialPositions(centerX, centerY, 120, [
      {
        id: 'tcp',
        type: 'cube',
        data: { icon: <BookOpenIcon className="w-5 h-5 text-green-400" />, level: 'micro' },
      },
      {
        id: 'dns',
        type: 'cube',
        data: { icon: <BookOpenIcon className="w-5 h-5 text-green-400" />, level: 'micro' },
      },
      {
        id: 'http',
        type: 'cube',
        data: { icon: <BookOpenIcon className="w-5 h-5 text-green-400" />, level: 'micro' },
      },
    ] as CustomNode[])

    const allNodes = [star, ...macros, ...categories, ...micros]

    // 🔗 EDGES
    const newEdges: Edge[] = [
      ...macros.map((m) => ({
        id: `star-${m.id}`,
        source: 'star',
        target: m.id,
      })),
    ]

    setNodes(allNodes)
    setEdges(newEdges)
  }, [])

  // ============================
  // HOVER HIGHLIGHT
  // ============================

  const highlightedNodes = useMemo(() => {
    if (!hoveredNode) {
      return nodes.map((n) => ({ ...n, selected: true }))
    }

    return nodes.map((node) => ({
      ...node,
      selected: node.id === hoveredNode,
    }))
  }, [hoveredNode, nodes])

  const highlightedEdges = useMemo(() => {
    if (!hoveredNode) return edges

    return edges.map((edge) => {
      const isRelated =
        edge.source === hoveredNode ||
        edge.target === hoveredNode

      return {
        ...edge,
        style: isRelated
          ? { stroke: '#22c55e', strokeWidth: 3 }
          : { opacity: 0.1 },
        animated: isRelated,
      }
    })
  }, [hoveredNode, edges])

  const nodeTypes = useMemo(
    () => ({
      cube: (props: any) => (
        <div
          onMouseEnter={() => setHoveredNode(props.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <CubeNode {...props} />
        </div>
      ),
    }),
    []
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge(params, eds)),
    []
  )

  return (
    <div className="w-screen h-screen bg-black">
      <ReactFlow
        nodes={highlightedNodes}
        edges={highlightedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  )
}