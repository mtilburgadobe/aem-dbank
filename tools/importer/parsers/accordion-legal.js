/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-legal
 * Base block: accordion
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Generated: 2026-05-20
 *
 * Extracts accordion entries from source HTML with class "accordion--plusminus".
 * Each acc__entry becomes a row with [title, content] cells.
 * Handles single or multiple accordion entries within the container.
 */
export default function parse(element, { document }) {
  // Find all accordion entries within the element
  const entries = element.querySelectorAll(':scope .acc__entry, :scope > section.acc__entry');

  const cells = [];

  entries.forEach((entry) => {
    // Extract the accordion title from the header
    // Source uses h4.acc__entry-trigger-value, fallback to other heading levels or trigger text
    const titleEl = entry.querySelector(
      '.acc__entry-trigger-value, .acc__entry-headline h4, .acc__entry-headline h3, .acc__entry-headline h2, .acc__entry-trigger',
    );

    // Extract the accordion body content
    const contentEl = entry.querySelector('.acc__entry-content');

    if (titleEl && contentEl) {
      // Create a clean title element preserving the heading semantics
      const title = document.createElement('p');
      title.textContent = titleEl.textContent.trim();

      // Gather all meaningful content from the body
      // The content is nested in columncontrol wrappers; extract the text section
      const textSection = contentEl.querySelector('.text.comp--wrapper section, .text section, .acc__entry-content > div');
      const contentContainer = document.createElement('div');

      if (textSection) {
        // Clone all paragraphs and content from the text section
        const paragraphs = textSection.querySelectorAll('p, ul, ol, h2, h3, h4, h5, h6, table');
        paragraphs.forEach((p) => {
          contentContainer.appendChild(p.cloneNode(true));
        });
      } else {
        // Fallback: use all direct content from acc__entry-content
        const allContent = contentEl.querySelectorAll('p, ul, ol, h2, h3, h4, h5, h6, table');
        allContent.forEach((el) => {
          contentContainer.appendChild(el.cloneNode(true));
        });
      }

      cells.push([title, contentContainer]);
    }
  });

  // If no entries found, try a simpler structure (single accordion without .acc__entry wrapper)
  if (cells.length === 0) {
    const heading = element.querySelector('h2, h3, h4, .acc__entry-trigger-value');
    const content = element.querySelector('.acc__entry-content, .accordion-content');
    if (heading && content) {
      const title = document.createElement('p');
      title.textContent = heading.textContent.trim();
      cells.push([title, content]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-legal', cells });
  element.replaceWith(block);
}
