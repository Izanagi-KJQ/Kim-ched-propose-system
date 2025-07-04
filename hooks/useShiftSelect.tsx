import { useRef } from 'react';

interface UseShiftSelectProps<T> {
  items: T[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  getId?: (item: T) => string;
}

export function useShiftSelect<T>({
  items,
  selectedIds,
  setSelectedIds,
  getId = (item: T) => (item as any).id,
}: UseShiftSelectProps<T>) {
  const lastSelectedIndex = useRef<number | null>(null);

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, item: T) => {
    const id = getId(item);
    const idx = items.findIndex((i) => getId(i) === id);
    const shiftKey = (e.nativeEvent as any).shiftKey;
    if (shiftKey && lastSelectedIndex.current !== null) {
      const start = Math.min(lastSelectedIndex.current, idx);
      const end = Math.max(lastSelectedIndex.current, idx);
      const rangeIds = items.slice(start, end + 1).map(getId);
      const newSelected = Array.from(new Set([...selectedIds, ...rangeIds]));
      setSelectedIds(newSelected);
    } else {
      if (e.target.checked) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      }
      lastSelectedIndex.current = idx;
    }
  };

  const onSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map(getId));
    } else {
      setSelectedIds([]);
    }
  };

  return { onCheckboxChange, onSelectAll, selectedIds };
} 