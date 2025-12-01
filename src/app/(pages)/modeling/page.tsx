'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Plane} from '@react-three/drei';
import { Menu, RotateCcw, Package, Eye, EyeOff, Palette, Home } from 'lucide-react';
import FurnitureModel from '@/app/components/sections/FurnutireModel';

// Types for the application
interface Point {
  x: number;
  y: number;
}

// interface FloorPlanLine {
//   id: string;
//   start: Point;
//   end: Point;
//   length: string;
// }

interface RoomItem {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  color: string;
  textureUrl?: string;
}

interface ItemTemplate {
  id: string;
  name: string;
  type: string;
  dimensions: { width: number; height: number; depth: number };
  color: string;
  textureUrl?: string;
  isDefault: boolean;
}

interface RoomSettings {
  showWalls: {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
  };
  showCeiling: boolean;
  wallColors: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  floorColor: string;
  ceilingColor: string;
  wallTexture: string;
  floorTexture: string;
  ceilingTexture: string;
}

interface FloorPlanPoint {
  x: number;
  y: number;
  id: string;
}

interface CustomFloorPlan {
  points: FloorPlanPoint[];
  connections: { start: string; end: string; id: string }[];
  isCustom: boolean;
}

// Available themes and textures
const THEMES = {
  modern: {
    walls: '#F5F5F5',
    floor: '#E8E8E8',
    ceiling: '#FFFFFF'
  },
  classic: {
    walls: '#F0E6D2',
    floor: '#8B4513',
    ceiling: '#FFF8DC'
  },
  industrial: {
    walls: '#696969',
    floor: '#2F4F4F',
    ceiling: '#708090'
  },
  cozy: {
    walls: '#DEB887',
    floor: '#CD853F',
    ceiling: '#F5DEB3'
  }
};

const TEXTURE_OPTIONS = [
  { id: 'none', name: 'Solid Color', pattern: 'none' },
  { id: 'brick', name: 'Brick Pattern', pattern: 'brick' },
  { id: 'wood', name: 'Wood Grain', pattern: 'wood' },
  { id: 'tile', name: 'Tile Pattern', pattern: 'tile' },
  { id: 'concrete', name: 'Concrete', pattern: 'concrete' }
];

// Default item templates with realistic textures
const DEFAULT_ITEMS: ItemTemplate[] = [
  {
    id: 'chair-1',
    name: 'Office Chair',
    type: 'chair',
    dimensions: { width: 0.6, height: 1.2, depth: 0.6 },
    color: '#8B4513',
    textureUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    isDefault: true
  },
  {
    id: 'table-1',
    name: 'Dining Table',
    type: 'table',
    dimensions: { width: 1.5, height: 0.8, depth: 0.8 },
    color: '#D2691E',
    textureUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop',
    isDefault: true
  },
  {
    id: 'bed-1',
    name: 'Single Bed',
    type: 'bed',
    dimensions: { width: 2.0, height: 0.5, depth: 1.0 },
    color: '#4A4A4A',
    textureUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
    isDefault: true
  },
  {
    id: 'tv-1',
    name: '55" TV',
    type: 'tv',
    dimensions: { width: 1.2, height: 0.7, depth: 0.1 },
    color: '#000000',
    isDefault: true
  },
  {
    id: 'sofa-1',
    name: 'Sofa',
    type: 'sofa',
    dimensions: { width: 2.0, height: 0.8, depth: 0.9 },
    color: '#4169E1',
    textureUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    isDefault: true
  }
];

// Enhanced 3D Room Item Component
const RoomItemComponent: React.FC<{
  item: RoomItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number; z: number }) => void;
  roomBounds: { width: number; depth: number };
}> = ({ item, isSelected, onSelect, onPositionChange, roomBounds }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [_, setDragStart] = useState({ x: 0, y: 0 });
  const { camera, gl, raycaster } = useThree();

  // Create texture if available
  const texture = useMemo(() => {
    if (item.textureUrl) {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(item.textureUrl);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
      return tex;
    }
    return null;
  }, [item.textureUrl]);

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    setIsDragging(true);
    onSelect(item.id);

    const rect = gl.domElement.getBoundingClientRect();
    setDragStart({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handlePointerMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !meshRef.current) return;

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    // Create a ground plane for intersection
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, intersectionPoint);

    if (intersectionPoint) {
      // Apply room boundaries
      const halfWidth = roomBounds.width / 2 - item.dimensions.width / 2;
      const halfDepth = roomBounds.depth / 2 - item.dimensions.depth / 2;

      const boundedX = Math.max(-halfWidth, Math.min(halfWidth, intersectionPoint.x));
      const boundedZ = Math.max(-halfDepth, Math.min(halfDepth, intersectionPoint.z));

      onPositionChange(item.id, {
        x: boundedX,
        y: item.position.y,
        z: boundedZ
      });
    }
  }, [isDragging, camera, gl, raycaster, item, onPositionChange, roomBounds]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('mouseup', handlePointerUp);

      return () => {
        document.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('mouseup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Create realistic furniture shapes
  const renderFurniture = () => {
    switch (item.type) {
      case 'chair':
        return (
          <group>
            {/* Seat */}
            <FurnitureModel
              url="/table.glb"
              scale={1}
              position={[0, 0, 0]}
              isSelected={isSelected}
              isDragging={isDragging}
              color={item.color}
            />
          </group>
        );

      case 'table':
        return (
          <group>
            <FurnitureModel
              url="/table2.glb"
              scale={1}
              position={[0, 0, 0]}
              isSelected={isSelected}
              isDragging={isDragging}
              color={item.color}
            />
          </group>
        );

      case 'sofa':
        return (
          <group>
            <FurnitureModel
              url="/plant.glb"
              scale={1}
              position={[0, 0, 0]}
              isSelected={isSelected}
              isDragging={isDragging}
              color={item.color}
            />
          </group>
        );

      default:
        return (
          <Box args={[item.dimensions.width, item.dimensions.height, item.dimensions.depth]}>
            <meshStandardMaterial
              color={isSelected ? '#FFD700' : item.color}
              map={texture}
              transparent={isDragging}
              opacity={isDragging ? 0.7 : 1}
            />
          </Box>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
      onPointerDown={handlePointerDown}
    >
      {renderFurniture()}
      {isSelected && (
        <Box args={[item.dimensions.width + 0.1, item.dimensions.height + 0.1, item.dimensions.depth + 0.1]}>
          <meshBasicMaterial color="#FFD700" wireframe transparent opacity={0.3} />
        </Box>
      )}
    </group>
  );
};

// Enhanced Room Floor Component
const RoomFloor: React.FC<{
  floorPlan: CustomFloorPlan;
  roomSettings: RoomSettings;
  roomBounds: { width: number; depth: number };
}> = ({ floorPlan, roomSettings, roomBounds }) => {

  // Generate procedural textures
  const createTexture = (pattern: string, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);

    switch (pattern) {
      case 'brick':
        ctx.fillStyle = '#8B4513';
        for (let y = 0; y < 256; y += 32) {
          for (let x = 0; x < 256; x += 64) {
            ctx.fillRect(x + (y % 64 === 0 ? 0 : 32), y, 60, 28);
          }
        }
        break;
      case 'wood':
        ctx.fillStyle = '#654321';
        for (let i = 0; i < 256; i += 8) {
          ctx.fillRect(0, i, 256, 2);
        }
        break;
      case 'tile':
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        for (let i = 0; i <= 256; i += 32) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 256);
          ctx.moveTo(0, i);
          ctx.lineTo(256, i);
          ctx.stroke();
        }
        break;
      case 'concrete':
        // Add some noise
        for (let i = 0; i < 100; i++) {
          ctx.fillStyle = `rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50}, 0.1)`;
          ctx.fillRect(Math.random() * 256, Math.random() * 256, 4, 4);
        }
        break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(roomBounds.width / 2, roomBounds.depth / 2);
    return texture;
  };

  const floorTexture = createTexture(roomSettings.floorTexture, roomSettings.floorColor);
  const wallTexture = createTexture(roomSettings.wallTexture, roomSettings.wallColors.north);
  const ceilingTexture = createTexture(roomSettings.ceilingTexture, roomSettings.ceilingColor);

  return (
    <group>
      {/* Floor */}
      <Plane
        args={[roomBounds.width, roomBounds.depth]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={roomSettings.floorColor}
          map={floorTexture}
        />
      </Plane>

      {/* Ceiling */}
      {roomSettings.showCeiling && (
        <Plane
          args={[roomBounds.width, roomBounds.depth]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 3, 0]}
        >
          <meshStandardMaterial
            color={roomSettings.ceilingColor}
            map={ceilingTexture}
          />
        </Plane>
      )}

      {/* Walls */}
      {roomSettings.showWalls.north && (
        <Box args={[roomBounds.width, 3, 0.1]} position={[0, 1.5, roomBounds.depth / 2]}>
          <meshStandardMaterial
            color={roomSettings.wallColors.north}
            map={wallTexture}
          />
        </Box>
      )}
      {roomSettings.showWalls.south && (
        <Box args={[roomBounds.width, 3, 0.1]} position={[0, 1.5, -roomBounds.depth / 2]}>
          <meshStandardMaterial
            color={roomSettings.wallColors.south}
            map={wallTexture}
          />
        </Box>
      )}
      {roomSettings.showWalls.east && (
        <Box args={[0.1, 3, roomBounds.depth]} position={[roomBounds.width / 2, 1.5, 0]}>
          <meshStandardMaterial
            color={roomSettings.wallColors.east}
            map={wallTexture}
          />
        </Box>
      )}
      {roomSettings.showWalls.west && (
        <Box args={[0.1, 3, roomBounds.depth]} position={[-roomBounds.width / 2, 1.5, 0]}>
          <meshStandardMaterial
            color={roomSettings.wallColors.west}
            map={wallTexture}
          />
        </Box>
      )}
    </group>
  );
};

// Enhanced Floor Plan Canvas Component
const FloorPlanCanvas: React.FC<{
  floorPlan: CustomFloorPlan;
  onFloorPlanChange: (plan: CustomFloorPlan) => void;
  roomBounds: { width: number; depth: number };
}> = ({ floorPlan, onFloorPlanChange, roomBounds }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const scale = 20; // pixels per unit
  const centerX = 200;
  const centerY = 200;

  // Convert world coordinates to canvas coordinates
  const worldToCanvas = (worldX: number, worldZ: number) => ({
    x: centerX + worldX * scale,
    y: centerY + worldZ * scale
  });

  // Convert canvas coordinates to world coordinates
  const canvasToWorld = (canvasX: number, canvasY: number) => ({
    x: (canvasX - centerX) / scale,
    z: (canvasY - centerY) / scale
  });

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const calculateDistance = (p1: FloorPlanPoint, p2: FloorPlanPoint): string => {
    const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const feet = Math.floor(distance);
    const inches = Math.round((distance - feet) * 12);
    return `${feet}' ${inches}"`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const worldPos = canvasToWorld(pos.x, pos.y);

    // Check if clicking on existing point
    const clickedPoint = floorPlan.points.find(point => {
      const canvasPos = worldToCanvas(point.x, point.y);
      const distance = Math.sqrt(Math.pow(pos.x - canvasPos.x, 2) + Math.pow(pos.y - canvasPos.y, 2));
      return distance < 10;
    });

    if (clickedPoint) {
      setSelectedPoint(clickedPoint.id);
      const canvasPos = worldToCanvas(clickedPoint.x, clickedPoint.y);
      setDragOffset({
        x: pos.x - canvasPos.x,
        y: pos.y - canvasPos.y
      });
    } else {
      // Add new point
      const newPoint: FloorPlanPoint = {
        id: Date.now().toString(),
        x: worldPos.x,
        y: worldPos.z
      };

      const updatedPlan = {
        ...floorPlan,
        points: [...floorPlan.points, newPoint],
        isCustom: true
      };

      onFloorPlanChange(updatedPlan);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedPoint) return;

    const pos = getMousePos(e);
    const worldPos = canvasToWorld(pos.x - dragOffset.x, pos.y - dragOffset.y);

    const updatedPoints = floorPlan.points.map(point =>
      point.id === selectedPoint ? { ...point, x: worldPos.x, y: worldPos.z } : point
    );

    onFloorPlanChange({
      ...floorPlan,
      points: updatedPoints
    });
  };

  const handleMouseUp = () => {
    setSelectedPoint(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += scale) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += scale) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw default room outline if not custom
    if (!floorPlan.isCustom) {
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        centerX - (roomBounds.width * scale) / 2,
        centerY - (roomBounds.depth * scale) / 2,
        roomBounds.width * scale,
        roomBounds.depth * scale
      );

      // Add default dimensions
      ctx.fillStyle = '#1F2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${roomBounds.width}'`,
        centerX,
        centerY - (roomBounds.depth * scale) / 2 - 10
      );
      ctx.save();
      ctx.translate(centerX - (roomBounds.width * scale) / 2 - 20, centerY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${roomBounds.depth}'`, 0, 0);
      ctx.restore();
    }

    // Draw custom floor plan points
    floorPlan.points.forEach(point => {
      const canvasPos = worldToCanvas(point.x, point.y);
      ctx.fillStyle = point.id === selectedPoint ? '#EF4444' : '#2563EB';
      ctx.beginPath();
      ctx.arc(canvasPos.x, canvasPos.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw connections
    floorPlan.connections.forEach(connection => {
      const startPoint = floorPlan.points.find(p => p.id === connection.start);
      const endPoint = floorPlan.points.find(p => p.id === connection.end);

      if (startPoint && endPoint) {
        const startCanvas = worldToCanvas(startPoint.x, startPoint.y);
        const endCanvas = worldToCanvas(endPoint.x, endPoint.y);

        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startCanvas.x, startCanvas.y);
        ctx.lineTo(endCanvas.x, endCanvas.y);
        ctx.stroke();

        // Draw length
        const midX = (startCanvas.x + endCanvas.x) / 2;
        const midY = (startCanvas.y + endCanvas.y) / 2;
        ctx.fillStyle = '#1F2937';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(calculateDistance(startPoint, endPoint), midX, midY - 5);
      }
    });
  }, [floorPlan, selectedPoint, roomBounds]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-gray-300 cursor-pointer bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="text-sm text-gray-600">
        <p>• Default room shown with blue outline</p>
        <p>• Click to add points for custom floor plan</p>
        <p>• Drag points to adjust shape</p>
        <p>• Lines show automatic measurements</p>
      </div>
    </div>
  );
};

// Room Settings Panel
const RoomSettingsPanel: React.FC<{
  roomSettings: RoomSettings;
  onSettingsChange: (settings: RoomSettings) => void;
}> = ({ roomSettings, onSettingsChange }) => {
  const applyTheme = (themeName: keyof typeof THEMES) => {
    const theme = THEMES[themeName];
    onSettingsChange({
      ...roomSettings,
      wallColors: {
        north: theme.walls,
        south: theme.walls,
        east: theme.walls,
        west: theme.walls
      },
      floorColor: theme.floor,
      ceilingColor: theme.ceiling
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Wall Visibility</h4>
        <div className="space-y-2">
          {Object.entries(roomSettings.showWalls).map(([wall, visible]) => (
            <div key={wall} className="flex items-center justify-between">
              <span className="text-sm capitalize">{wall} Wall</span>
              <button
                onClick={() => onSettingsChange({
                  ...roomSettings,
                  showWalls: { ...roomSettings.showWalls, [wall]: !visible }
                })}
                className={`p-1 rounded ${visible ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-sm">Ceiling</span>
            <button
              onClick={() => onSettingsChange({
                ...roomSettings,
                showCeiling: !roomSettings.showCeiling
              })}
              className={`p-1 rounded ${roomSettings.showCeiling ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {roomSettings.showCeiling ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Quick Themes</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(THEMES).map(([name, theme]) => (
            <button
              key={name}
              onClick={() => applyTheme(name as keyof typeof THEMES)}
              className="p-2 border rounded-md hover:bg-gray-50 text-sm capitalize"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: theme.walls }}
                />
                {name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Textures</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Floor Texture</label>
            <select
              value={roomSettings.floorTexture}
              onChange={(e) => onSettingsChange({
                ...roomSettings,
                floorTexture: e.target.value
              })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {TEXTURE_OPTIONS.map(option => (
                <option key={option.id} value={option.pattern}>{option.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Wall Texture</label>
            <select
              value={roomSettings.wallTexture}
              onChange={(e) => onSettingsChange({
                ...roomSettings,
                wallTexture: e.target.value
              })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {TEXTURE_OPTIONS.map(option => (
                <option key={option.id} value={option.pattern}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Colors</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-sm mb-1">Floor Color</label>
            <input
              type="color"
              value={roomSettings.floorColor}
              onChange={(e) => onSettingsChange({
                ...roomSettings,
                floorColor: e.target.value
              })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Wall Color</label>
            <input
              type="color"
              value={roomSettings.wallColors.north}
              onChange={(e) => onSettingsChange({
                ...roomSettings,
                wallColors: {
                  north: e.target.value,
                  south: e.target.value,
                  east: e.target.value,
                  west: e.target.value
                }
              })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          {roomSettings.showCeiling && (
            <div>
              <label className="block text-sm mb-1">Ceiling Color</label>
              <input
                type="color"
                value={roomSettings.ceilingColor}
                onChange={(e) => onSettingsChange({
                  ...roomSettings,
                  ceilingColor: e.target.value
                })}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Sidebar Component
const Sidebar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  itemTemplates: ItemTemplate[];
  onAddItem: (template: ItemTemplate) => void;
  floorPlan: CustomFloorPlan;
  onFloorPlanChange: (plan: CustomFloorPlan) => void;
  roomSettings: RoomSettings;
  onRoomSettingsChange: (settings: RoomSettings) => void;
  roomBounds: { width: number; depth: number };
}> = ({
  activeTab,
  onTabChange,
  itemTemplates,
  onAddItem,
  floorPlan,
  onFloorPlanChange,
  roomSettings,
  onRoomSettingsChange,
  roomBounds
}) => {
    const tabs = [
      { id: 'model', label: 'Room Config', icon: Home },
      { id: 'floor', label: 'Floor Plan', icon: Menu },
      { id: 'items', label: 'Items', icon: Package },
      { id: 'settings', label: 'Appearance', icon: Palette }
    ];

    return (
      <div className="w-80 h-full bg-gray-100 border-r border-gray-300 flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-black">
          {activeTab === 'model' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Configuration</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Room Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Living Room</option>
                  <option>Bedroom</option>
                  <option>Office</option>
                  <option>Kitchen</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Room Dimensions</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Width (ft)"
                      defaultValue={roomBounds.width}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <span className="text-xs text-gray-500">Width</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Depth (ft)"
                      defaultValue={roomBounds.depth}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <span className="text-xs text-gray-500">Depth</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Quick Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Default room is {roomBounds.width}' × {roomBounds.depth}'</li>
                  <li>• Use Floor Plan tab for custom shapes</li>
                  <li>• Drag items to arrange furniture</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'floor' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Floor Plan Designer</h3>
              <FloorPlanCanvas
                floorPlan={floorPlan}
                onFloorPlanChange={onFloorPlanChange}
                roomBounds={roomBounds}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onFloorPlanChange({
                    points: [],
                    connections: [],
                    isCustom: false
                  })}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Reset to Default
                </button>
                <button
                  onClick={() => onFloorPlanChange({
                    ...floorPlan,
                    points: [],
                    connections: []
                  })}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Furniture Library</h3>
              <div className="grid grid-cols-1 gap-3">
                {itemTemplates.map(template => (
                  <div
                    key={template.id}
                    className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors group"
                    onClick={() => onAddItem(template)}
                  >
                    <div className="flex items-center gap-3">
                      {template.textureUrl ? (
                        <img
                          src={template.textureUrl}
                          alt={template.name}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.setAttribute('style', 'display: block');
                          }}
                        />
                      ) : null}
                      <div
                        className="w-12 h-12 rounded flex-shrink-0"
                        style={{
                          backgroundColor: template.color,
                          display: template.textureUrl ? 'none' : 'block'
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium group-hover:text-blue-600">{template.name}</h4>
                        <p className="text-xs text-gray-500">
                          {template.dimensions.width}' × {template.dimensions.depth}' × {template.dimensions.height}'
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{template.type}</p>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-500">
                        <Package size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-md">
                <h4 className="font-medium text-amber-800 mb-1">Pro Tip:</h4>
                <p className="text-sm text-amber-700">
                  Click any furniture item to add it to your room. You can drag and position items after adding them.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Appearance</h3>
              <RoomSettingsPanel
                roomSettings={roomSettings}
                onSettingsChange={onRoomSettingsChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

// Main Room Designer Component
const RoomDesigner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('model');
  const [roomBounds] = useState({ width: 10, depth: 10 });
  const [roomItems, setRoomItems] = useState<RoomItem[]>([
    {
      id: '1',
      name: 'Default Chair',
      type: 'chair',
      position: { x: -2, y: 0.6, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 0.6, height: 1.2, depth: 0.6 },
      color: '#8B4513',
      textureUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'Default Table',
      type: 'table',
      position: { x: 1, y: 0.4, z: 1 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 1.5, height: 0.8, depth: 0.8 },
      color: '#D2691E',
      textureUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop'
    }
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemTemplates] = useState<ItemTemplate[]>(DEFAULT_ITEMS);
  const [floorPlan, setFloorPlan] = useState<CustomFloorPlan>({
    points: [],
    connections: [],
    isCustom: false
  });
  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    showWalls: { north: true, south: true, east: true, west: true },
    showCeiling: true,
    wallColors: { north: '#F5F5F5', south: '#F5F5F5', east: '#F5F5F5', west: '#F5F5F5' },
    floorColor: '#E8E8E8',
    ceilingColor: '#FFFFFF',
    wallTexture: 'none',
    floorTexture: 'none',
    ceilingTexture: 'none'
  });

  // Add new item to the room
  const handleAddItem = useCallback((template: ItemTemplate) => {
    const newItem: RoomItem = {
      id: Date.now().toString(),
      name: template.name,
      type: template.type,
      position: { x: 0, y: template.dimensions.height / 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: template.dimensions,
      color: template.color,
      textureUrl: template.textureUrl
    };
    setRoomItems(prev => [...prev, newItem]);
  }, []);

  // Update item position with collision detection
  const handleItemPositionChange = useCallback((id: string, position: { x: number; y: number; z: number }) => {
    setRoomItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;

      // Check for collisions with other items
      const hasCollision = prev.some(other => {
        if (other.id === id) return false;

        const distance = Math.sqrt(
          Math.pow(other.position.x - position.x, 2) +
          Math.pow(other.position.z - position.z, 2)
        );

        const minDistance = (item.dimensions.width + other.dimensions.width) / 2;
        return distance < minDistance;
      });

      if (hasCollision) return prev;

      return prev.map(item =>
        item.id === id ? { ...item, position } : item
      );
    });
  }, []);

  // Delete selected item
  const handleDeleteItem = useCallback(() => {
    if (selectedItemId) {
      setRoomItems(prev => prev.filter(item => item.id !== selectedItemId));
      setSelectedItemId(null);
    }
  }, [selectedItemId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedItemId) {
          handleDeleteItem();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, handleDeleteItem]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        itemTemplates={itemTemplates}
        onAddItem={handleAddItem}
        floorPlan={floorPlan}
        onFloorPlanChange={setFloorPlan}
        roomSettings={roomSettings}
        onRoomSettingsChange={setRoomSettings}
        roomBounds={roomBounds}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <Canvas
          camera={{
            position: [8, 8, 8],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          shadows
        >
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[0, 8, 0]} intensity={0.3} />
          <spotLight
            position={[0, 10, 0]}
            angle={Math.PI / 4}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          {/* Room and Items */}
          <RoomFloor
            floorPlan={floorPlan}
            roomSettings={roomSettings}
            roomBounds={roomBounds}
          />

          {roomItems.map(item => (
            <RoomItemComponent
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={setSelectedItemId}
              onPositionChange={handleItemPositionChange}
              roomBounds={roomBounds}
            />
          ))}

          {/* Camera Controls - Restricted for better dragging */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            minDistance={6}
            maxDistance={25}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Canvas>

        {/* Enhanced Toolbar */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedItemId(null)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              title="Deselect All"
            >
              <RotateCcw size={16} />
            </button>
            {selectedItemId && (
              <button
                onClick={handleDeleteItem}
                className="px-3 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors"
                title="Delete Selected Item (Del/Backspace)"
              >
                ✕
              </button>
            )}
          </div>

          {selectedItemId && (
            <div className="bg-white p-2 rounded-md shadow-lg text-sm max-w-xs">
              <div className="font-medium">
                {roomItems.find(item => item.id === selectedItemId)?.name}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Click and drag to move • Del to delete
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-medium mb-2">🏠 Room Designer Controls:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Click</strong> items to select</li>
            <li>• <strong>Drag</strong> to move furniture</li>
            <li>• <strong>Mouse wheel</strong> to zoom</li>
            <li>• <strong>Right-click + drag</strong> to rotate view</li>
            <li>• <strong>Delete/Backspace</strong> to remove items</li>
            <li>• Items snap to room boundaries</li>
          </ul>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Room: {roomBounds.width}' × {roomBounds.depth}' • Items: {roomItems.length}
            </div>
          </div>
        </div>

        {/* Room Stats */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <div className="text-sm font-medium">Room Overview</div>
          <div className="text-xs text-gray-600 mt-1">
            <div>Size: {roomBounds.width}' × {roomBounds.depth}'</div>
            <div>Items: {roomItems.length}</div>
            <div>Mode: {floorPlan.isCustom ? 'Custom Floor Plan' : 'Standard Room'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDesigner;