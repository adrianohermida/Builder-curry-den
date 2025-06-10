/**
 * 🔧 USE LOCAL STORAGE HOOK
 *
 * Hook para gerenciar estado sincronizado com localStorage
 */

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // State para armazenar nosso valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Busca do localStorage pela chave
      if (typeof window === "undefined") {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      // Analisa o JSON armazenado ou retorna o valor inicial se não existir
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro, retorna o valor inicial
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para definir o valor
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        // Permite que o valor seja uma função para que tenhamos a mesma API que useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Salva no state
        setStoredValue(valueToStore);

        // Salva no localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // Uma implementação mais robusta registraria o erro em um serviço de relatório de erros
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Escuta mudanças no localStorage de outras abas/janelas
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
