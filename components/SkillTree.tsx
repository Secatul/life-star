'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
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
import FloatingEdge from './nodes/FloatingEdge' // 👈 IMPORTANTE

type LevelType = 'star' | 'macro' | 'category' | 'micro'

interface NodeData {
  icon: JSX.Element
  level: LevelType
  requirements?: string[]
  connectTo?: string[]
}

type FlowNode = Node<NodeData>
type BaseNode = Omit<FlowNode, 'position'>

// ============================
// Layout radial
// ============================

function generateRadialPositions(
  centerX: number,
  centerY: number,
  radius: number,
  items: BaseNode[]
): FlowNode[] {
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


function generateEdgesFromNodes(nodes: FlowNode[]): Edge[] {
  const edges: Edge[] = []

  nodes.forEach((node) => {
    const targets = node.data.connectTo || []

    targets.forEach((targetId) => {
      edges.push({
        id: `${targetId}-${node.id}`,
        source: targetId,
        target: node.id,
        type: 'floating',
      })
    })
  })

  return edges
}

export default function SkillTree() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [nodes, setNodes] = useState<FlowNode[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const centerX = 600
  const centerY = 400

  useEffect(() => {
    const star: FlowNode = {
      id: 'star',
      type: 'cube',
      position: { x: centerX, y: centerY },
      data: {
        icon: <StarIcon className="w-16 h-16 text-pink-400" />,
        level: 'star',
      },
    }

    const macros = generateRadialPositions(centerX, centerY, 200, [
      {
        id: 'cyber',
        type: 'cube',
        data: {
          icon: <ShieldCheckIcon className="w-10 h-10 text-purple-400" />,
          level: 'macro',
          connectTo: ['star'],
        },
      },
      {
        id: 'programming',
        type: 'cube',
        data: {
          icon: <CpuChipIcon className="w-10 h-10 text-purple-400" />,
          level: 'macro',
          connectTo: ['star'],
        },
      },
      {
        id: 'network',
        type: 'cube',
        data: {
          icon: <GlobeAltIcon className="w-10 h-10 text-purple-400" />,
          level: 'macro',
          connectTo: ['star'],
        },
      },
    ])

    const categories = generateRadialPositions(centerX, centerY, 350, [
      {
        id: 'redteam',
        type: 'cube',
        data: {
          icon: <FireIcon className="w-8 h-8 text-yellow-400" />,
          level: 'category',
          connectTo: ['cyber'],
        },
      },
      {
        id: 'backend',
        type: 'cube',
        data: {
          icon: <CpuChipIcon className="w-8 h-8 text-yellow-400" />,
          level: 'category',
          connectTo: ['programming'],
        },
      },
      {
        id: 'english',
        type: 'cube',
        data: {
          icon: <BookOpenIcon className="w-8 h-8 text-yellow-400" />,
          level: 'category',
          connectTo: ['network'],
        },
      },
    ])

    const micros = generateRadialPositions(centerX, centerY, 120, [
      {
        id: 'tcp',
        type: 'cube',
        data: {
          icon: <BookOpenIcon className="w-5 h-5 text-green-400" />,
          level: 'micro',
          connectTo: ['cyber'],
        },
      },
      {
        id: 'dns',
        type: 'cube',
        data: {
          icon: <BookOpenIcon className="w-5 h-5 text-green-400" />,
          level: 'micro',
          connectTo: ['cyber'],
        },
      },
    ])

    const allNodes = [star, ...macros, ...categories, ...micros]

    setNodes(allNodes)
    setEdges(generateEdgesFromNodes(allNodes))
  }, [])

  const highlightedEdges = useMemo(() => {
    return edges.map((edge) => {
      const isRelated =
        hoveredNode &&
        (edge.source === hoveredNode || edge.target === hoveredNode)

      return {
        ...edge,
        style: isRelated
          ? {
              stroke: '#facc15',
              strokeWidth: 4,
            }
          : {
              stroke: '#00ff88',
              strokeWidth: 3,
            },
        animated: !!isRelated,
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
          <CubeNode
            {...props}
            onClick={() => setSelectedNode(props)}
          />
        </div>
      ),
    }),
    []
  )

  const edgeTypes = useMemo(
    () => ({
      floating: FloatingEdge, // 👈 REGISTRA AQUI
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

  return (
    <div className="w-screen h-screen bg-black relative">
      <ReactFlow
        nodes={nodes}
        edges={highlightedEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={false}
        fitView
      />
    </div>
  )
}