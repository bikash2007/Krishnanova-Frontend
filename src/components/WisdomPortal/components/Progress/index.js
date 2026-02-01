// Bhakti Progress System Exports
// This module provides the spiritual progression tracking system with backend integration

// Context and Provider
export {
  BhaktiProgressProvider,
  useBhaktiProgress,
} from "./BhaktiProgressContext";

// Bhakti Pillars Components
export {
  BhaktiPillars,
  BhaktiPillarsConnected,
  BHAKTI_PILLARS,
  DEVOTEE_STAGES,
  PILLAR_ICONS,
  PILLAR_COLORS,
} from "./BhaktiPillars";

// Lila Map Components
export {
  LilaMap,
  LilaMapConnected,
  LILA_LOCATIONS,
  LOCATION_ICONS,
  LOCATION_COLORS,
  enrichLocation,
} from "./LilaMap";

// Default export - the provider wrapper for the whole system
export { BhaktiProgressProvider as default } from "./BhaktiProgressContext";
