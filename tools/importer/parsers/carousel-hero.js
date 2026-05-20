/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero
 * Base block: carousel
 * Source: https://corporates.db.com/
 * Selector: .mod-stage
 * Generated: 2026-05-20
 *
 * Extracts a hero carousel with multiple slides. Each slide has:
 * - Background image (figure.media img)
 * - Overheadline (p.stage-overheadline)
 * - Heading (h2)
 * - Optional description text (p.text)
 * - CTA button (a.button)
 *
 * Output: One row per slide with [image, content] columns.
 */
export default function parse(element, { document }) {
  // Each slide is an li.itm-stage inside ul.slider-wrapper
  const slides = element.querySelectorAll('ul.slider-wrapper > li.itm-stage, ul.slider-wrapper > li[class*="itm-stage"]');

  const cells = [];

  slides.forEach((slide) => {
    // Extract background image
    const img = slide.querySelector('figure.media img, figure img, .media img');

    // Build content cell
    const contentCell = [];

    // Overheadline
    const overheadline = slide.querySelector('p.stage-overheadline, .content-block > p:first-child');
    if (overheadline) {
      contentCell.push(overheadline);
    }

    // Heading
    const heading = slide.querySelector('h2, h1, h3');
    if (heading) {
      contentCell.push(heading);
    }

    // Optional description text (not the overheadline)
    const descriptionText = slide.querySelector('p.text, .content-block > p:not(.stage-overheadline)');
    if (descriptionText && descriptionText !== overheadline) {
      contentCell.push(descriptionText);
    }

    // CTA button(s)
    const ctaLinks = slide.querySelectorAll('.button-wrapper a.button, .button-wrapper a, a.button');
    ctaLinks.forEach((cta) => {
      // Remove hidden-title spans for cleaner output
      const hiddenTitle = cta.querySelector('span.hidden-title');
      if (hiddenTitle) {
        hiddenTitle.remove();
      }
      contentCell.push(cta);
    });

    // Build row: [image, content]
    const imageCell = img ? [img] : [''];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
