'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';
import { RotateCcw, Package, Eye, EyeOff, Palette, Home, RotateCw } from 'lucide-react';
import FurnitureModel from '@/app/components/sections/FurnutireModel';

// Types for the application
interface Point {
  x: number;
  y: number;
}

interface RoomItem {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  color: string;
  textureUrl?: string;
  isWallMounted?: boolean;
  wallSide?: 'north' | 'south' | 'east' | 'west';
}

interface ItemTemplate {
  id: string;
  name: string;
  type: string;
  dimensions: { width: number; height: number; depth: number };
  color: string;
  textureUrl?: string;
  isDefault: boolean;
  isWallMounted?: boolean;
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
    isDefault: true,
    isWallMounted: true
  },
  {
    id: 'sofa-1',
    name: 'Sofa',
    type: 'sofa',
    dimensions: { width: 2.0, height: 0.8, depth: 0.9 },
    color: '#4169E1',
    textureUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    isDefault: true
  },
  {
    id: 'shelf-1',
    name: 'Wall Shelf',
    type: 'shelf',
    dimensions: { width: 1.0, height: 0.2, depth: 0.3 },
    color: '#A0522D',
    isDefault: true,
    isWallMounted: true
  }
];

// Enhanced 3D Room Item Component
const RoomItemComponent: React.FC<{
  item: RoomItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number; z: number }) => void;
  onRotationChange: (id: string, rotation: { x: number; y: number; z: number }) => void;
  onWallSideChange: (id: string, wallSide: 'north' | 'south' | 'east' | 'west') => void;
  roomBounds: { width: number; depth: number };
  roomSettings: RoomSettings;
}> = ({ item, isSelected, onSelect, onPositionChange, onRotationChange, onWallSideChange, roomBounds, roomSettings }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl, raycaster } = useThree();
  const [wallCollision, setWallCollision] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [isMovingVertically, setIsMovingVertically] = useState(false);

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
    
    if (item.isWallMounted) {
      // Check if we're starting a vertical drag (right-click or shift+click)
      if (event.button === 2 || event.shiftKey) {
        setIsMovingVertically(true);
        setDragStartY(event.clientY);
      } else {
        setIsMovingVertically(false);
      }
    } else {
      setIsMovingVertically(false);
    }
  };

  const handlePointerMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !meshRef.current) return;

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    if (item.isWallMounted && item.wallSide) {
      // For wall-mounted items
      let newPosition = { ...item.position };
      let collisionWall = null;

      if (isMovingVertically && dragStartY !== null) {
        // Vertical movement - adjust Y position based on mouse movement
        const deltaY = (event.clientY - dragStartY) * -0.01; // Invert for intuitive movement
        const minY = item.dimensions.height / 2;
        const maxY = 3 - item.dimensions.height / 2;
        newPosition.y = Math.max(minY, Math.min(maxY, item.position.y + deltaY));
      } else {
        // Horizontal movement along the wall
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, intersectionPoint);

        if (intersectionPoint) {
          const halfWidth = roomBounds.width / 2 - item.dimensions.width / 2;
          const halfDepth = roomBounds.depth / 2 - item.dimensions.depth / 2;

          switch (item.wallSide) {
            case 'north':
              newPosition.z = roomBounds.depth / 2 - 0.05;
              newPosition.x = Math.max(-halfWidth + item.dimensions.width/2, Math.min(halfWidth - item.dimensions.width/2, intersectionPoint.x));
              if (Math.abs(intersectionPoint.x) > halfWidth) collisionWall = 'east/west';
              break;
            case 'south':
              newPosition.z = -roomBounds.depth / 2 + 0.05;
              newPosition.x = Math.max(-halfWidth + item.dimensions.width/2, Math.min(halfWidth - item.dimensions.width/2, intersectionPoint.x));
              if (Math.abs(intersectionPoint.x) > halfWidth) collisionWall = 'east/west';
              break;
            case 'east':
              newPosition.x = roomBounds.width / 2 - 0.05;
              newPosition.z = Math.max(-halfDepth + item.dimensions.depth/2, Math.min(halfDepth - item.dimensions.depth/2, intersectionPoint.z));
              if (Math.abs(intersectionPoint.z) > halfDepth) collisionWall = 'north/south';
              break;
            case 'west':
              newPosition.x = -roomBounds.width / 2 + 0.05;
              newPosition.z = Math.max(-halfDepth + item.dimensions.depth/2, Math.min(halfDepth - item.dimensions.depth/2, intersectionPoint.z));
              if (Math.abs(intersectionPoint.z) > halfDepth) collisionWall = 'north/south';
              break;
          }
        }
      }

      setWallCollision(collisionWall);
      onPositionChange(item.id, newPosition);
    } else {
      // Regular items - ensure they sit on the floor
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersectionPoint);

      if (intersectionPoint) {
        const halfWidth = roomBounds.width / 2 - item.dimensions.width / 2;
        const halfDepth = roomBounds.depth / 2 - item.dimensions.depth / 2;
        
        let boundedX = intersectionPoint.x;
        let boundedZ = intersectionPoint.z;
        let collision = null;

        // Check wall collisions
        if (Math.abs(intersectionPoint.x) > halfWidth) {
          boundedX = Math.sign(intersectionPoint.x) * halfWidth;
          collision = Math.sign(intersectionPoint.x) > 0 ? 'east' : 'west';
        }
        if (Math.abs(intersectionPoint.z) > halfDepth) {
          boundedZ = Math.sign(intersectionPoint.z) * halfDepth;
          collision = collision || (Math.sign(intersectionPoint.z) > 0 ? 'north' : 'south');
        }

        setWallCollision(collision);
        
        // Items should always sit on the floor
        onPositionChange(item.id, {
          x: boundedX,
          y: item.dimensions.height / 2,
          z: boundedZ
        });
      }
    }
  }, [isDragging, camera, gl, raycaster, item, onPositionChange, roomBounds, isMovingVertically, dragStartY]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsMovingVertically(false);
    setDragStartY(null);
    setWallCollision(null);
  }, []);

  const handleRotate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = {
      ...item.rotation,
      y: item.rotation.y + Math.PI / 2
    };
    onRotationChange(item.id, newRotation);
  }, [item, onRotationChange]);

  const handleWallSideChange = useCallback((newWallSide: 'north' | 'south' | 'east' | 'west', e: React.MouseEvent) => {
    e.stopPropagation();
    onWallSideChange(item.id, newWallSide);
  }, [item.id, onWallSideChange]);

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
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu
    >
      {renderFurniture()}
      
      {/* Rotation button when selected */}
      {isSelected && !item.isWallMounted && (
        <group position={[0, item.dimensions.height / 2 + 0.2, 0]}>
          <Box args={[0.5, 0.1, 0.1]} position={[0, 0.1, 0]}>
            <meshBasicMaterial color="#3B82F6" />
          </Box>
          <Box 
            args={[0.2, 0.2, 0.2]} 
            position={[0, 0.2, 0]}
            onClick={handleRotate}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <meshBasicMaterial color="#3B82F6" />
          </Box>
        </group>
      )}

      {/* Wall-mounted item controls */}
      {isSelected && item.isWallMounted && (
        <group position={[0, item.dimensions.height / 2 + 0.2, 0]}>
          {/* Wall change buttons */}
          <group position={[0, 0.4, 0]}>
            {(['north', 'south', 'east', 'west'] as const).map((wallSide) => (
              <group key={wallSide} position={getWallButtonPosition(wallSide, item.dimensions.width)}>
                <Box 
                  args={[0.15, 0.15, 0.15]} 
                  onClick={(e) => handleWallSideChange(wallSide, e)}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <meshBasicMaterial color={item.wallSide === wallSide ? '#10B981' : '#6B7280'} />
                </Box>
              </group>
            ))}
          </group>
          
          {/* Rotation button */}
          <group position={[0, 0.1, 0]}>
            <Box args={[0.3, 0.1, 0.1]} position={[0, 0.05, 0]}>
              <meshBasicMaterial color="#3B82F6" />
            </Box>
            <Box 
              args={[0.15, 0.15, 0.15]} 
              position={[0, 0.15, 0]}
              onClick={handleRotate}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <meshBasicMaterial color="#3B82F6" />
            </Box>
          </group>
        </group>
      )}
    </group>
  );
};

// Helper function to position wall change buttons
const getWallButtonPosition = (wallSide: 'north' | 'south' | 'east' | 'west', itemWidth: number) => {
  const offset = itemWidth / 2 + 0.3;
  switch (wallSide) {
    case 'north': return [0, 0, offset];
    case 'south': return [0, 0, -offset];
    case 'east': return [offset, 0, 0];
    case 'west': return [-offset, 0, 0];
  }
};

// Enhanced Room Floor Component with wall collision indication
const RoomFloor: React.FC<{
  roomSettings: RoomSettings;
  roomBounds: { width: number; depth: number };
  wallCollisions: string[];
}> = ({ roomSettings, roomBounds, wallCollisions }) => {

  // Determine wall color based on collision
  const getWallColor = (wall: string, defaultColor: string) => {
    return wallCollisions.includes(wall) ? '#EF4444' : defaultColor;
  };

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
          />
        </Plane>
      )}

      {/* Walls */}
      {roomSettings.showWalls.north && (
        <Box args={[roomBounds.width, 3, 0.1]} position={[0, 1.5, roomBounds.depth / 2]}>
          <meshStandardMaterial
            color={getWallColor('north', roomSettings.wallColors.north)}
          />
        </Box>
      )}
      {roomSettings.showWalls.south && (
        <Box args={[roomBounds.width, 3, 0.1]} position={[0, 1.5, -roomBounds.depth / 2]}>
          <meshStandardMaterial
            color={getWallColor('south', roomSettings.wallColors.south)}
          />
        </Box>
      )}
      {roomSettings.showWalls.east && (
        <Box args={[0.1, 3, roomBounds.depth]} position={[roomBounds.width / 2, 1.5, 0]}>
          <meshStandardMaterial
            color={getWallColor('east', roomSettings.wallColors.east)}
          />
        </Box>
      )}
      {roomSettings.showWalls.west && (
        <Box args={[0.1, 3, roomBounds.depth]} position={[-roomBounds.width / 2, 1.5, 0]}>
          <meshStandardMaterial
            color={getWallColor('west', roomSettings.wallColors.west)}
          />
        </Box>
      )}
    </group>
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
  onAddItem: (template: ItemTemplate, wallSide?: 'north' | 'south' | 'east' | 'west') => void;
  roomSettings: RoomSettings;
  onRoomSettingsChange: (settings: RoomSettings) => void;
  roomBounds: { width: number; depth: number };
  selectedItemId: string | null;
  onWallMountChange: (id: string, wallSide: 'north' | 'south' | 'east' | 'west') => void;
  onRotateItem: (id: string) => void;
}> = ({
  activeTab,
  onTabChange,
  itemTemplates,
  onAddItem,
  roomSettings,
  onRoomSettingsChange,
  roomBounds,
  selectedItemId,
  onWallMountChange,
  onRotateItem
}) => {
    const [selectedWallForMounting, setSelectedWallForMounting] = useState<'north' | 'south' | 'east' | 'west'>('north');
    
    const tabs = [
      { id: 'model', label: 'Room Config', icon: Home },
      { id: 'items', label: 'Items', icon: Package },
      { id: 'settings', label: 'Appearance', icon: Palette }
    ];

    const selectedItem = selectedItemId ? itemTemplates.find(t => t.id === selectedItemId) : null;

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

        {/* Selected Item Controls */}
        {selectedItemId && selectedItem && (
          <div className="p-4 border-b border-gray-300 bg-white">
            <h4 className="font-medium mb-2">{selectedItem.name} Controls</h4>
            <div className="space-y-2">
              <button
                onClick={() => onRotateItem(selectedItemId)}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RotateCw size={14} /> Rotate 90°
              </button>
              
              {selectedItem.isWallMounted && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Mount on Wall:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['north', 'south', 'east', 'west'] as const).map((wall) => (
                      <button
                        key={wall}
                        onClick={() => {
                          setSelectedWallForMounting(wall);
                          onWallMountChange(selectedItemId, wall);
                        }}
                        className={`px-2 py-1 text-sm rounded ${selectedWallForMounting === wall ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        {wall.charAt(0).toUpperCase() + wall.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    <p>💡 <strong>Pro Tip:</strong></p>
                    <p className="mt-1">• Drag normally to move left/right</p>
                    <p>• Hold <strong>Shift</strong> while dragging to move up/down</p>
                    <p>• Or use the colored buttons on the item</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">
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
                  <li>• Drag items to arrange furniture</li>
                  <li>• Click rotation button above items to rotate</li>
                  <li>• Wall-mounted items: Drag normally for left/right, Shift+drag for up/down</li>
                </ul>
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
                        {template.isWallMounted && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-500">🖼️ Wall Mounted</span>
                          </div>
                        )}
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
                  Use the rotation button above items to rotate them 90°.
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
  const [wallCollisions, setWallCollisions] = useState<string[]>([]);
  const [isDraggingItem, setIsDraggingItem] = useState(false);

  // Reset dragging state when item is deselected or deleted
  useEffect(() => {
    if (!selectedItemId) {
      setIsDraggingItem(false);
      setWallCollisions([]);
    }
  }, [selectedItemId]);

  // Add new item to the room
  const handleAddItem = useCallback((template: ItemTemplate, wallSide?: 'north' | 'south' | 'east' | 'west') => {
    let position;
    let wallSideToUse = wallSide;
    
    if (template.isWallMounted) {
      wallSideToUse = wallSideToUse || 'north';
      switch (wallSideToUse) {
        case 'north':
          position = { x: 0, y: 1.5, z: roomBounds.depth / 2 - 0.05 };
          break;
        case 'south':
          position = { x: 0, y: 1.5, z: -roomBounds.depth / 2 + 0.05 };
          break;
        case 'east':
          position = { x: roomBounds.width / 2 - 0.05, y: 1.5, z: 0 };
          break;
        case 'west':
          position = { x: -roomBounds.width / 2 + 0.05, y: 1.5, z: 0 };
          break;
      }
    } else {
      // Place regular items on the floor (half height above floor)
      position = { x: 0, y: template.dimensions.height / 2, z: 0 };
    }

    const newItem: RoomItem = {
      id: Date.now().toString(),
      name: template.name,
      type: template.type,
      position,
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: template.dimensions,
      color: template.color,
      textureUrl: template.textureUrl,
      isWallMounted: template.isWallMounted,
      wallSide: wallSideToUse
    };
    setRoomItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  }, [roomBounds]);

  // Update item position with collision detection
  const handleItemPositionChange = useCallback((id: string, position: { x: number; y: number; z: number }) => {
    setIsDraggingItem(true);
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

    // Update wall collisions
    const newCollisions: string[] = [];
    const halfWidth = roomBounds.width / 2;
    const halfDepth = roomBounds.depth / 2;
    
    if (Math.abs(position.x) >= halfWidth) {
      newCollisions.push(position.x > 0 ? 'east' : 'west');
    }
    if (Math.abs(position.z) >= halfDepth) {
      newCollisions.push(position.z > 0 ? 'north' : 'south');
    }
    
    setWallCollisions(newCollisions);
  }, [roomBounds]);

  const handleItemRotationChange = useCallback((id: string, rotation: { x: number; y: number; z: number }) => {
    setRoomItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, rotation } : item
      )
    );
  }, []);

  const handleRotateItem = useCallback((id: string) => {
    setRoomItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            rotation: {
              ...item.rotation,
              y: item.rotation.y + Math.PI / 2
            }
          };
        }
        return item;
      })
    );
  }, []);

  const handleWallSideChange = useCallback((id: string, newWallSide: 'north' | 'south' | 'east' | 'west') => {
    setRoomItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          let newPosition = { ...item.position };
          const halfWidth = roomBounds.width / 2;
          const halfDepth = roomBounds.depth / 2;
          
          // Calculate new position based on the new wall
          switch (newWallSide) {
            case 'north':
              newPosition.z = halfDepth - 0.05;
              newPosition.x = Math.max(-halfWidth + item.dimensions.width/2, Math.min(halfWidth - item.dimensions.width/2, item.position.x));
              break;
            case 'south':
              newPosition.z = -halfDepth + 0.05;
              newPosition.x = Math.max(-halfWidth + item.dimensions.width/2, Math.min(halfWidth - item.dimensions.width/2, item.position.x));
              break;
            case 'east':
              newPosition.x = halfWidth - 0.05;
              newPosition.z = Math.max(-halfDepth + item.dimensions.depth/2, Math.min(halfDepth - item.dimensions.depth/2, item.position.z));
              break;
            case 'west':
              newPosition.x = -halfWidth + 0.05;
              newPosition.z = Math.max(-halfDepth + item.dimensions.depth/2, Math.min(halfDepth - item.dimensions.depth/2, item.position.z));
              break;
          }
          
          return { ...item, wallSide: newWallSide, position: newPosition };
        }
        return item;
      })
    );
  }, [roomBounds]);

  // Delete selected item
  const handleDeleteItem = useCallback(() => {
    if (selectedItemId) {
      setRoomItems(prev => prev.filter(item => item.id !== selectedItemId));
      setSelectedItemId(null);
      setIsDraggingItem(false);
      setWallCollisions([]);
    }
  }, [selectedItemId]);

  // Handle click outside to deselect
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas background
    if (e.target === e.currentTarget) {
      setSelectedItemId(null);
      setIsDraggingItem(false);
      setWallCollisions([]);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedItemId) {
          handleDeleteItem();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedItemId) {
          handleRotateItem(selectedItemId);
        }
      } else if (e.key === 'Escape') {
        setSelectedItemId(null);
        setIsDraggingItem(false);
        setWallCollisions([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, handleDeleteItem, handleRotateItem]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        itemTemplates={itemTemplates}
        onAddItem={handleAddItem}
        roomSettings={roomSettings}
        onRoomSettingsChange={setRoomSettings}
        roomBounds={roomBounds}
        selectedItemId={selectedItemId}
        onWallMountChange={handleWallSideChange}
        onRotateItem={handleRotateItem}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 relative" onClick={handleCanvasClick}>
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
            roomSettings={roomSettings}
            roomBounds={roomBounds}
            wallCollisions={wallCollisions}
          />

          {roomItems.map(item => (
            <RoomItemComponent
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={setSelectedItemId}
              onPositionChange={handleItemPositionChange}
              onRotationChange={handleItemRotationChange}
              onWallSideChange={handleWallSideChange}
              roomBounds={roomBounds}
              roomSettings={roomSettings}
            />
          ))}

          {/* Camera Controls - Disabled when dragging items */}
          <OrbitControls
            enablePan={!isDraggingItem}
            enableZoom={!isDraggingItem}
            enableRotate={!isDraggingItem}
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
              onClick={() => {
                setSelectedItemId(null);
                setIsDraggingItem(false);
                setWallCollisions([]);
              }}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              title="Deselect All (Esc)"
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
            <div className="bg-white p-3 rounded-md shadow-lg max-w-xs">
              <div className="font-medium mb-1">
                {roomItems.find(item => item.id === selectedItemId)?.name}
              </div>
              <div className="text-gray-600 text-xs space-y-1">
                <div>• Click and drag to move</div>
                <div>• Press R or click rotation button to rotate</div>
                <div>• Del/Backspace to delete • Esc to deselect</div>
                {wallCollisions.length > 0 && (
                  <div className="text-red-500 font-medium mt-1">
                    ⚠ Collision with {wallCollisions.join(', ')} wall
                  </div>
                )}
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
            <li>• <strong>Press R</strong> or use rotation button to rotate items</li>
            <li>• <strong>Esc</strong> to deselect items</li>
            <li>• <strong>Mouse wheel</strong> to zoom</li>
            <li>• <strong>Right-click + drag</strong> to rotate view (when not dragging items)</li>
            <li>• <strong>Delete/Backspace</strong> to remove items</li>
            <li>• Items cannot pass through walls (walls turn red on collision)</li>
            <li>• <strong>Wall-mounted items:</strong></li>
            <li className="ml-2">  ◦ Drag normally for left/right movement</li>
            <li className="ml-2">  ◦ <strong>Shift+drag</strong> for up/down movement</li>
            <li className="ml-2">  ◦ Use colored buttons around item to change walls</li>
          </ul>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Room: {roomBounds.width}' × {roomBounds.depth}' • Items: {roomItems.length}
              {isDraggingItem && (
                <span className="text-blue-500 ml-2">
                  🟢 Dragging mode - Room controls disabled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Room Stats */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <div className="text-sm font-medium">Room Overview</div>
          <div className="text-xs text-gray-600 mt-1">
            <div>Size: {roomBounds.width}' × {roomBounds.depth}'</div>
            <div>Items: {roomItems.length}</div>
            <div>
              {isDraggingItem ? (
                <span className="text-blue-500">🟢 Dragging mode</span>
              ) : selectedItemId ? (
                <span className="text-green-500">🟡 Item selected</span>
              ) : (
                <span className="text-gray-500">Ready</span>
              )}
            </div>
          </div>
        </div>

        {/* Wall Mounting Helper */}
        {roomItems.find(item => item.id === selectedItemId)?.isWallMounted && (
          <div className="absolute top-20 left-4 bg-blue-50 p-3 rounded-lg shadow-lg max-w-xs border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-blue-500">🖼️</div>
              <div className="font-medium text-blue-800">Wall Mounted Item Controls</div>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>Movement:</strong></div>
              <div>• Normal drag: Move left/right along wall</div>
              <div>• <strong>Shift + drag:</strong> Move up/down</div>
              <div className="mt-1"><strong>Change wall:</strong></div>
              <div>• Click colored buttons around the item</div>
              <div>• Green = current wall, Gray = other walls</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDesigner;