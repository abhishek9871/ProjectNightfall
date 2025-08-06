# Monetization Strategy & Operations Guide

## System Overview

### A/B Testing Strategy
This project implements a sophisticated A/B testing framework that automatically splits traffic between **ExoClick** and **PopAds** ad networks to determine which generates higher revenue. The system:

- Randomly assigns each user to either ExoClick or PopAds variant (50/50 split)
- Persists user assignments in localStorage for consistent experience
- Tracks all assignments and impressions in Google Analytics 4
- Supports both banner and popunder ad formats
- Operates transparently without affecting user experience

### MasterAdSlot Component Architecture
The `MasterAdSlot` component serves as the central controller for all ad placements:

1. **Variant Assignment**: Uses the `useAdExperiment` hook to determine which ad network to show
2. **Ad Type Handling**: Supports both `banner` and `popunder` ad types
3. **Network-Specific Rendering**: 
   - ExoClick users see banner ads via the existing API gateway
   - PopAds users see popunder ads via direct script integration
4. **Analytics Integration**: Automatically tracks impressions for performance analysis

## Configuration Checklist

### Critical: Replace Placeholder IDs in VideoGrid.tsx

**File**: `components/VideoGrid.tsx`

You must replace the following placeholder values with your actual ad network IDs:

#### Banner Ad Configuration (Line 145-149)
```typescript
<MasterAdSlot
    adType="banner"
    exoClickZoneId="YOUR_EXOCLICK_BANNER_ZONE_ID"  // ← REPLACE THIS
    popAdsSiteId={1234567} // PopAds doesn't have banners, so this is a placeholder
/>
```

#### Popunder Trigger #1 (Line 165-170)
```typescript
<MasterAdSlot
    adType="popunder"
    exoClickZoneId="YOUR_EXOCLICK_POPUNDER_ZONE_ID" // ← REPLACE THIS
    popAdsSiteId={1234567} // ← REPLACE THIS
/>
```

#### Popunder Trigger #2 (Line 178-182)
```typescript
<MasterAdSlot
    adType="popunder"
    exoClickZoneId="YOUR_EXOCLICK_POPUNDER_ZONE_ID" // ← REPLACE THIS
    popAdsSiteId={1234567} // ← REPLACE THIS
/>
```

#### Native Ad Configuration (Line 158)
```typescript
widgetZoneId="YOUR_EXOCLICK_NATIVE_ZONE_ID" // ← REPLACE THIS
```

### Required Actions:
1. **ExoClick Setup**: Create banner, popunder, and native ad zones in your ExoClick dashboard
2. **PopAds Setup**: Create a popunder site in your PopAds dashboard
3. **Replace IDs**: Update all placeholder IDs with your actual zone/site IDs
4. **Test**: Verify ads load correctly in both variants

## A/B Test Management

### Viewing Test Results in Google Analytics

1. **Navigate to GA4**: Go to your Google Analytics 4 property
2. **Access User Properties**: 
   - Go to `Configure` → `Custom Definitions` → `Custom Dimensions`
   - Look for `experiment_name` and `experiment_variant` properties
3. **Create Reports**:
   - Go to `Explore` → `Free Form`
   - Add `experiment_variant` as a dimension
   - Add revenue/conversion metrics as values
   - Filter by `experiment_name` contains "ExoClick-vs-PopAds"

### Key Metrics to Monitor:
- **Revenue per User** by variant
- **Click-through Rate** by variant  
- **Conversion Rate** by variant
- **User Engagement** by variant

### Declaring a Winner

Once you have statistically significant data (typically 2-4 weeks with sufficient traffic):

1. **Analyze Performance**: Compare revenue, CTR, and conversion metrics between variants
2. **Choose Winner**: Determine which network performs better
3. **Implement Winner**: 

#### To Make ExoClick the Winner:
Edit `components/ads/MasterAdSlot.tsx` around line 25-40:

```typescript
// Replace the switch statement with:
switch (variant) {
  case 'ExoClick':
  case 'PopAds':  // Force PopAds users to see ExoClick too
    if (adType === 'banner') {
      return <ExoClickZone zoneId={exoClickZoneId} />;
    }
    if (adType === 'popunder') {
      // Implement ExoClick popunder or return null
      return null;
    }
    return null;
  default:
    return null;
}
```

#### To Make PopAds the Winner:
```typescript
// Replace the switch statement with:
switch (variant) {
  case 'ExoClick':
  case 'PopAds':  // Force ExoClick users to see PopAds too
    if (adType === 'popunder') {
      return <PopAdsZone siteId={popAdsSiteId} />;
    }
    // PopAds doesn't do banners, so return null for banner requests
    return null;
  default:
    return null;
}
```

## Long-Term Maintenance

### Adding New Ad Networks

To add a third ad network (e.g., TrafficJunky) to the A/B test:

1. **Create New Component**: 
   - Create `components/ads/TrafficJunkyZone.tsx`
   - Implement the network's ad serving logic

2. **Update Hook**: Edit `src/hooks/useAdExperiment.ts`:
   ```typescript
   type Variant = 'ExoClick' | 'PopAds' | 'TrafficJunky';
   
   export const useAdExperiment = (
     experimentName: string,
     variants: Variant[] = ['ExoClick', 'PopAds', 'TrafficJunky']  // Add new variant
   ): Variant => {
   ```

3. **Update MasterAdSlot**: Edit `components/ads/MasterAdSlot.tsx`:
   ```typescript
   import { TrafficJunkyZone } from './TrafficJunkyZone';
   
   // Add new props
   interface MasterAdSlotProps {
     exoClickZoneId: string;
     popAdsSiteId: number;
     trafficJunkyZoneId: string;  // Add new prop
     adType: 'banner' | 'popunder';
   }
   
   // Add new case to switch statement
   case 'TrafficJunky':
     if (adType === 'banner') {
       return <TrafficJunkyZone zoneId={trafficJunkyZoneId} />;
     }
     return null;
   ```

4. **Update VideoGrid**: Add the new prop to all `<MasterAdSlot>` instances

### Performance Optimization Tips

1. **Monitor Load Times**: Track ad loading performance in GA4
2. **A/B Test Ad Positions**: Test different ad placements for optimal revenue
3. **Seasonal Adjustments**: Monitor performance during different seasons/events
4. **Mobile vs Desktop**: Consider separate A/B tests for different device types
5. **Geographic Targeting**: Analyze performance by country/region

### Troubleshooting Common Issues

- **Ads Not Loading**: Check browser console for JavaScript errors
- **Analytics Not Tracking**: Verify GA4 gtag is loaded before ad components
- **LocalStorage Issues**: Handle private browsing mode gracefully
- **Ad Blockers**: Monitor percentage of users with ad blockers enabled

---

**Last Updated**: January 2025  
**Framework Version**: 1.0  
**Compatible With**: React 19.1.0, TypeScript 5.7.2, Vite 6.2.0