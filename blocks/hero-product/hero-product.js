export default function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows[0];
  const img = firstRow?.querySelector('img');

  if (img && img.src) {
    block.style.backgroundImage = `url(${img.src})`;
    firstRow.remove();
  } else {
    block.classList.add('no-image');
  }
}
