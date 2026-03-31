// @ts-nocheck
import React, {
  useRef,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { CONFIG } from "./gridConfig";
import { rigState } from "./gridState";
import { CloseButton } from "../CloseButton";

// --- OPTIMIZED COMPONENT: SHOE TILE ---
export function ShoeTile({
  data,
  productId,
  index,
  basePos,
  gridVisible,
  transitionStartTime,
  interactive,
  matchesFilter = true,
  gridHeight,
}) {
  const ref = useRef();
  const imageRef = useRef();
  const titleRef = useRef();
  const priceRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(data.image_url);

  // Animation Refs
  const focusZ = useRef(0);
  const rotationX = useRef(0);
  const rotationY = useRef(0);
  const curveZ = useRef(0);
  const transitionZ = useRef(0);
  const transitionY = useRef(0);
  const breathScale = useRef(1);

  // Animated position for filter transitions
  const animatedPos = useRef({
    x: basePos.x,
    y: basePos.y,
  });
  const filterOpacity = useRef(1);
  const filterScale = useRef(1);

  // State to track if we should stop processing entirely (optimization)
  const isSleep = useRef(false);

  // Track if this item was dimmed due to focus mode (for fast recovery)
  const wasDimmedByFocus = useRef(false);

  // RESET ANIMATION STATE ON MOUNT
  useLayoutEffect(() => {
    const normalizedY =
      gridHeight > 0 ? basePos.y / (gridHeight / 2) : 0;

    if (gridVisible) {
      transitionZ.current = CONFIG.enterStartZ;
      transitionY.current = normalizedY * CONFIG.enterSpreadY;

      if (imageRef.current?.material) {
        imageRef.current.material.opacity = CONFIG.enterStartOpacity;
      }

      isSleep.current = false;
    } else {
      transitionZ.current = 0;
      transitionY.current = 0;

      if (imageRef.current?.material) {
        imageRef.current.material.opacity = 1;
      }
    }
  }, []);

  const imageDims = useMemo(() => {
    const maxSize = CONFIG.itemSize * 0.9;

    if (!texture.image) {
      return { width: maxSize, height: maxSize };
    }

    const imgAspect = texture.image.width / texture.image.height;

    return imgAspect > 1
      ? { width: maxSize, height: maxSize / imgAspect }
      : { width: maxSize * imgAspect, height: maxSize };
  }, [texture]);

  useFrame((state, delta) => {
    if (!ref.current || isSleep.current) return;

    // --- 0. Filter Animation ---
    easing.damp(animatedPos.current, "x", basePos.x, 0.2, delta);
    easing.damp(animatedPos.current, "y", basePos.y, 0.2, delta);

    const targetFilterOpacity = matchesFilter ? 1 : 0;
    const targetFilterScale = matchesFilter
      ? 1
      : CONFIG.filterScaleTarget;

    easing.damp(
      filterOpacity,
      "current",
      targetFilterOpacity,
      CONFIG.filterOpacityDamp,
      delta
    );
    easing.damp(
      filterScale,
      "current",
      targetFilterScale,
      CONFIG.filterOpacityDamp,
      delta
    );

    const actualOpacity = imageRef.current?.material?.opacity ?? 1;
    if (actualOpacity < 0.01 && !matchesFilter) {
      ref.current.visible = false;
      return;
    }

    // --- 1. Stagger Logic ---
    const now = Date.now();
    const timeSinceTrigger = now - transitionStartTime;
    const staggerDelay = data.randomDelay || 0;
    const canTransition = timeSinceTrigger > staggerDelay;

    // --- 2. Calculate Targets ---
    let targetTransitionOpacity = 1.0;
    let targetTransitionZ = 0;
    const normalizedY =
      gridHeight > 0 ? basePos.y / (gridHeight / 2) : 0;
    let targetTransitionY = 0;

    if (gridVisible) {
      if (canTransition) {
        targetTransitionOpacity = 1.0;
        targetTransitionZ = 0;
        targetTransitionY = 0;
      } else {
        targetTransitionOpacity = CONFIG.enterStartOpacity;
        targetTransitionZ = CONFIG.enterStartZ;
        targetTransitionY = normalizedY * CONFIG.enterSpreadY;
      }
    } else {
      if (canTransition) {
        targetTransitionOpacity = 0.0;
        targetTransitionZ = CONFIG.exitEndZ;
        targetTransitionY = normalizedY * CONFIG.exitSpreadY;
      } else {
        targetTransitionOpacity = 1.0;
        targetTransitionZ = 0;
        targetTransitionY = 0;
      }
    }

    // --- 3. Base Position ---
    const x = animatedPos.current.x + rigState.current.x;
    const y = animatedPos.current.y + rigState.current.y;

    // --- 4. Dynamic Culling ---
    const currentCull = CONFIG.cullDistance * (rigState.zoom / 8);
    const isPositionVisible =
      Math.abs(x) < currentCull &&
      Math.abs(y) < currentCull;

    if (
      !gridVisible &&
      targetTransitionOpacity < 0.01 &&
      filterOpacity.current < 0.01
    ) {
      ref.current.visible = false;
      isSleep.current = true;
      return;
    }

    if (!isPositionVisible && !(!gridVisible && canTransition)) {
      ref.current.visible = false;
      return;
    }

    if (
      imageRef.current?.material?.opacity < 0.01 &&
      targetTransitionOpacity < 0.01
    ) {
      ref.current.visible = false;
      return;
    }

    ref.current.visible = true;

    // --- 5. Curvature & Zoom ---
    const isZoomedIn = rigState.zoom <= CONFIG.zoomIn + 0.5;
    const maxZoom = CONFIG.zoomOut || 50;
    const zoomRatio = isZoomedIn
      ? 0
      : THREE.MathUtils.clamp(
          (rigState.zoom - CONFIG.zoomIn) /
            (maxZoom - CONFIG.zoomIn),
          0,
          1
        );

    const smoothRatio = easing.cubic.inOut(zoomRatio);
    const distSq = x * x + y * y;
    const dist = Math.sqrt(distSq);

    const targetCurveZ =
      -distSq * CONFIG.curvatureStrength * smoothRatio;

    let rotX = 0;
    let rotY = 0;

    if (targetTransitionOpacity > 0.1) {
      const rotationIntensity =
        Math.min(dist * 0.4, 2.0) * smoothRatio;

      rotX =
        y *
        CONFIG.curvatureStrength *
        CONFIG.rotationStrength *
        rotationIntensity;

      rotY =
        -x *
        CONFIG.curvatureStrength *
        CONFIG.rotationStrength *
        rotationIntensity;
    }

    // --- 6. Interaction State ---
    const isFocusMode = rigState.activeId !== null;
    const isActive = rigState.activeId === productId;
    const isHovered = hovered && interactive;

    let interactionScale = 1.0;
    let interactionOpacity = 1.0;
    let targetTextOpacity = 0;
    let targetFocusZ = 0;

    if (isFocusMode) {
      if (isActive) {
        interactionScale = CONFIG.focusScale;
        interactionOpacity = 1.0;
        targetTextOpacity = 1.0;
        targetFocusZ = 2;
      } else {
        interactionScale = CONFIG.dimScale;
        interactionOpacity = CONFIG.dimOpacity;
        targetTextOpacity = 0;
        targetFocusZ = -0.5;
        wasDimmedByFocus.current = true;
      }
    } else {
      interactionScale =
        isHovered && !rigState.isDragging ? 1.05 : 1.0;
      targetFocusZ =
        isHovered && !rigState.isDragging ? 0.5 : 0;
    }

    const finalOpacity =
      interactionOpacity *
      targetTransitionOpacity *
      filterOpacity.current;

    const combinedScale = interactionScale * filterScale.current;

    // --- 7. Apply Animations ---
    easing.damp(ref.current.scale, "x", combinedScale, 0.15, delta);
    easing.damp(ref.current.scale, "y", combinedScale, 0.15, delta);

    easing.damp(focusZ, "current", targetFocusZ, 0.2, delta);
    easing.damp(curveZ, "current", targetCurveZ, 0.2, delta);
    easing.damp(
      transitionZ,
      "current",
      targetTransitionZ,
      CONFIG.transitionZDamp,
      delta
    );
    easing.damp(
      transitionY,
      "current",
      targetTransitionY,
      CONFIG.transitionYDamp,
      delta
    );

    ref.current.position.set(
      x,
      y + transitionY.current,
      curveZ.current + focusZ.current + transitionZ.current
    );

    easing.damp(rotationX, "current", rotX, 0.2, delta);
    easing.damp(rotationY, "current", rotY, 0.2, delta);

    ref.current.rotation.set(
      rotationX.current,
      rotationY.current,
      0
    );

    if (imageRef.current?.material) {
      let opacityDamp;
      const isFilterTransition =
        !matchesFilter || filterOpacity.current < 0.99;
      const isFocusRecovery =
        !isFocusMode && wasDimmedByFocus.current;

      if (isFilterTransition && gridVisible) {
        opacityDamp = CONFIG.filterOpacityDamp;
      } else if (isFocusRecovery && gridVisible) {
        opacityDamp = CONFIG.filterOpacityDamp;

        if (imageRef.current.material.opacity > 0.95) {
          wasDimmedByFocus.current = false;
        }
      } else if (gridVisible) {
        opacityDamp = CONFIG.enterOpacityDamp;
      } else {
        opacityDamp = CONFIG.exitOpacityDamp;
      }

      easing.damp(
        imageRef.current.material,
        "opacity",
        finalOpacity,
        opacityDamp,
        delta
      );
    }

    if (gridVisible) {
      const textTarget =
        targetTransitionOpacity < 0.8 ? 0 : targetTextOpacity;

      if (titleRef.current) {
        easing.damp(
          titleRef.current,
          "fillOpacity",
          textTarget,
          0.1,
          delta
        );
      }

      if (priceRef.current) {
        easing.damp(
          priceRef.current,
          "fillOpacity",
          textTarget,
          0.1,
          delta
        );
      }

      const isActiveItem = rigState.activeId === productId;
      const targetBreath = isActiveItem
        ? 1 + Math.sin(state.clock.elapsedTime * 2.0) * 0.035
        : 1;

      easing.damp(
        breathScale,
        "current",
        targetBreath,
        0.1,
        delta
      );

      if (titleRef.current) {
        titleRef.current.scale.setScalar(breathScale.current);
      }

      if (priceRef.current) {
        priceRef.current.scale.setScalar(breathScale.current);
      }
    }
  });

  const handleClick = (e) => {
    if (!interactive) return;

    if (rigState.isDragging) {
      e.stopPropagation();
      return;
    }

    e.stopPropagation();

    if (rigState.activeId === productId) {
      rigState.activeId = null;
    } else {
      const isZoomedOut = rigState.zoom > CONFIG.zoomIn + 2;
      rigState.target.set(-basePos.x, -basePos.y, 0);
      rigState.activeId = productId; // ✅ actual product id

      if (isZoomedOut) {
        rigState.zoom = CONFIG.zoomIn;
      }
    }
  };

  const textY = -(imageDims.height / 2) - 0.25;
  const isActive = rigState.activeId === productId;

  return (
    <group ref={ref}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <planeGeometry
          args={[
            imageDims.width * 1.1,
            imageDims.height * 1.1,
          ]}
        />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={imageRef} key={texture?.uuid}>
        <planeGeometry
          args={[
            imageDims.width,
            imageDims.height,
            16,
            16,
          ]}
        />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          opacity={1}
        />
      </mesh>

      {gridVisible && (
        <>
          <Text
            ref={titleRef}
            position={[0, textY, 0.01]}
            fontSize={0.1}
            color="#000"
            anchorY="top"
            anchorX="center"
            maxWidth={2.5}
            fillOpacity={0}
          >
            {data.title}
          </Text>

          {data.price && (
            <Text
              ref={priceRef}
              position={[0, textY - 0.22, 0.01]}
              fontSize={0.09}
              color="#555"
              anchorY="top"
              anchorX="center"
              fillOpacity={0}
            >
              {data.price}
            </Text>
          )}
        </>
      )}

      <CloseButton
        isActive={isActive}
        position={[
          imageDims.width / 2 - 0.15,
          imageDims.height / 2 - 0.15,
          0.02,
        ]}
        onClose={() => {
          rigState.activeId = null;
        }}
      />
    </group>
  );
}