// @ts-nocheck
import React, { useMemo, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useProducts } from "../../hooks/useProducts";
import { DEFAULT_CONFIG, CONFIG } from "./gridConfig";
import { rigState, calculateGridDimensions, EMPTY_COLORS } from "./gridState";
import { Rig } from "./Rig";
import { GridCanvas } from "./GridCanvas";
import { UnifiedControlBar } from "../GridUI";
import "../HoloCardMaterial";
import Header from "./Header";

export default function ShoeGrid() {
  const { products: shoes, loading, error } = useProducts();

  const [zoomTarget, setZoomTarget] = useState<any>(null);
  const [initialZoom] = useState(DEFAULT_CONFIG.zoomOut);
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_CONFIG.zoomOut);
  const [hasActiveSelection, setHasActiveSelection] = useState(false);
  const [activeCollectionIdx, setActiveCollectionIdx] = useState(0);

  // ✅ 1. brands FIRST
  const brands = useMemo(() => {
    const unique = [...new Set(shoes.map((s) => s.brand).filter(Boolean))];
    return ["All", ...unique];
  }, [shoes]);

  // ✅ 2. shoesByBrand SECOND
  const shoesByBrand = useMemo(() => {
    const map = new Map();

    map.set("All", shoes);

    for (const shoe of shoes) {
      const brand = shoe.brand || "Unknown";
      if (!map.has(brand)) {
        map.set(brand, []);
      }
      map.get(brand).push(shoe);
    }

    return map;
  }, [shoes]);

  // ✅ 3. activeBrand THIRD (IMPORTANT FIX)
  const activeBrand = brands[activeCollectionIdx] ?? "All";

  // ✅ 4. preload AFTER activeBrand exists
  useEffect(() => {
    const activeList = shoesByBrand.get(activeBrand) ?? shoes;

    activeList.slice(0, 40).forEach((shoe) => {
      if (shoe.image_url) {
        useTexture.preload(shoe.image_url);
      }
    });
  }, [activeBrand, shoesByBrand, shoes]);

  // ✅ 5. activeItems
  const activeItems = useMemo(() => {
    const list = shoesByBrand.get(activeBrand) ?? shoes;
    return list.slice(0, 60);
  }, [shoesByBrand, activeBrand, shoes]);

  const activeDims = useMemo(() => {
    return calculateGridDimensions(activeItems.length);
  }, [activeItems.length]);

  // Responsive zoom
  useEffect(() => {
    const updateResponsiveZoom = () => {
      const width = window.innerWidth;
      let newZoomOut;

      if (width < 480) newZoomOut = 48;
      else if (width < 768) newZoomOut = 38;
      else newZoomOut = DEFAULT_CONFIG.zoomOut;

      CONFIG.zoomOut = newZoomOut;

      if (rigState.zoom > CONFIG.zoomIn + 2) {
        rigState.zoom = newZoomOut;
        setCurrentZoom(newZoomOut);
      }
    };

    updateResponsiveZoom();
    window.addEventListener("resize", updateResponsiveZoom);

    return () => {
      window.removeEventListener("resize", updateResponsiveZoom);
    };
  }, []);

  // Zoom handling
  useEffect(() => {
    if (zoomTarget === "OUT") {
      rigState.zoom = CONFIG.zoomOut;
      rigState.target.set(0, 2, 0);
      rigState.activeId = null;

      setCurrentZoom(CONFIG.zoomOut);
      setHasActiveSelection(false);
      setZoomTarget(null);
      return;
    }

    if (typeof zoomTarget === "number") {
      rigState.zoom = zoomTarget;
      setCurrentZoom(zoomTarget);
      setZoomTarget(null);
    }
  }, [zoomTarget]);

  const isZoomedIn = currentZoom <= CONFIG.zoomIn + 0.5;

  const handleCollectionSwitch = (index) => {
    if (index === activeCollectionIdx) return;

    setActiveCollectionIdx(index);

    rigState.target.set(0, 2, 0);
    rigState.activeId = null;
    rigState.zoom = CONFIG.zoomOut;

    setCurrentZoom(CONFIG.zoomOut);
    setHasActiveSelection(false);
  };

  if (loading) {
    return <div style={{ width: "100vw", height: "100vh" }}>Loading…</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, initialZoom], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Rig gridW={activeDims.width} gridH={activeDims.height} />
        <fog attach="fog" args={["#f0f0f0", 60, 180]} />

        <Suspense fallback={null}>
          <GridCanvas
            items={activeItems}
            gridVisible={true}
            transitionStartTime={0}
            interactive={true}
            filter="all"
            colorFilter={EMPTY_COLORS}
            onSelectionChange={setHasActiveSelection}
            onZoomChange={setCurrentZoom}
          />
        </Suspense>
      </Canvas>

      <UnifiedControlBar
        currentCollection={activeCollectionIdx}
        onSwitch={handleCollectionSwitch}
        setZoomTrigger={setZoomTarget}
        isZoomedIn={isZoomedIn}
        hasActiveSelection={hasActiveSelection}
        brands={brands}
      />
    </div>
  );
}