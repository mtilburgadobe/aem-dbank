/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-comparison variant.
 * Base block: tabs
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Generated: 2026-05-20
 *
 * Extracts tabbed comparison content from a .giga-tab component.
 * Each tab entry provides a label and its corresponding panel provides
 * rich content (headings, lists, paragraphs, links, images).
 *
 * Target block structure (per tab):
 *   Row: [tab-label-text, panel-content]
 * The block JS expects firstElementChild of each row to be the tab label,
 * and the remaining content becomes the panel.
 */
export default function parse(element, { document }) {
  // Extract tab labels from .giga-tab__entry elements
  const entries = element.querySelectorAll('.giga-tab__entry');
  // Extract tab panels from .giga-tab__panel elements
  const panels = element.querySelectorAll('.giga-tab__panel');

  const cells = [];

  entries.forEach((entry, index) => {
    // Get tab label text
    const headlineEl = entry.querySelector(
      '.giga-tab__entry__text__headline, .giga-tab__entry__text p, .giga-tab__entry__text'
    );
    const labelText = headlineEl ? headlineEl.textContent.trim() : `Tab ${index + 1}`;

    // Create a label element for the first cell
    const label = document.createElement('p');
    label.textContent = labelText;

    // Build panel content from corresponding panel
    const panel = panels[index];
    const contentCell = [];

    if (panel) {
      // Extract all meaningful content from the panel:
      // headings, paragraphs, lists, links/CTAs, images
      const headings = panel.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = panel.querySelectorAll('p');
      const lists = panel.querySelectorAll('ul, ol');
      const links = panel.querySelectorAll('a.btn, a.calltoaction, .calltoaction a');
      const images = panel.querySelectorAll('img');

      // Walk through content sections in order to preserve structure
      // Panel has sections with headings + content (text, lists)
      const sections = panel.querySelectorAll('section.comp');

      if (sections.length > 0) {
        sections.forEach((section) => {
          // Clone section content elements to preserve them
          const sectionHeadings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const sectionParagraphs = section.querySelectorAll('p');
          const sectionLists = section.querySelectorAll('ul, ol');

          sectionHeadings.forEach((h) => contentCell.push(h));
          sectionParagraphs.forEach((p) => contentCell.push(p));
          sectionLists.forEach((list) => contentCell.push(list));
        });
      } else {
        // Fallback: grab all content directly
        headings.forEach((h) => contentCell.push(h));
        paragraphs.forEach((p) => contentCell.push(p));
        lists.forEach((list) => contentCell.push(list));
      }

      // Add CTA links
      links.forEach((link) => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim() || link.getAttribute('title') || '';
        contentCell.push(a);
      });

      // Add images
      images.forEach((img) => contentCell.push(img));
    }

    // Each row: [tab label, panel content]
    cells.push([[label], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-comparison', cells });
  element.replaceWith(block);
}
