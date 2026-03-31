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
import { rigState, calculateGridDimensions, EMPTY_COLORS} from "./gridState";
import { Rig } from "./Rig";
import { GridCanvas } from "./GridCanvas";
import { UnifiedControlBar } from "../GridUI";
import "../HoloCardMaterial";
import Header from "./Header";

export default function ShoeGrid() {
    // ── ALL HOOKS FIRST ───────────────────────────────────────────────
    const { products: shoes, loading, error } = useProducts();

    const [zoomTarget, setZoomTarget] = useState(null);
    const [initialZoom] = useState(DEFAULT_CONFIG.zoomOut);
    const [currentZoom, setCurrentZoom] = useState(rigState.zoom);
    const [hasActiveSelection, setHasActiveSelection] = useState(false);
    const [activeBrand, setActiveBrand] = useState("All"); // "All" or brand name
    const [activeCollectionIdx, setActiveCollectionIdx] = useState(0);
    const [gridLayers, setGridLayers] = useState(() => [
        { id: "init", items: [], mode: "enter", startTime: 0 },
    ]);


    // Preload textures
    useEffect(() => {
        shoes.forEach((shoe) => {
            if (shoe.image_url) useTexture.preload(shoe.image_url);
        });
    }, [shoes]);

    // Build brand list dynamically from products
    const brands = useMemo(() => {
        const unique = [...new Set(shoes.map((s) => s.brand).filter(Boolean))];
        return ["All", ...unique];
    }, [shoes]);

    // Collections: index 0 = All, then one per brand
    const collectionsData = useMemo(() => {
        const all = shoes;
        const byBrand = brands.slice(1).map((brand) =>
            shoes.filter((s) => s.brand === brand)
        );
        return [all, ...byBrand];
    }, [shoes, brands]);

    // Sync grid layers when shoes or active collection changes
    useEffect(() => {
        if (shoes.length === 0) return;
        const items = collectionsData[activeCollectionIdx] ?? shoes;
        setGridLayers([{
            id: `init-${activeCollectionIdx}`,
            items,
            mode: "enter",
            startTime: 0,
        }]);
    }, [shoes]);

    useEffect(() => {
        const interval = setInterval(() => setCurrentZoom(rigState.zoom), 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setHasActiveSelection(rigState.activeId !== null);
        }, 16);
        return () => clearInterval(interval);
    }, []);

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
        return activeLayer.items.length;
    }, [activeLayer.items]);

    const activeDims = calculateGridDimensions(filteredItemCount);
    const isZoomedIn = currentZoom <= CONFIG.zoomIn + 0.5;

    // ── EARLY RETURNS AFTER ALL HOOKS ────────────────────────────────
    if (loading) {
        return (
            <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0", fontFamily: "sans-serif", color: "#888" }}>
                Loading products…
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0", fontFamily: "sans-serif", color: "#c00" }}>
                Failed to load products: {error.message}
            </div>
        );
    }

    // ── HANDLERS ─────────────────────────────────────────────────────
    const handleCollectionSwitch = (index) => {
        if (index === activeCollectionIdx) return;
        const now = Date.now();
        const items = collectionsData[index] ?? shoes;
        setGridLayers((prev) => {
            const exitingLayers = prev.map((layer) =>
                layer.mode === "enter" ? { ...layer, mode: "exit", startTime: now } : layer
            );
            return [...exitingLayers, {
                id: `grid-${index}-${now}`,
                items,
                mode: "enter",
                startTime: now,
            }];
        });
        setActiveCollectionIdx(index);
        setActiveBrand(brands[index] ?? "All");
        rigState.target.set(0, 2, 0);
        rigState.activeId = null;
        setTimeout(() => {
            setGridLayers((prev) => prev.filter((layer) => layer.mode === "enter"));
        }, CONFIG.cleanupTimeout);
    };

    // ── RENDER ───────────────────────────────────────────────────────
    return (
        <div style={{ width: "100vw", height: "100vh", backgroundColor: "#f0f0f0", position: "relative", overflow: "hidden", touchAction: "none" }}>
            
            <Canvas
                camera={{ position: [0, 0, initialZoom], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
            >
                <Rig gridW={activeDims.width} gridH={activeDims.height} />
                {/* <TopologyBackground
                    isZoomedIn={isZoomedIn}
                    color={CONFIG.bgColor}
                    opacity={CONFIG.bgOpacity}
                    speed={CONFIG.bgSpeed}
                    scale={CONFIG.bgScale}
                    lineThickness={CONFIG.bgLineThickness}
                /> */}
                <fog attach="fog" args={["#f0f0f0"]} />
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
                brands={brands}
            />
        </div>
    );
}
