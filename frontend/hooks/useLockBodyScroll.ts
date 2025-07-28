import { useLayoutEffect } from "react";

export function useLockBodyScroll(lock: boolean) {
  useLayoutEffect(() => {
    if (lock) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [lock]);
}
