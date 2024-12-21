import { useState } from "react";

export function useOptimisticUpdate<T>(
  initialValue: T
): [T, (newValue: T, updateFn: () => Promise<void>) => Promise<void>] {
  const [currentValue, setCurrentValue] = useState<T>(initialValue);
  const [previousValue, setPreviousValue] = useState<T | null>(null);

  const updateValue = async (
    newValue: T,
    updateFn: () => Promise<void>
  ): Promise<void> => {
    const tempValue = newValue; // Optimistically update locally
    setPreviousValue(currentValue); // Backup the current value
    setCurrentValue(tempValue); // Optimistically update state
    console.log("Optimistic update:", tempValue);
    console.log("Optimistic currentValue", currentValue)

    try {
      await updateFn(); // Perform the server-side update
    } catch (error) {
      console.error("Optimistic update failed, rolling back:", error);
      if (previousValue !== null) {
        setCurrentValue(previousValue); // Roll back to the previous value
      }
    }
  };

  return [currentValue, updateValue];
}
