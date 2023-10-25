/** Based on:
 * https://medium.com/react-in-the-real-world/10-clever-custom-react-hooks-you-need-to-know-about-574746a3641d&sca_esv=563733001&strip=1&vwsrc=0
 * */

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Debounces a given value with a specified delay.
 **/
export const useDebounce = (value: never, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Stores the previous value of a given variable.
 * This can be handy when you need to compare the current value with the previous one,
 * like to detect changes in a form or a list of data.
 **/
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * Simplifies working with localStorage.
 * It provides a clean interface for getting and setting values in localStorage
 * while handling JSON serialization and error handling.
 **/
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Allow to toggle a boolean value.
 **/
export const useToggle = (initialValue: boolean): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);

  const toggleValue = useCallback(() => {
    setValue((prevValue) => !prevValue);
  }, []);

  return [value, toggleValue];
};

/**
 * Listen for a specific key press and returns a boolean indicating whether the key is currently pressed.
 * This is useful when building keyboard shortcuts or handling keyboard navigation.
 **/
export const useKeyPress = (targetKey: string): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    },
    [targetKey],
  );

  const upHandler = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    },
    [targetKey],
  );

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, targetKey, upHandler]);

  return keyPressed;
};

/**
 * Allow to run a function at a specified interval
 **/
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
};

/**
 *  Returns the current window size.
 **/
export const useWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

/**
 * Simplifies copying text to the clipboard.
 * Returns a boolean that indicates whether the text has been copied and
 * a function that accepts the text to be copied.
 * After copying, it automatically resets the boolean to false after 2 seconds,
 * making it easy to provide user feedback.
 **/
export const useCopyToClipboard = (): [boolean, (text: string) => void] => {
  const [isCopied, setIsCopied] = useState(false);

  const copyTextToClipboard = useCallback(async (text: string) => {
    if (navigator?.clipboard?.writeText) {
      setIsCopied(true);
      await navigator.clipboard.writeText(text);
      return;
    }
    setIsCopied(false);
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw "The Clipboard API is not available.";
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isCopied]);

  return [isCopied, copyTextToClipboard];
};

/**
 * Simplifies adding and removing event listeners.
 * It takes an event name, a handler function, and an optional element (defaulting to window).
 * This hook automatically handles adding and removing the event listener when
 * the component mounts and unmounts, ensuring proper cleanup.
 **/
export const useEventListener = (
  eventName: string,
  handler: EventListener,
  element: HTMLElement | Window = window,
) => {
  const savedHandler = useRef<EventListener>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event);
      }
    };

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};
