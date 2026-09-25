import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Reading } from '@/data/types';

const READINGS_KEY = 'iching_readings';

export function useReadings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const readingsRef = useRef<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const commitReadings = useCallback(async (nextReadings: Reading[]) => {
    readingsRef.current = nextReadings;
    setReadings(nextReadings);
    await AsyncStorage.setItem(READINGS_KEY, JSON.stringify(nextReadings));
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadReadings = async () => {
      try {
        const stored = await AsyncStorage.getItem(READINGS_KEY);
        if (stored && mounted) {
          const parsed = JSON.parse(stored) as Reading[];
          readingsRef.current = parsed;
          setReadings(parsed);
        }
      } catch (error) {
        console.error('Failed to load readings:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void loadReadings();
    return () => {
      mounted = false;
    };
  }, []);

  const saveReading = useCallback(async (reading: Reading) => {
    try {
      const newReadings = [reading, ...readingsRef.current.filter((item) => item.id !== reading.id)];
      await commitReadings(newReadings);
    } catch (error) {
      console.error('Failed to save reading:', error);
    }
  }, [commitReadings]);

  const deleteReading = useCallback(async (id: string) => {
    try {
      await commitReadings(readingsRef.current.filter((reading) => reading.id !== id));
    } catch (error) {
      console.error('Failed to delete reading:', error);
    }
  }, [commitReadings]);

  const updateReading = useCallback(async (id: string, updates: Partial<Reading>) => {
    try {
      const newReadings = readingsRef.current.map((reading) =>
        reading.id === id ? { ...reading, ...updates } : reading,
      );
      await commitReadings(newReadings);
    } catch (error) {
      console.error('Failed to update reading:', error);
    }
  }, [commitReadings]);

  const getReading = useCallback((id: string) => {
    return readingsRef.current.find((reading) => reading.id === id);
  }, []);

  const clearAllReadings = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(READINGS_KEY);
      readingsRef.current = [];
      setReadings([]);
    } catch (error) {
      console.error('Failed to clear readings:', error);
    }
  }, []);

  return {
    readings,
    isLoading,
    saveReading,
    updateReading,
    getReading,
    deleteReading,
    clearAllReadings,
  };
}
