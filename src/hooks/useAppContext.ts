import { createContext, useContext } from 'react';
import type { useAppState } from '@/hooks/useAppState';

type AppContextType = ReturnType<typeof useAppState>;

export const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppContext.Provider');
  return ctx;
}
