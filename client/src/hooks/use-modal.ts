import { useState, useCallback } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any | null>(null);

  const open = useCallback((modalData: any = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Clear data after a delay to prevent UI flicker
    setTimeout(() => setData(null), 300);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
  };
}
