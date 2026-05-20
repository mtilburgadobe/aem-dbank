/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product variant.
 * Base block: hero
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Selector: .dynamic-container-stage
 * Generated: 2026-05-20
 *
 * Structure (from block decoration logic):
 *   Row 1: Background image (picture element)
 *   Row 2: Overline + Heading + Subheading/description + CTA button(s)
 */
export default function parse(element, { document }) {
  // Extract background image (picture element wrapping the hero background)
  const picture = element.querySelector('picture');

  // Extract overline text
  const overline = element.querySelector('p.text-overline, .text-overline');

  // Extract main heading (h1 or h2)
  const heading = element.querySelector('h1, h2, .text-header h1, .text-header h2');

  // Extract description/subheading - the paragraph that is NOT the overline
  // It's inside the text section but outside the header
  const textSection = element.querySelector('section.text--large-font, section.comp');
  let description = null;
  if (textSection) {
    // Get paragraphs that are direct children of the section (not inside header)
    const paragraphs = textSection.querySelectorAll(':scope > p');
    if (paragraphs.length > 0) {
      description = paragraphs[0];
    }
  }

  // Extract CTA links
  const ctaLinks = Array.from(
    element.querySelectorAll('a.btn, a.btn--primary, .calltoaction a, a[class*="btn"]')
  );

  // Build cells array matching hero-product block structure
  const cells = [];

  // Row 1: Background image
  if (picture) {
    cells.push([picture]);
  }

  // Row 2: Content (overline + heading + description + CTAs)
  const contentCell = [];
  if (overline) {
    contentCell.push(overline);
  }
  if (heading) {
    contentCell.push(heading);
  }
  if (description) {
    contentCell.push(description);
  }
  if (ctaLinks.length > 0) {
    contentCell.push(...ctaLinks);
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
