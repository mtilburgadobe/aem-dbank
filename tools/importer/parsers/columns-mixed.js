/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-mixed
 * Base block: columns
 * Source: https://corporates.db.com/
 * Generated: 2026-05-20
 *
 * Layout: Two-column (66/33) with image cards on left and tag cloud on right.
 * Left column: Multiple image-background text boxes with image, linked heading, and CTA.
 * Right column: Tag cloud with linked keyword headings.
 *
 * Handles two row types:
 * - row-index-13: May contain a section heading or introductory content
 * - row-index-14: Contains the two-column layout with image cards + tag cloud
 */
export default function parse(element, { document }) {
  // Remove hidden-title spans that cause duplicate text
  element.querySelectorAll('.hidden-title').forEach((span) => span.remove());

  // Left column: extract image card items from .cms-column-66 or similar 2/3 column
  const leftColumnEl = element.querySelector('.cms-column-66, [class*="column-66"], [class*="col-8"]');
  const rightColumnEl = element.querySelector('.cms-column-33, [class*="column-33"], [class*="col-4"]');

  // If this element does not have the two-column structure, check for alternate content
  // (e.g. row-index-13 might be a section heading row)
  if (!leftColumnEl && !rightColumnEl) {
    // Look for a section/container headline
    const headline = element.querySelector('.container-headline h2, .container-headline h3, h2, h3');
    const description = element.querySelector('.container-headline p, .mod-text p, .cms-content p');

    // Build a single-column block with heading content if available
    const contentCell = [];
    if (headline) contentCell.push(headline);
    if (description) contentCell.push(description);

    // If no meaningful content found, replace with empty fragment (skip block)
    if (contentCell.length === 0) {
      const fragment = document.createDocumentFragment();
      element.replaceWith(fragment);
      return;
    }

    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-mixed', cells });
    element.replaceWith(block);
    return;
  }

  // Build left cell content: image cards from text boxes with background images
  const leftCell = [];
  if (leftColumnEl) {
    const textBoxes = leftColumnEl.querySelectorAll('.mod-text-box.type-image-background, .mod-text-box');
    textBoxes.forEach((box) => {
      // Extract image (try picture first, then img)
      const picture = box.querySelector('picture');
      const img = box.querySelector('img');
      if (picture) {
        leftCell.push(picture);
      } else if (img) {
        leftCell.push(img);
      }

      // Extract linked heading from content area
      const heading = box.querySelector('.content h2, .content h3, .content h1, .content-wrapper h2, .content-wrapper h3');
      if (heading) leftCell.push(heading);

      // Extract CTA button link (distinct from the heading link)
      const ctaLink = box.querySelector('.content > a.button, .content-wrapper > .content > a.button, a.button.type-icon');
      if (ctaLink) leftCell.push(ctaLink);
    });
  }

  // Build right cell content: tag cloud links
  const rightCell = [];
  if (rightColumnEl) {
    const tagWrappers = rightColumnEl.querySelectorAll('.tag-wrapper');
    if (tagWrappers.length > 0) {
      tagWrappers.forEach((wrapper) => {
        const link = wrapper.querySelector('a');
        if (link) {
          rightCell.push(link);
        }
      });
    } else {
      // Fallback: extract any links or content from the right column
      const links = rightColumnEl.querySelectorAll('a[href]');
      links.forEach((link) => {
        rightCell.push(link);
      });
    }
  }

  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-mixed', cells });
  element.replaceWith(block);
}
