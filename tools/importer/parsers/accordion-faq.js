/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq
 * Base block: accordion
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Selector: #root-accordion_905335099__470306153
 * Generated: 2026-05-20
 *
 * Structure: Each row = [question heading, answer content]
 * Source pattern: section.acc__entry > header h3 (question) + .acc__entry-content (answer)
 */
export default function parse(element, { document }) {
  // Each accordion entry is a section.acc__entry
  const entries = element.querySelectorAll(':scope > .acc__entry');

  const cells = [];

  entries.forEach((entry) => {
    // Extract the question heading from the entry header
    const heading = entry.querySelector('.acc__entry-trigger-value, h3, h2');

    // Extract the answer content from the collapsed/expanded content area
    const contentSection = entry.querySelector('.acc__entry-content .comp, .acc__entry-content .text');

    // Build the question cell - create a clean heading element
    const questionCell = [];
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      questionCell.push(h3);
    }

    // Build the answer cell - collect all paragraph/content elements
    const answerCell = [];
    if (contentSection) {
      const contentElements = contentSection.querySelectorAll('p, ul, ol, h4, h5, h6');
      contentElements.forEach((el) => {
        answerCell.push(el);
      });
    }

    // Only add row if we have at least a question
    if (questionCell.length > 0) {
      cells.push([questionCell, answerCell.length > 0 ? answerCell : ['']]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
