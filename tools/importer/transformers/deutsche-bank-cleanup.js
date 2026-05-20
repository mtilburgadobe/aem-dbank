/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Deutsche Bank cleanup.
 * Removes non-authorable site chrome: navigation, header, footer, flyouts,
 * content nav, disclaimer dialogs, and leftover elements.
 * All selectors verified from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove skip-navigation links (nav.tabnav)
    // Found: <nav class="tabnav"> at line 4
    WebImporter.DOMUtils.remove(element, [
      'nav.tabnav',
    ]);

    // Remove complement navigations bar (help-nav + meta-nav)
    // Found: <div class="complement-navigations theme-dark"> at line 22
    WebImporter.DOMUtils.remove(element, [
      '.complement-navigations',
    ]);

    // Remove flyouts sidebar (contact, language, branch, appointment, scroll-top)
    // Found: <nav id="flyouts" class="flyouts"> at line 891
    WebImporter.DOMUtils.remove(element, [
      '#flyouts',
    ]);

    // Remove content navigation (sticky sub-nav within page)
    // Found: <div class="contentNavigation"> at line 999
    WebImporter.DOMUtils.remove(element, [
      '.contentNavigation',
    ]);

    // Remove toggle-display-container (empty wrappers)
    // Found: <div class="toggle-display-container"> at lines 997, 2349
    WebImporter.DOMUtils.remove(element, [
      '.toggle-display-container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header (logo, search, main navigation, service navigation)
    // Found: <header class="header theme-dark js-sticky-helper header--minimized"> at line 95
    WebImporter.DOMUtils.remove(element, [
      'header.header',
    ]);

    // Remove site footer
    // Found: <footer class="footer-area footer-area--default theme-dark"> at line 2420
    WebImporter.DOMUtils.remove(element, [
      'footer.footer-area',
    ]);

    // Remove disclaimer dialogs (video disclaimer, external links disclaimer)
    // Found: <dialog class="disclaimer-layer comp disclaimer-layer-js theme-light"> at line 2388
    // Found: <dialog class="disclaimer-layer disclaimer-container ..."> at line 2403
    WebImporter.DOMUtils.remove(element, [
      'dialog.disclaimer-layer',
    ]);

    // Remove empty newpar/section divs and inherited parsys wrappers outside main content
    // Found: <div class="newpar new section"> at line 19
    // Found: <div class="par iparys_inherited"> at line 21 (contains header/complement-navs)
    // Note: Only remove top-level ones that wrap non-authorable content (already empty after header/footer removal)

    // Remove iframes, link elements, and noscript tags
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove source elements (from picture tags - importer handles images separately)
    WebImporter.DOMUtils.remove(element, [
      'source',
    ]);

    // Clean up tracking and event attributes from all elements
    element.querySelectorAll('[data-track]').forEach((el) => {
      el.removeAttribute('data-track');
    });
    element.querySelectorAll('[onclick]').forEach((el) => {
      el.removeAttribute('onclick');
    });
    element.querySelectorAll('[data-analytics]').forEach((el) => {
      el.removeAttribute('data-analytics');
    });
  }
}
