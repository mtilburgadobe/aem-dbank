/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-pricing
 * Base block: table
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Structure: 2-column pricing table with header row (label + value)
 * Generated: 2026-05-20
 */
export default function parse(element, { document }) {
  // Find the table element within the source container
  const table = element.querySelector('table');
  if (!table) return;

  const cells = [];

  // Extract header row from thead
  const theadRow = table.querySelector('thead tr');
  if (theadRow) {
    const headerCells = Array.from(theadRow.querySelectorAll('th, td'));
    const headerContent = headerCells.map((cell) => {
      // Preserve inner content (bold text, etc.)
      const content = cell.innerHTML.trim();
      if (!content || content === '&nbsp;') return '';
      return cell.textContent.trim();
    });
    cells.push(headerContent);
  }

  // Extract data rows from tbody
  const tbodyRows = Array.from(table.querySelectorAll('tbody tr'));
  tbodyRows.forEach((row) => {
    const rowCells = Array.from(row.querySelectorAll('td'));
    const rowContent = rowCells.map((cell) => cell.textContent.trim());
    cells.push(rowContent);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-pricing', cells });
  element.replaceWith(block);
}
