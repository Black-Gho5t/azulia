/**
 * Browser Translation Protection for Material Symbols & Material Icons
 * Prevents Google Translate, Edge, and other translation engines from translating icon ligatures.
 */
export function initIconProtection(): void {
  if (typeof window === 'undefined') return;

  const ICON_SELECTOR = '.material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp, .material-icons';
  const ICON_FONT = "'Material Symbols Outlined'";

  function protectElement(el: HTMLElement): void {
    // 1. Enforce translation prevention attributes and classes
    if (el.getAttribute('translate') !== 'no') {
      el.setAttribute('translate', 'no');
    }
    if (!el.classList.contains('notranslate')) {
      el.classList.add('notranslate');
    }

    // 2. Cache the original ligature name
    if (!el.dataset.originalIcon) {
      const text = el.textContent?.trim();
      if (text && !text.includes(' ') && text.length > 0) {
        el.dataset.originalIcon = text;
      }
    }

    // 3. If translation or font tags replaced the text, restore the ligature
    const cached = el.dataset.originalIcon;
    if (cached) {
      const current = el.textContent?.trim();
      if (current !== cached || el.querySelector('font')) {
        el.textContent = cached;
      }
    }

    // 4. Ensure font family is not overridden
    if (el.style.fontFamily !== ICON_FONT) {
      el.style.fontFamily = ICON_FONT;
    }
  }

  function scan(root: ParentNode | null): void {
    if (!root) return;
    if (root instanceof HTMLElement && root.matches(ICON_SELECTOR)) {
      protectElement(root);
    }
    root.querySelectorAll<HTMLElement>(ICON_SELECTOR).forEach(protectElement);
  }

  // Scan immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan(document.body || document.documentElement), { once: true });
  } else {
    scan(document.body || document.documentElement);
  }

  // Watch for dynamic DOM additions and Google Translate DOM modifications
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of Array.from(m.addedNodes)) {
        if (node.nodeType === 1) {
          scan(node as HTMLElement);
        }
      }

      if (m.type === 'characterData' || m.type === 'childList') {
        const target = m.target as Node;
        const element = target.nodeType === 1 ? (target as HTMLElement) : target.parentElement;
        const iconEl = element?.closest<HTMLElement>(ICON_SELECTOR);
        if (iconEl) {
          protectElement(iconEl);
        }
      }
    }
  });

  const rootEl = document.body || document.documentElement;
  if (rootEl) {
    observer.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}

// Auto-run when imported in browser
if (typeof window !== 'undefined') {
  initIconProtection();
}
