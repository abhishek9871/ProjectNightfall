# Unified Ad Engine Documentation

## Overview

The Unified Ad Engine (`AdEngineProvider`) is a centralized system that governs all ad formats in the Project Nightfall application. It prevents ad conflicts, enforces frequency caps, and protects the user experience by implementing master rules across all ad types.

## Architecture

### Core Components

1. **AdEngineContext** (`src/contexts/AdEngineContext.tsx`)
   - Central state management for ad sessions
   - Master rules enforcement
   - Frequency cap integration

2. **AdEngineProvider** 
   - React Context Provider wrapping the entire application
   - Session state tracking using `useRef` for performance

3. **useAdEngine Hook**
   - Consumer hook for components to interact with the ad engine
   - Provides trigger functions for different ad types

## Ad Types and Rules

### 1. Pre-Roll Ads
- **Trigger**: Video card clicks
- **Rule**: Always allowed (no restrictions)
- **Session Tracking**: Flags session state to block popunders
- **Implementation**: `triggerPreRoll()`

### 2. Interstitial Ads
- **Trigger**: Navigation from home page
- **Rule**: Once per session only
- **Session Tracking**: Flags session state to block popunders
- **Implementation**: `triggerInterstitial(onSuccess)`

### 3. Popunder Ads (Exit Intent)
- **Trigger**: User exit intent
- **Rules**: 
  - Blocked if pre-roll OR interstitial shown this session
  - 12-hour frequency cap via localStorage
- **Implementation**: `triggerPopunder()`

### 4. In-Page Ads (Banners/Native)
- **Management**: Local to VideoGrid component
- **Rule**: No restrictions (always shown)

## Master Rules Hierarchy

```
1. Session Rules (Highest Priority)
   - Pre-roll blocks popunder for session
   - Interstitial blocks popunder for session
   - Interstitial: once per session only

2. Frequency Caps (Medium Priority)
   - Popunder: 12-hour localStorage cap

3. Always Allowed (Lowest Priority)
   - Pre-roll ads
   - In-page banner/native ads
```

## Implementation Details

### Session State Management

```typescript
interface AdSessionState {
  hasSeenPreRollThisSession: boolean;
  hasSeenInterstitialThisSession: boolean;
}
```

### Key Functions

#### `triggerPreRoll(): boolean`
- Always returns `true`
- Sets session flag to block popunders
- Used in video card click handlers

#### `triggerInterstitial(onSuccess: () => void): void`
- Checks if already shown this session
- Calls `onSuccess` callback if allowed
- Sets session flag to block popunders

#### `triggerPopunder(): boolean`
- Checks session flags (pre-roll/interstitial)
- Checks 12-hour frequency cap
- Records impression if allowed
- Returns `true` if ad should show

## Integration Points

### App.tsx
```typescript
// Wrap entire app
<AdEngineProvider>
  <AppContent />
</AdEngineProvider>

// Use in components
const { triggerPreRoll, triggerInterstitial } = useAdEngine();
```

### AdStrategyProvider.tsx
```typescript
// Exit intent popunder
const { triggerPopunder } = useAdEngine();

const executeWaterfall = async () => {
  if (triggerPopunder()) {
    // Execute ad waterfall
  }
};
```

## Benefits

1. **Conflict Prevention**: No multiple ads shown simultaneously
2. **User Experience**: Respects frequency caps and session limits
3. **Revenue Optimization**: Strategic ad placement without overwhelming users
4. **Centralized Control**: Single source of truth for all ad logic
5. **Easy Debugging**: Centralized logging and state management

## Testing

### Console Logs
- `AdEngine: Pre-roll triggered.`
- `AdEngine: Interstitial triggered.`
- `AdEngine: Popunder allowed.`
- `AdEngine: Popunder blocked (Pre-Roll/Interstitial seen this session).`
- `AdEngine: Popunder blocked (12-hour frequency cap).`

### Test Scenarios
1. Click video → Pre-roll shows → Exit intent → Popunder blocked
2. Navigate from home → Interstitial shows → Exit intent → Popunder blocked
3. Fresh session + no recent popunder → Exit intent → Popunder allowed

## Migration Notes

### Before (Fragmented)
- Each ad type managed its own state
- No coordination between ad formats
- Potential for ad conflicts and poor UX

### After (Unified)
- Single AdEngine controls all ad logic
- Master rules prevent conflicts
- Centralized session and frequency management
- Better user experience and revenue optimization

## Future Enhancements

1. **Analytics Integration**: Track ad performance by type
2. **A/B Testing**: Different rule sets for optimization
3. **Dynamic Rules**: Server-controlled ad policies
4. **Advanced Targeting**: User behavior-based ad selection
5. **Revenue Optimization**: ML-driven ad placement decisions