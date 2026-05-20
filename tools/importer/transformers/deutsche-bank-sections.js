/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Deutsche Bank sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on
 * template section definitions from page-templates.json.
 * All section selectors verified from captured DOM (migration-work/cleaned.html).
 *
 * Sections (from template):
 *  1. Hero - selector: .stage-area (line 935)
 *  2. Introduction - selector: #parsys-columncontrol_365142-columnControlCol1Parsys-text_copy_copy_copy_ (line 1137)
 *  3. Key Benefits - selector: #parsys-columncontrol_365142-columnControlCol1Parsys-columncontrol (line 1150)
 *  4. Additional Features - selector: #parsys-columncontrol_263516-columnControlCol2Parsys-text_copy_copy (line 1263)
 *  5. Pricing - selector: #parsys-columncontrol_copy_c_1273061504-columnControlCol2Parsys-experiencefragment_1 (line 1416)
 *  6. Happy Hour Promo - selector: #happy-hour, style: grey (line 1534)
 *  7. How It Works - selector: #parsys-columncontrol_copy_c_2069414751-columnControlCol1Parsys-text (line 1600)
 *  8. Trading Comparison - selector: .comp--giga-tab (line 1750)
 *  9. Depot Switch Promo - selector: #parsys-columncontrol_487523, style: grey (line 1924)
 * 10. FAQ - selector: #root-accordion_905335099__470306153 (line 2154)
 * 11. Disclaimers - selector: .disclaimer (fallback: #parsys-text_copy_copy_10264, line 2352)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Fallback selectors for template selectors that don't match the DOM directly.
// Verified from captured DOM (migration-work/cleaned.html).
const SELECTOR_FALLBACKS = {
  '.disclaimer': '#parsys-text_copy_copy_10264',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      let sectionEl = element.querySelector(section.selector);

      // Use fallback selector if primary doesn't match
      if (!sectionEl && SELECTOR_FALLBACKS[section.selector]) {
        sectionEl = element.querySelector(SELECTOR_FALLBACKS[section.selector]);
      }

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
