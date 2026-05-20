/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://corporates.db.com/
 * Selector: .cms-row.row-index-15 .mod-text-box.type-image-background
 * Generated: 2026-05-20
 *
 * Structure:
 *   Row 1: Background image
 *   Row 2: Eyebrow heading (h3), main heading (h2 with link), description, CTA button
 */
export default function parse(element, { document }) {
  // Remove hidden-title spans that duplicate visible text (accessibility artifacts)
  element.querySelectorAll('span.hidden-title').forEach((span) => span.remove());

  // Extract background image from .media figure
  const bgImage = element.querySelector('.media img, figure.mod-img-loader img');

  // Extract eyebrow/overline heading (h3 in content-wrapper)
  const eyebrow = element.querySelector('.content-wrapper > h3');

  // Extract main heading (h2 inside .content)
  const mainHeading = element.querySelector('.content h2');

  // Extract description paragraph
  const description = element.querySelector('.content p.text, .content > p');

  // Extract CTA button link
  const ctaButton = element.querySelector('.content a.button, .content > a');

  // Build cells array matching hero-banner table structure
  // Each entry in cells is a row; each row is an array of columns.
  // For a single-column block, each row has one cell (which can contain multiple elements).
  const cells = [];

  // Row 1: Background image (if present)
  if (bgImage) {
    cells.push([[bgImage]]);
  }

  // Row 2: Single cell with all content (heading, description, CTA stacked)
  const contentElements = [];
  if (eyebrow) contentElements.push(eyebrow);
  if (mainHeading) contentElements.push(mainHeading);
  if (description) contentElements.push(description);
  if (ctaButton) contentElements.push(ctaButton);
  if (contentElements.length > 0) {
    cells.push([contentElements]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
