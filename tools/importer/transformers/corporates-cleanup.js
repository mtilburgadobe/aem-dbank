/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: corporates.db.com cleanup.
 * Removes non-authorable site chrome and global elements.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove modal overlay that could block parsing (line 1403: <section class="modal-layer">)
    WebImporter.DOMUtils.remove(element, ['.modal-layer']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header (line 3: <header class="cms-row">)
    WebImporter.DOMUtils.remove(element, ['header.cms-row']);

    // Remove customer navigation bar (line 63: <nav class="navigation-customer">)
    WebImporter.DOMUtils.remove(element, ['nav.navigation-customer']);

    // Remove main navigation (line 91: <nav class="navigation-main">)
    WebImporter.DOMUtils.remove(element, ['nav.navigation-main']);

    // Remove site footer (line 1344: <footer class="cms-row">)
    WebImporter.DOMUtils.remove(element, ['footer.cms-row']);

    // Remove back-to-top button (line 1389: <div class="footer-back-to-top">)
    WebImporter.DOMUtils.remove(element, ['.footer-back-to-top']);

    // Remove toolbox with search/share/subscribe widgets (line 1425: <div class="mod-toolbox">)
    WebImporter.DOMUtils.remove(element, ['.mod-toolbox']);
  }
}
