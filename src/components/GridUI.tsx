// @ts-nocheck
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "./grid/gridConfig";

const islandTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

export function UnifiedControlBar({
  currentCollection,
  onSwitch,
  setZoomTrigger,
  isZoomedIn,
  hasActiveSelection,
  brands = ["All"],
}) {
  return (
    <div
      className="control-bar-container"
      style={{
        position: "absolute",
        bottom: "40px",
        left: "0",
        right: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <motion.div
        className="control-bar-island"
        layout
        transition={islandTransition}
        style={{
          background: "linear-gradient(135deg, rgba(255,240,235,0.4) 0%, rgba(255,255,255,0.3) 50%, rgba(245,235,255,0.4) 100%)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRadius: "32px",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          pointerEvents: "auto",
          height: "56px",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {hasActiveSelection ? (
            <motion.button
              key="buy-now-mode"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              transition={{ ...islandTransition, opacity: { duration: 0.2 } }}
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "24px",
                padding: "0 24px",
                height: "44px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Product
            </motion.button>
          ) : isZoomedIn ? (
            <motion.div
              key="compact-mode"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ ...islandTransition, opacity: { duration: 0.2 } }}
              style={{ display: "flex" }}
            >
              <ControlButton icon="remove" onClick={() => setZoomTrigger("OUT")} label="Zoom Out" />
            </motion.div>
          ) : (
            <motion.div
              key="expanded-mode"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              transition={{ ...islandTransition, opacity: { duration: 0.2 } }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ControlButton icon="add" onClick={() => setZoomTrigger(CONFIG.zoomIn)} label="Zoom In" />

              <motion.div
                layout
                style={{ width: "1px", height: "24px", background: "rgba(0,0,0,0.08)", margin: "0 2px" }}
              />

              {/* Brand Tabs - dynamically built from products */}
  <div
  className="brand-tabs"
  onMouseDown={(e) => {
    const el = e.currentTarget;
    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;

    const onMouseMove = (e: any) => {
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }}
  style={{
    display: "flex",
    gap: "2px",
    overflowX: "auto",
    overflowY: "hidden",
    maxWidth: "60vw",
    cursor: "grab",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>
                {brands.map((brand, index) => (
                  <TabButton
                    key={brand}
                    isActive={currentCollection === index}
                    onClick={() => onSwitch(index)}
                  >
                    {brand}
                  </TabButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @media (max-height: 800px) {
          .control-bar-container { bottom: 24px !important; }
          .control-bar-island { height: 48px !important; border-radius: 24px !important; padding: 4px !important; }
        }
        @media (max-height: 650px) {
          .control-bar-container { bottom: 16px !important; }
          .control-bar-island { height: 44px !important; }
        }
        @media (max-width: 768px) {
          .control-bar-container { bottom: 20px !important; }
          .control-bar-island { height: 48px !important; padding: 4px !important; }
        }
        @media (max-width: 480px) {
          .control-bar-container { bottom: 16px !important; }
          .control-bar-island { height: 44px !important; }
          .control-button { width: 36px !important; height: 36px !important; }
          .tab-button { padding: 6px 10px !important; font-size: 12px !important; }
        }
      `}</style>
    </div>
  );
}

function ControlButton({ onClick, icon, label }) {
  return (
    <motion.button
      layout="position"
      onClick={onClick}
      className="control-button"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "none",
        background: "transparent",
        color: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
      }}
      aria-label={label}
    >
      {icon === "add" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      )}
    </motion.button>
  );
}

function TabButton({ children, isActive, onClick }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="tab-button"
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        color: isActive ? "#000" : "#666",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap",
        zIndex: 1,
        transition: "color 0.2s ease",
      }}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          transition={islandTransition}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
            zIndex: -1,
          }}
        />
      )}
    </motion.button>
  );
}
