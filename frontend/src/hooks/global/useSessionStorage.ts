import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface IUseSessionStorage<T> {
  key: string;
  defaultValue: T;
  clear?: boolean;
}

export function useSessionStorage<T>({
  defaultValue,
  key,
  clear,
}: IUseSessionStorage<T>): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [isSwitcherLoading, setIsLoading] = useState(true);

  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item && !clear) {
        setValue(JSON.parse(item));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [key]);

  useEffect(() => {
    if (isMounted.current || clear) {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value]);

  return [value, setValue, isSwitcherLoading];
}
