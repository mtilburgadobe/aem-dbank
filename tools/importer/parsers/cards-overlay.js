/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-overlay
 * Base block: cards
 * Source: https://corporates.db.com/
 * Generated: 2026-05-20
 *
 * Extracts overlay-style cards with background images, headings, and CTA links.
 * Each card has a background image with text overlaid on top.
 * The element passed is an individual .mod-text-box.type-image-background card.
 * Handles hidden-title spans that duplicate text in headings and links.
 */
export default function parse(element, { document }) {
  // The element is a single card (.mod-text-box.type-image-background)
  // Check if parent container has sibling cards to collect them all
  const parent = element.parentElement;
  const siblingCards = parent
    ? parent.querySelectorAll(':scope > .mod-text-box.type-image-background')
    : null;

  // Determine card set: if this element has siblings, collect all; otherwise just this one
  const cards = (siblingCards && siblingCards.length > 1) ? siblingCards : [element];

  const cells = [];

  cards.forEach((card) => {
    // Remove hidden-title spans before extracting content (they duplicate visible text)
    const hiddenTitles = card.querySelectorAll('span.hidden-title');
    hiddenTitles.forEach((span) => span.remove());

    // Extract background image from .media figure img
    const image = card.querySelector('.media figure img, .media img, figure img, img');

    // Extract heading (h2 with link inside)
    const heading = card.querySelector('.content-wrapper .content h2, .content h2, h2');

    // Extract CTA button link (separate from heading link)
    const ctaLink = card.querySelector('.content-wrapper .content > a.button, .content > a.button, a.button');

    // Only add row if card has meaningful content
    if (image || heading || ctaLink) {
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (ctaLink) contentCell.push(ctaLink);

      cells.push([image || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  // Only create the block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-overlay', cells });
    element.replaceWith(block);
  }
}
