import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

interface TableNodeData {
  tableName: string;
  columns: Column[];
}

export const TableNode = memo(({ data }: { data: TableNodeData }) => {
  return (
    <div style={{
      background: '#484848',
      border: '1px solid #333',
      borderRadius: '4px',
      minWidth: '200px',
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '2px 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Table Header */}
      <div style={{
        background: '#af701e',
        color: '#FFFFFF',
        padding: '8px 12px',
        fontWeight: 'bold',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ fontSize: '14px' }}>📊</span>
        <span>{data.tableName}</span>
      </div>

      {/* Columns */}
      <div style={{
        background: '#c6c6c6',
      }}>
        {data.columns.map((column, index) => (
          <div
            key={index}
            style={{
              padding: '6px 12px',
              borderBottom: index < data.columns.length - 1 ? '1px solid #b0b0b0' : 'none',
              borderLeft: column.isPrimaryKey
                ? '3px solid #eab308'
                : column.isForeignKey
                  ? '3px solid #3b82f6'
                  : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
              background: column.isPrimaryKey
                ? 'rgba(234, 179, 8, 0.08)'
                : column.isForeignKey
                  ? 'rgba(59, 130, 246, 0.08)'
                  : undefined,
            }}
          >
            {/* Primary Key Icon */}
            {column.isPrimaryKey && (
              <span style={{ 
                color: '#eab308',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>🔑</span>
            )}
            
            {/* Foreign Key Icon */}
            {column.isForeignKey && !column.isPrimaryKey && (
              <span style={{ 
                color: '#3b82f6',
                fontSize: '12px'
              }}>🔗</span>
            )}

            {/* Column Name */}
            <span style={{
              flex: 1,
              fontWeight: column.isPrimaryKey ? 'bold' : 'normal',
              color: '#1f2937'
            }}>
              {column.name}
            </span>

            {/* Column Type */}
            <span style={{
              color: '#6b7280',
              fontSize: '11px',
              fontStyle: 'italic'
            }}>
              {column.type}
            </span>

            {/* Connection Handle for Foreign Keys */}
            {column.isForeignKey && (
              <Handle
                type="target"
                position={Position.Right}
                id={`${column.name}-target`}
                style={{
                  background: '#3b82f6',
                  width: '8px',
                  height: '8px',
                  right: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            )}
            {column.isPrimaryKey && (
              <Handle
                type="source"
                position={Position.Left}
                id={`${column.name}-source`}
                style={{
                  background: '#eab308',
                  width: '8px',
                  height: '8px',
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Default Handles */}
      {/* <Handle
        type="target"
        position={Position.Left}
        id="target"
        style={{
          background: '#6b7280',
          width: '10px',
          height: '10px',
          left: '-5px'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        style={{
          background: '#6b7280',
          width: '10px',
          height: '10px',
          right: '-5px'
        }}
      /> */}
    </div>
  );
});

TableNode.displayName = 'TableNode';