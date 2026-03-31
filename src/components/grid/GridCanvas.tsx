// @ts-nocheck
import { useMemo, useState, useEffect } from "react";
import { CONFIG } from "./gridConfig";
import { EMPTY_COLORS, matchesFilter, calculateGridDimensions } from "./gridState";
import { ShoeTile } from "./ShoeTile";

export function GridCanvas({
  items,
  gridVisible,
  transitionStartTime,
  interactive,
  filter = "all",
  colorFilter = EMPTY_COLORS,
  onSelectionChange,
  onZoomChange,
}) {
  const { mappedItems, filteredGridDims } = useMemo(() => {
    const spacing = CONFIG.itemSize + CONFIG.gap;

    const filteredItems = items.filter((item) =>
      matchesFilter(item, filter, colorFilter)
    );

    const filteredCount = filteredItems.length;
    const filteredDims = calculateGridDimensions(filteredCount);
    const originalDims = calculateGridDimensions(items.length);

    let filteredIdx = 0;
    const maxDelay = gridVisible
      ? CONFIG.enterStaggerDelay
      : CONFIG.exitStaggerDelay;

    const mapped = items.map((shoe, i) => {
      const isMatch = matchesFilter(shoe, filter, colorFilter);

      let targetPos;

      if (isMatch) {
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

        targetPos = {
          x: col * spacing - originalDims.width / 2 + spacing / 2,
          y: -(row * spacing) + originalDims.height / 2 - spacing / 2,
        };
      }

      return {
        ...shoe,
        index: i,
        randomDelay: (i % 12) / 12 * maxDelay, // stable stagger
        basePos: targetPos,
        matchesFilter: isMatch,
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
    if (!gridVisible) {
      setMountedCount(mappedItems.length);
      return;
    }

    setMountedCount(0);

    let current = 0;
    const chunkSize = 8; // increase from 5 to 8 for faster smooth mount

    const interval = setInterval(() => {
      current += chunkSize;

      if (current >= mappedItems.length) {
        setMountedCount(mappedItems.length);
        clearInterval(interval);
      } else {
        setMountedCount(current);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [gridVisible, mappedItems.length]);

  return (
    <>
      {mappedItems.map((item, i) => {
        if (i >= mountedCount) return null;

        return (
          <ShoeTile
            key={item.id || item.product_url || item.index}
            data={item}
            index={item.index}
            basePos={item.basePos}
            gridVisible={gridVisible}
            transitionStartTime={transitionStartTime}
            interactive={interactive && item.matchesFilter}
            matchesFilter={item.matchesFilter}
            gridHeight={filteredGridDims.height}
            onSelectionChange={onSelectionChange}
            onZoomChange={onZoomChange}
          />
        );
      })}
    </>
  );
}
