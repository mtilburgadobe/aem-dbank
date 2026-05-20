/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: corporates.db.com sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Template sections (from page-templates.json corporates-homepage):
 *   section-1: .cms-row.row-index-1 (Hero) - no style
 *   section-2: .cms-row.row-index-2 (Introduction) - no style
 *   section-3: .cms-row.row-index-4 (Solutions Grid) - style: grey
 *   section-4: .cms-row.row-index-11 (Feature Cards) - no style
 *   section-5: [".cms-row.row-index-13", ".cms-row.row-index-14"] (Stay Updated) - no style
 *   section-6: .cms-row.row-index-15 (Flow Banner) - no style
 *   section-7: .cms-row.row-index-16 (Awards) - style: grey
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      // Find the section element - handle both string and array selectors
      let sectionEl = null;
      if (Array.isArray(section.selector)) {
        // For array selectors, use the first matching selector
        for (const sel of section.selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else {
        sectionEl = element.querySelector(section.selector);
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
