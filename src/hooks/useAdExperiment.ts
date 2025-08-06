// src/hooks/useAdExperiment.ts
import { useState, useEffect } from 'react';
import { setUserExperimentProperties } from '../services/AnalyticsService';

type Variant = 'ExoClick' | 'PopAds';

export const useAdExperiment = (
  experimentName: string,
  variants: Variant[] = ['ExoClick', 'PopAds']
): Variant => {
  const getLocalStorageKey = (name: string) => `ab-test-${name}`;

  const [assignedVariant, setAssignedVariant] = useState<Variant>(() => {
    try {
      if (typeof window !== 'undefined') {
        const key = getLocalStorageKey(experimentName);
        const savedVariant = window.localStorage.getItem(key);
        if (savedVariant && variants.includes(savedVariant as Variant)) {
          return savedVariant as Variant;
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return variants[0];
  });

  useEffect(() => {
    const key = getLocalStorageKey(experimentName);
    try {
      const savedVariant = window.localStorage.getItem(key);
      if (savedVariant && variants.includes(savedVariant as Variant)) {
        if (savedVariant !== assignedVariant) {
          setAssignedVariant(savedVariant as Variant);
        }
      } else {
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        window.localStorage.setItem(key, randomVariant);
        setAssignedVariant(randomVariant);
        setUserExperimentProperties(experimentName, randomVariant);
      }
    } catch (error) {
      console.error('Error interacting with localStorage:', error);
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      setAssignedVariant(randomVariant);
      setUserExperimentProperties(experimentName, randomVariant);
    }
  }, [experimentName, variants, assignedVariant]);

  return assignedVariant;
};