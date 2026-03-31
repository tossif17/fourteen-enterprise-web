// @ts-nocheck
import { useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { CONFIG } from "./gridConfig";
import {
  EMPTY_COLORS,
  matchesFilter,
  calculateGridDimensions,
} from "./gridState";
import { ShoeTile } from "./ShoeTile";

// --- OPTIMIZED COMPONENT: GRID CANVAS ---
// Renders a single set of items with Time-Sliced mounting
export function GridCanvas({
  items,
  gridVisible,
  transitionStartTime,
  interactive,
  filter = "all",
  colorFilter = EMPTY_COLORS,
}) {
  const { mappedItems, filteredGridDims } = useMemo(() => {
    const spacing = CONFIG.itemSize + CONFIG.gap;

    const filteredItems = items.filter((item) =>
      matchesFilter(item, filter, colorFilter)
    );

    const filteredCount = filteredItems.length;
    const filteredDims = calculateGridDimensions(filteredCount);

    const maxDelay = gridVisible
      ? CONFIG.enterStaggerDelay
      : CONFIG.exitStaggerDelay;

    let filteredIdx = 0;

    const mapped = items.map((shoe, i) => {
      const matches = matchesFilter(shoe, filter, colorFilter);
      let targetPos;

      if (matches) {
        const col = filteredIdx % CONFIG.gridCols;
        const row = Math.floor(filteredIdx / CONFIG.gridCols);

        targetPos = {
          x: col * spacing - filteredDims.width / 2 + spacing / 2,
          y: -(row * spacing) + filteredDims.height / 2 - spacing / 2,
        };

        filteredIdx++;
      } else {
        const col = i % CONFIG.gridCols;
        const row = Math.floor(i / CONFIG.gridCols);
        const originalDims = calculateGridDimensions(items.length);

        targetPos = {
          x: col * spacing - originalDims.width / 2 + spacing / 2,
          y: -(row * spacing) + originalDims.height / 2 - spacing / 2,
        };
      }

      return {
        ...shoe,
        index: i, // only for layout/key fallback
        randomDelay: Math.random() * maxDelay,
        basePos: targetPos,
        matchesFilter: matches,
      };
    });

    return {
      mappedItems: mapped,
      filteredGridDims: filteredDims,
    };
  }, [items, filter, colorFilter, gridVisible]);

  const [mountedCount, setMountedCount] = useState(
    gridVisible ? 0 : items.length
  );

  useEffect(() => {
    setMountedCount(gridVisible ? 0 : items.length);
  }, [items, gridVisible]);

  useFrame(() => {
    if (mountedCount < mappedItems.length) {
      setMountedCount((prev) => Math.min(prev + 5, mappedItems.length));
    }
  });

  return (
    <>
      {mappedItems.map((item, i) => {
        if (i >= mountedCount) return null;

        return (
          <ShoeTile
            key={item.id || item.product_url || item.index}
            data={item}
            productId={item.id}   // ✅ actual product id
            index={item.index}    // optional: keep normal index separately
            basePos={item.basePos}
            gridVisible={gridVisible}
            transitionStartTime={transitionStartTime}
            interactive={interactive && item.matchesFilter}
            matchesFilter={item.matchesFilter}
            gridHeight={filteredGridDims.height}
          />
        );
      })}
    </>
  );
}