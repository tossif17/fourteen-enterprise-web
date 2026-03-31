// @ts-nocheck
import React, {
  useMemo,
  useState,
  useEffect,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useProducts } from "../../hooks/useProducts";
import { DEFAULT_CONFIG, CONFIG } from "./gridConfig";
import {
  rigState,
  calculateGridDimensions,
  EMPTY_COLORS,
} from "./gridState";
import { Rig } from "./Rig";
import { GridCanvas } from "./GridCanvas";
import { UnifiedControlBar } from "../GridUI";
import "../HoloCardMaterial";
import Header from "./Header";

export default function ShoeGrid() {
  const { products: shoes, loading, error } = useProducts();

  const [zoomTarget, setZoomTarget] = useState(null);
  const [initialZoom] = useState(DEFAULT_CONFIG.zoomOut);
  const [currentZoom, setCurrentZoom] = useState(rigState.zoom);
  const [hasActiveSelection, setHasActiveSelection] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeBrand, setActiveBrand] = useState("All");
  const [activeCollectionIdx, setActiveCollectionIdx] = useState(0);
  const [gridLayers, setGridLayers] = useState(() => [
    { id: "init", items: [], mode: "enter", startTime: 0 },
  ]);

  const normalizeId = (value: any) => {
    if (value === null || value === undefined) return null;
    return String(value).trim();
  };

  useEffect(() => {
    shoes.forEach((shoe) => {
      if (shoe.image_url) useTexture.preload(shoe.image_url);
    });
  }, [shoes]);

  const brands = useMemo(() => {
    const unique = [...new Set(shoes.map((s) => s.brand).filter(Boolean))];
    return ["All", ...unique];
  }, [shoes]);

  const collectionsData = useMemo(() => {
    const all = shoes;
    const byBrand = brands.slice(1).map((brand) =>
      shoes.filter((s) => s.brand === brand)
    );
    return [all, ...byBrand];
  }, [shoes, brands]);

  useEffect(() => {
    if (shoes.length === 0) return;

    const items = collectionsData[activeCollectionIdx] ?? shoes;
    setGridLayers([
      {
        id: `init-${activeCollectionIdx}`,
        items,
        mode: "enter",
        startTime: 0,
      },
    ]);
  }, [shoes, collectionsData, activeCollectionIdx]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentZoom(rigState.zoom), 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const rawActiveId = rigState.activeId;
      const normalizedActiveId = normalizeId(rawActiveId);

      setHasActiveSelection(normalizedActiveId !== null);
      setActiveProductId(normalizedActiveId);

      if (normalizedActiveId !== null) {
        const selected = shoes.find(
          (p) => normalizeId(p.id) === normalizedActiveId
        );

        if (selected) {
          setActiveProduct(selected);
        } else {
          setActiveProduct(null);
        }
      } else {
        setActiveProduct(null);
        setActiveProductId(null);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [shoes]);

  useEffect(() => {
    const updateResponsiveZoom = () => {
      const width = window.innerWidth;
      let newZoomOut;

      // Keep zoom level more consistent across screen sizes
      if (width < 480) newZoomOut = 38;
      else if (width < 768) newZoomOut = 34;
      else newZoomOut = 30;

      CONFIG.zoomOut = newZoomOut;

      if (rigState.zoom > CONFIG.zoomIn + 2) {
        rigState.zoom = newZoomOut;
        setCurrentZoom(newZoomOut);
      }
    };

    updateResponsiveZoom();
    window.addEventListener("resize", updateResponsiveZoom);
    return () => window.removeEventListener("resize", updateResponsiveZoom);
  }, []);

  useEffect(() => {
    if (zoomTarget === "OUT") {
      rigState.zoom = CONFIG.zoomOut;
      setCurrentZoom(CONFIG.zoomOut);
      rigState.target.set(0, 2, 0);
    } else if (typeof zoomTarget === "number") {
      rigState.zoom = zoomTarget;
      setCurrentZoom(zoomTarget);
    }
    setZoomTarget(null);
  }, [zoomTarget]);

  const activeLayer = gridLayers[gridLayers.length - 1];

  const filteredItemCount = useMemo(() => {
    return activeLayer?.items?.length || 0;
  }, [activeLayer]);

  const activeDims = calculateGridDimensions(filteredItemCount);
  const isZoomedIn = currentZoom <= CONFIG.zoomIn + 0.5;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: isMobile ? "72vh" : "96vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f7",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",
            border: "4px solid rgba(0,0,0,0.08)",
            borderTop: "4px solid #111",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: isMobile ? "72vh" : "96vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          fontFamily: "sans-serif",
          color: "#c00",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Failed to load products: {error.message}
      </div>
    );
  }

  const handleCollectionSwitch = (index) => {
    if (index === activeCollectionIdx) return;

    const now = Date.now();
    const items = collectionsData[index] ?? shoes;

    setGridLayers((prev) => {
      const exitingLayers = prev.map((layer) =>
        layer.mode === "enter"
          ? { ...layer, mode: "exit", startTime: now }
          : layer
      );

      return [
        ...exitingLayers,
        {
          id: `grid-${index}-${now}`,
          items,
          mode: "enter",
          startTime: now,
        },
      ];
    });

    setActiveCollectionIdx(index);
    setActiveBrand(brands[index] ?? "All");
    setHasActiveSelection(false);
    setActiveProduct(null);
    setActiveProductId(null);
    rigState.target.set(0, 2, 0);
    rigState.activeId = null;

    setTimeout(() => {
      setGridLayers((prev) => prev.filter((layer) => layer.mode === "enter"));
    }, CONFIG.cleanupTimeout);
  };

  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? "74vh" : "98vh",
        background: "#f7f7f7",
        position: "relative",
        overflow: "hidden",
        touchAction: "pan-y",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: isMobile ? 12 : 18,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          textAlign: "center",
          pointerEvents: "none",
          width: "100%",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? "22px" : "36px",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "capitalize",
            lineHeight: 1.1,
            color: "#111",
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Products Gallery
        </h1>
      </div>

      <Canvas
        shadows={false}
        camera={{ position: [0, 0, initialZoom], fov: 38 }}
        dpr={2}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        onCreated={({ gl, scene }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
          scene.background = null;
        }}
      >
        {/* Flat consistent light, no dramatic angle changes */}
        <ambientLight intensity={1.35} />
        <directionalLight
          position={[0, 0, 10]}
          intensity={0.35}
        />

        <Rig gridW={activeDims.width} gridH={activeDims.height} />

        <Suspense fallback={null}>
          {gridLayers.map((layer) => (
            <GridCanvas
              key={layer.id}
              items={layer.items}
              gridVisible={layer.mode === "enter"}
              transitionStartTime={layer.startTime}
              interactive={layer.mode === "enter"}
              filter="all"
              colorFilter={EMPTY_COLORS}
              itemScale={isMobile ? 1.16 : 1.08}
            />
          ))}
        </Suspense>
      </Canvas>

      <UnifiedControlBar
        currentCollection={activeCollectionIdx}
        onSwitch={handleCollectionSwitch}
        setZoomTrigger={setZoomTarget}
        isZoomedIn={isZoomedIn}
        hasActiveSelection={hasActiveSelection}
        activeProduct={activeProduct}
        activeProductId={activeProductId}
        brands={brands}
      />
    </div>
  );
}