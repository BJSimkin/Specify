'use client'

import { useMemo } from 'react'
import type { RequirementFormData } from '@/types'

interface DepGraphProps {
  requirements: RequirementFormData[]
}

const TAG_NODE_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  data: { fill: '#EFF6FF', stroke: '#3B82F6', label: '#1D4ED8' },
  model: { fill: '#F5F3FF', stroke: '#8B5CF6', label: '#6D28D9' },
  system: { fill: '#ECFDF5', stroke: '#10B981', label: '#065F46' },
  infrastructure: { fill: '#FEF3C7', stroke: '#F59E0B', label: '#92400E' },
}

const DEFAULT_NODE_COLOR = { fill: '#F3F4F6', stroke: '#9CA3AF', label: '#374151' }

const NODE_WIDTH = 160
const NODE_HEIGHT = 48
const COLS = 2
const COL_GAP = 60
const ROW_GAP = 36

interface NodeLayout {
  id: string
  x: number
  y: number
  req: RequirementFormData
}

export function DepGraph({ requirements }: DepGraphProps) {
  const layout = useMemo<NodeLayout[]>(() => {
    return requirements.map((req, i) => {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      return {
        id: req.id,
        x: col * (NODE_WIDTH + COL_GAP),
        y: row * (NODE_HEIGHT + ROW_GAP),
        req,
      }
    })
  }, [requirements])

  const svgWidth = COLS * NODE_WIDTH + (COLS - 1) * COL_GAP + 20
  const rows = Math.ceil(requirements.length / COLS)
  const svgHeight = rows * NODE_HEIGHT + (rows - 1) * ROW_GAP + 20

  // Build an index for quick lookup
  const nodeIndex = useMemo(() => {
    const idx: Record<string, NodeLayout> = {}
    for (const n of layout) idx[n.id] = n
    return idx
  }, [layout])

  // Build edges
  const edges = useMemo(() => {
    const result: Array<{ from: NodeLayout; to: NodeLayout; key: string }> = []
    for (const node of layout) {
      for (const depId of node.req.dependsOn) {
        const dep = nodeIndex[depId]
        if (dep) {
          result.push({ from: dep, to: node, key: `${dep.id}->${node.id}` })
        }
      }
    }
    return result
  }, [layout, nodeIndex])

  function getNodeColor(req: RequirementFormData) {
    const primaryTag = req.tags[0]
    return TAG_NODE_COLORS[primaryTag] ?? DEFAULT_NODE_COLOR
  }

  function bezierPath(from: NodeLayout, to: NodeLayout): string {
    const x1 = from.x + NODE_WIDTH / 2
    const y1 = from.y + NODE_HEIGHT
    const x2 = to.x + NODE_WIDTH / 2
    const y2 = to.y
    const cy = (y1 + y2) / 2
    return `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`
  }

  if (requirements.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg">
        <p className="text-sm text-gray-400">Add requirements to see the dependency graph</p>
      </div>
    )
  }

  return (
    <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {Object.entries(TAG_NODE_COLORS).map(([tag, colors]) => (
          <div key={tag} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded border"
              style={{ backgroundColor: colors.fill, borderColor: colors.stroke }}
            />
            <span className="text-xs text-gray-500 capitalize">{tag}</span>
          </div>
        ))}
      </div>

      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#9CA3AF" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge) => (
          <path
            key={edge.key}
            d={bezierPath(edge.from, edge.to)}
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            markerEnd="url(#arrowhead)"
          />
        ))}

        {/* Nodes */}
        {layout.map((node) => {
          const colors = getNodeColor(node.req)
          const truncatedId = node.req.id
          const truncatedTitle =
            node.req.title.length > 18
              ? node.req.title.slice(0, 18) + '…'
              : node.req.title || 'Untitled'

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="6"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="1.5"
              />
              <text
                x={NODE_WIDTH / 2}
                y={16}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
                fill={colors.label}
              >
                {truncatedId}
              </text>
              <text
                x={NODE_WIDTH / 2}
                y={32}
                textAnchor="middle"
                fontSize="11"
                fill="#374151"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {truncatedTitle}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
