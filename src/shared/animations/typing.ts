// animations/textAnimations.ts
import { gsap } from "gsap";

/**
 * Creates a typing animation with customizable parameters
 * @param element The text element to animate
 * @param text The text to type
 * @param options Configuration options
 * @returns GSAP Timeline instance
 */
export const createTypingAnimation = (
  element: HTMLElement | null,
  text: string,
  options: {
    charDuration?: number;
    cursorElement?: HTMLElement | null;
    onComplete?: () => void;
  } = {}
) => {
  if (!element) return gsap.timeline();

  const { charDuration = 0.03, cursorElement, onComplete } = options;

  const tl = gsap.timeline({ onComplete });

  // Make cursor visible during typing if provided
  if (cursorElement) {
    tl.set(cursorElement, { opacity: 1, visibility: "visible" });
  }

  // Clear the element
  tl.set(element, { textContent: "", opacity: 1 });

  // Type each character with a slight delay
  const chars = text.split("");
  chars.forEach((_, index) => {
    tl.to(
      {},
      {
        duration: charDuration,
        onComplete: () => {
          if (element) {
            element.textContent = text.substring(0, index + 1);
            element.style.opacity = "1";
          }
        },
      }
    );
  });

  return tl;
};

/**
 * Creates a backspace/delete animation
 * @param element The text element to animate
 * @param text The starting text to delete from
 * @param options Configuration options
 * @returns GSAP Timeline instance
 */

export const createBackspaceAnimation = (
  element: HTMLElement | null,
  text: string,
  options: {
    charDuration?: number;
    cursorElement?: HTMLElement | null;
    onComplete?: () => void;
    deleteCount?: number;
  } = {}
) => {
  if (!element) return gsap.timeline();

  const {
    charDuration = 0.05,
    cursorElement,
    onComplete,
    deleteCount = text.length,
  } = options;

  const tl = gsap.timeline({ onComplete });

  // Make cursor visible during deletion if provided
  if (cursorElement) {
    tl.set(cursorElement, { opacity: 1, visibility: "visible" });
  }

  // Set initial text
  tl.set(element, { textContent: text, opacity: 1 });

  // Delete characters one by one
  const charsToDelete = Math.min(deleteCount, text.length);
  for (let i = 0; i < charsToDelete; i++) {
    const remainingText = text.substring(0, text.length - i - 1);
    tl.to(
      {},
      {
        duration: charDuration,
        onComplete: () => {
          if (element) {
            element.textContent = remainingText;
            element.style.opacity = "1";
          }
        },
      }
    );
  }

  return tl;
};

/**
 * Creates a text transition animation (replaces current text with new text)
 * @param element The text element to animate
 * @param currentText The current text in the element
 * @param newText The new text to transition to
 * @param options Configuration options
 * @returns GSAP Timeline instance
 */
export const createTextTransitionAnimation = (
  element: HTMLElement | null,
  currentText: string,
  newText: string,
  options: {
    typingDuration?: number;
    deleteDuration?: number;
    fadeOutDuration?: number;
    cursorElement?: HTMLElement | null;
    onComplete?: () => void;
  } = {}
) => {
  if (!element) return gsap.timeline();

  const {
    typingDuration = 0.03,
    deleteDuration = 0.05,
    fadeOutDuration = 0.2,
    cursorElement,
    onComplete,
  } = options;

  const tl = gsap.timeline({ onComplete });

  // Make cursor visible during transition if provided
  if (cursorElement) {
    tl.set(cursorElement, { opacity: 1, visibility: "visible" });
  }

  // If text is empty, just type the new text
  if (!currentText) {
    return createTypingAnimation(element, newText, {
      charDuration: typingDuration,
      cursorElement,
      onComplete,
    });
  }

  // If new text is empty, just delete the current text
  if (!newText) {
    return createBackspaceAnimation(element, currentText, {
      charDuration: deleteDuration,
      cursorElement,
      onComplete,
    });
  }

  // Find common prefix
  let sharedPrefixLength = 0;
  while (
    sharedPrefixLength < Math.min(currentText.length, newText.length) &&
    currentText[sharedPrefixLength] === newText[sharedPrefixLength]
  ) {
    sharedPrefixLength++;
  }

  // If new text contains the current text as prefix, just add the remaining characters
  if (sharedPrefixLength === currentText.length) {
    // Just add the new characters
    const remainingText = newText.substring(sharedPrefixLength);
    const chars = remainingText.split("");

    tl.set(element, { textContent: currentText, opacity: 1 });

    chars.forEach((_, index) => {
      tl.to(
        {},
        {
          duration: typingDuration,
          onComplete: () => {
            if (element) {
              element.textContent =
                currentText + remainingText.substring(0, index + 1);
              element.style.opacity = "1";
            }
          },
        }
      );
    });

    return tl;
  }

  // If they share a prefix but diverge, delete from divergence point and type new content
  if (sharedPrefixLength > 0) {
    const commonPrefix = currentText.substring(0, sharedPrefixLength);
    const textToDelete = currentText.substring(sharedPrefixLength);
    const textToType = newText.substring(sharedPrefixLength);

    // Delete everything after the common prefix
    for (let i = 0; i < textToDelete.length; i++) {
      const remainingText = currentText.substring(
        0,
        currentText.length - i - 1
      );
      tl.to(
        {},
        {
          duration: deleteDuration,
          onComplete: () => {
            if (element) {
              element.textContent = remainingText;
              element.style.opacity = "1";
            }
          },
        }
      );
    }

    // Type the new part
    const charsToType = textToType.split("");
    charsToType.forEach((_, index) => {
      tl.to(
        {},
        {
          duration: typingDuration,
          onComplete: () => {
            if (element) {
              element.textContent =
                commonPrefix + textToType.substring(0, index + 1);
              element.style.opacity = "1";
            }
          },
        }
      );
    });

    return tl;
  }

  // Completely different texts, fade out and retype
  tl.to(element, {
    opacity: 0,
    duration: fadeOutDuration,
    onComplete: () => {
      if (element) {
        element.textContent = "";
      }
    },
  });

  // Type the new text
  const chars = newText.split("");
  chars.forEach((_, index) => {
    tl.to(
      {},
      {
        duration: typingDuration,
        onComplete: () => {
          if (element) {
            element.textContent = newText.substring(0, index + 1);
            element.style.opacity = "1";
          }
        },
      }
    );
  });

  return tl;
};

// Helper to set up cursor blinking
export const setupCursorBlinking = (cursorElement: HTMLElement | null) => {
  if (!cursorElement) return null;

  return gsap.to(cursorElement, {
    opacity: 0,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
};
