/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-investment-product-page.js
  var import_investment_product_page_exports = {};
  __export(import_investment_product_page_exports, {
    default: () => import_investment_product_page_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document }) {
    const picture = element.querySelector("picture");
    const overline = element.querySelector("p.text-overline, .text-overline");
    const heading = element.querySelector("h1, h2, .text-header h1, .text-header h2");
    const textSection = element.querySelector("section.text--large-font, section.comp");
    let description = null;
    if (textSection) {
      const paragraphs = textSection.querySelectorAll(":scope > p");
      if (paragraphs.length > 0) {
        description = paragraphs[0];
      }
    }
    const ctaLinks = Array.from(
      element.querySelectorAll('a.btn, a.btn--primary, .calltoaction a, a[class*="btn"]')
    );
    const cells = [];
    if (picture) {
      cells.push([picture]);
    }
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
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse2(element, { document }) {
    const snippets = element.querySelectorAll("section.contentsnippet, .contentsnippet-wrapper section");
    const cells = [];
    snippets.forEach((snippet) => {
      let iconEl = snippet.querySelector(".contentsnippet__icon-container img, .contentsnippet__icon-wrapper img, figure img");
      if (!iconEl) {
        const svg = snippet.querySelector(".contentsnippet__icon-container svg, .contentsnippet__icon-wrapper svg, figure svg");
        if (svg) {
          const svgString = new XMLSerializer().serializeToString(svg);
          iconEl = document.createElement("img");
          iconEl.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
          iconEl.alt = "";
        }
      }
      if (iconEl && iconEl.src && iconEl.src.startsWith("data:")) {
        const img = document.createElement("img");
        img.src = iconEl.src;
        img.alt = iconEl.alt || "";
        iconEl = img;
      }
      const heading = snippet.querySelector(".contentsnippet__headline, .contentsnippet__content-container h3, .contentsnippet__content-container h2");
      const iconCell = [];
      if (iconEl) {
        iconCell.push(iconEl);
      }
      const bodyCell = [];
      if (heading) {
        bodyCell.push(heading);
      }
      if (iconCell.length > 0 || bodyCell.length > 0) {
        cells.push([iconCell, bodyCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-steps.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll("ol > li, .contentsnippetlist__ordered-list > li");
    const cells = [];
    items.forEach((item) => {
      const snippet = item.querySelector(".contentsnippet, section");
      const iconContainer = snippet ? snippet.querySelector(".contentsnippet__icon-container, .contentsnippet__icon-wrapper") : item.querySelector(".contentsnippet__icon-container, .contentsnippet__icon-wrapper");
      const icon = iconContainer ? iconContainer.querySelector("img") : item.querySelector("figure img, .contentsnippet__icon-container img");
      const heading = item.querySelector(".contentsnippet__headline, h3, h4");
      const bodyEl = item.querySelector(".contentsnippet__body");
      const bodyContent = bodyEl || item.querySelector(".contentsnippet__content-container p");
      const imageCell = [];
      if (icon) {
        imageCell.push(icon);
      }
      const bodyCell = [];
      if (heading) {
        bodyCell.push(heading);
      }
      if (bodyContent) {
        bodyCell.push(bodyContent);
      }
      cells.push([imageCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document }) {
    const alphaCol = element.querySelector(":scope > .colctrl__alpha .colctrl__wrapper");
    const betaCol = element.querySelector(":scope > .colctrl__beta .colctrl__wrapper");
    const alphaHasImage = alphaCol && alphaCol.querySelector("picture, img") && !alphaCol.querySelector("h2, h3, h4");
    const betaHasImage = betaCol && betaCol.querySelector("picture, img") && !betaCol.querySelector("h2, h3, h4");
    let textCol;
    let imageCol;
    if (alphaHasImage) {
      imageCol = alphaCol;
      textCol = betaCol;
    } else if (betaHasImage) {
      imageCol = betaCol;
      textCol = alphaCol;
    } else {
      textCol = alphaCol;
      imageCol = betaCol;
    }
    const textContent = [];
    if (textCol) {
      const heading = textCol.querySelector('h3, h2, h4, [class*="heading"]');
      if (heading) textContent.push(heading);
      const paragraphs = textCol.querySelectorAll("p");
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) textContent.push(p);
      });
      const links = textCol.querySelectorAll('a.btn, a.button, a[class*="cta"]');
      links.forEach((link) => textContent.push(link));
    }
    const imageContent = [];
    if (imageCol) {
      const picture = imageCol.querySelector("picture");
      const img = imageCol.querySelector("img");
      if (picture) {
        imageContent.push(picture);
      } else if (img) {
        imageContent.push(img);
      }
    }
    const isReversed = element.classList.contains("colctrl--reverse");
    const cells = [];
    if (isReversed) {
      cells.push([
        imageContent.length === 1 ? imageContent[0] : imageContent,
        textContent.length === 1 ? textContent[0] : textContent
      ]);
    } else {
      cells.push([
        textContent.length === 1 ? textContent[0] : textContent,
        imageContent.length === 1 ? imageContent[0] : imageContent
      ]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse5(element, { document }) {
    const alphaCol = element.querySelector(":scope > .colctrl__alpha");
    const imageEl = element.querySelector(".colctrl__alpha img.image__img, .colctrl__alpha img");
    const imageLink = element.querySelector(".colctrl__alpha a.image__link, .colctrl__alpha a");
    const imageCell = [];
    if (imageEl) {
      if (imageLink && imageLink.contains(imageEl)) {
        const link = document.createElement("a");
        link.href = imageLink.href || imageLink.getAttribute("href");
        const img = document.createElement("img");
        img.src = imageEl.src || imageEl.getAttribute("src");
        if (imageEl.alt) img.alt = imageEl.alt;
        link.appendChild(img);
        imageCell.push(link);
      } else {
        const img = document.createElement("img");
        img.src = imageEl.src || imageEl.getAttribute("src");
        if (imageEl.alt) img.alt = imageEl.alt;
        imageCell.push(img);
      }
    }
    const betaCol = element.querySelector(":scope > .colctrl__beta");
    const contentCell = [];
    if (betaCol) {
      const heading = betaCol.querySelector("h2, h3, h4");
      if (heading) {
        const h = document.createElement(heading.tagName.toLowerCase());
        h.textContent = heading.textContent.trim();
        contentCell.push(h);
      }
      const list = betaCol.querySelector("ul, ol");
      if (list) {
        const newList = document.createElement(list.tagName.toLowerCase());
        const items = list.querySelectorAll("li");
        items.forEach((li) => {
          const newLi = document.createElement("li");
          newLi.textContent = li.textContent.trim();
          newList.appendChild(newLi);
        });
        contentCell.push(newList);
      }
      if (!list) {
        const paragraphs = betaCol.querySelectorAll("section p, .text p");
        paragraphs.forEach((p) => {
          const newP = document.createElement("p");
          newP.textContent = p.textContent.trim();
          if (newP.textContent) contentCell.push(newP);
        });
      }
      const ctaLinks = betaCol.querySelectorAll(".calltoaction a, a.btn, a.button");
      ctaLinks.forEach((cta) => {
        const link = document.createElement("a");
        link.href = cta.href || cta.getAttribute("href");
        link.textContent = (cta.querySelector(".btn-value") || cta).textContent.trim();
        if (cta.title) link.title = cta.title;
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.appendChild(link);
        p.appendChild(strong);
        contentCell.push(p);
      });
    }
    const cells = [
      [imageCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-pricing.js
  function parse6(element, { document }) {
    const table = element.querySelector("table");
    if (!table) return;
    const cells = [];
    const theadRow = table.querySelector("thead tr");
    if (theadRow) {
      const headerCells = Array.from(theadRow.querySelectorAll("th, td"));
      const headerContent = headerCells.map((cell) => {
        const content = cell.innerHTML.trim();
        if (!content || content === "&nbsp;") return "";
        return cell.textContent.trim();
      });
      cells.push(headerContent);
    }
    const tbodyRows = Array.from(table.querySelectorAll("tbody tr"));
    tbodyRows.forEach((row) => {
      const rowCells = Array.from(row.querySelectorAll("td"));
      const rowContent = rowCells.map((cell) => cell.textContent.trim());
      cells.push(rowContent);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "table-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-comparison.js
  function parse7(element, { document }) {
    const entries = element.querySelectorAll(".giga-tab__entry");
    const panels = element.querySelectorAll(".giga-tab__panel");
    const cells = [];
    entries.forEach((entry, index) => {
      const headlineEl = entry.querySelector(
        ".giga-tab__entry__text__headline, .giga-tab__entry__text p, .giga-tab__entry__text"
      );
      const labelText = headlineEl ? headlineEl.textContent.trim() : `Tab ${index + 1}`;
      const label = document.createElement("p");
      label.textContent = labelText;
      const panel = panels[index];
      const contentCell = [];
      if (panel) {
        const headings = panel.querySelectorAll("h1, h2, h3, h4, h5, h6");
        const paragraphs = panel.querySelectorAll("p");
        const lists = panel.querySelectorAll("ul, ol");
        const links = panel.querySelectorAll("a.btn, a.calltoaction, .calltoaction a");
        const images = panel.querySelectorAll("img");
        const sections = panel.querySelectorAll("section.comp");
        if (sections.length > 0) {
          sections.forEach((section) => {
            const sectionHeadings = section.querySelectorAll("h1, h2, h3, h4, h5, h6");
            const sectionParagraphs = section.querySelectorAll("p");
            const sectionLists = section.querySelectorAll("ul, ol");
            sectionHeadings.forEach((h) => contentCell.push(h));
            sectionParagraphs.forEach((p) => contentCell.push(p));
            sectionLists.forEach((list) => contentCell.push(list));
          });
        } else {
          headings.forEach((h) => contentCell.push(h));
          paragraphs.forEach((p) => contentCell.push(p));
          lists.forEach((list) => contentCell.push(list));
        }
        links.forEach((link) => {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.textContent.trim() || link.getAttribute("title") || "";
          contentCell.push(a);
        });
        images.forEach((img) => contentCell.push(img));
      }
      cells.push([[label], contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-comparison", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-legal.js
  function parse8(element, { document }) {
    const entries = element.querySelectorAll(":scope .acc__entry, :scope > section.acc__entry");
    const cells = [];
    entries.forEach((entry) => {
      const titleEl = entry.querySelector(
        ".acc__entry-trigger-value, .acc__entry-headline h4, .acc__entry-headline h3, .acc__entry-headline h2, .acc__entry-trigger"
      );
      const contentEl = entry.querySelector(".acc__entry-content");
      if (titleEl && contentEl) {
        const title = document.createElement("p");
        title.textContent = titleEl.textContent.trim();
        const textSection = contentEl.querySelector(".text.comp--wrapper section, .text section, .acc__entry-content > div");
        const contentContainer = document.createElement("div");
        if (textSection) {
          const paragraphs = textSection.querySelectorAll("p, ul, ol, h2, h3, h4, h5, h6, table");
          paragraphs.forEach((p) => {
            contentContainer.appendChild(p.cloneNode(true));
          });
        } else {
          const allContent = contentEl.querySelectorAll("p, ul, ol, h2, h3, h4, h5, h6, table");
          allContent.forEach((el) => {
            contentContainer.appendChild(el.cloneNode(true));
          });
        }
        cells.push([title, contentContainer]);
      }
    });
    if (cells.length === 0) {
      const heading = element.querySelector("h2, h3, h4, .acc__entry-trigger-value");
      const content = element.querySelector(".acc__entry-content, .accordion-content");
      if (heading && content) {
        const title = document.createElement("p");
        title.textContent = heading.textContent.trim();
        cells.push([title, content]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-legal", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse9(element, { document }) {
    const entries = element.querySelectorAll(":scope > .acc__entry");
    const cells = [];
    entries.forEach((entry) => {
      const heading = entry.querySelector(".acc__entry-trigger-value, h3, h2");
      const contentSection = entry.querySelector(".acc__entry-content .comp, .acc__entry-content .text");
      const questionCell = [];
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        questionCell.push(h3);
      }
      const answerCell = [];
      if (contentSection) {
        const contentElements = contentSection.querySelectorAll("p, ul, ol, h4, h5, h6");
        contentElements.forEach((el) => {
          answerCell.push(el);
        });
      }
      if (questionCell.length > 0) {
        cells.push([questionCell, answerCell.length > 0 ? answerCell : [""]]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/deutsche-bank-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "nav.tabnav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".complement-navigations"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#flyouts"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".contentNavigation"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".toggle-display-container"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.footer-area"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "dialog.disclaimer-layer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "source"
      ]);
      element.querySelectorAll("[data-track]").forEach((el) => {
        el.removeAttribute("data-track");
      });
      element.querySelectorAll("[onclick]").forEach((el) => {
        el.removeAttribute("onclick");
      });
      element.querySelectorAll("[data-analytics]").forEach((el) => {
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/deutsche-bank-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SELECTOR_FALLBACKS = {
    ".disclaimer": "#parsys-text_copy_copy_10264"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = element.querySelector(section.selector);
        if (!sectionEl && SELECTOR_FALLBACKS[section.selector]) {
          sectionEl = element.querySelector(SELECTOR_FALLBACKS[section.selector]);
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-investment-product-page.js
  var parsers = {
    "hero-product": parse,
    "cards-icon": parse2,
    "cards-steps": parse3,
    "columns-feature": parse4,
    "columns-promo": parse5,
    "table-pricing": parse6,
    "tabs-comparison": parse7,
    "accordion-legal": parse8,
    "accordion-faq": parse9
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "investment-product-page",
    description: "Investment product page for online securities depot/brokerage account",
    urls: [
      "https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html"
    ],
    blocks: [
      {
        name: "hero-product",
        instances: [".dynamic-container-stage"]
      },
      {
        name: "cards-icon",
        instances: ["#parsys-columncontrol_365142-columnControlCol1Parsys-columncontrol .colctrl__25-25-25-25"]
      },
      {
        name: "columns-feature",
        instances: [
          "#parsys-columncontrol_263516-columnControlCol2Parsys-columncontrol_copy .colctrl__50-50",
          "#parsys-columncontrol_263516-columnControlCol2Parsys-columncontrol_copy_c .colctrl__50-50"
        ]
      },
      {
        name: "table-pricing",
        instances: [".table.comp.comp--padded"]
      },
      {
        name: "columns-promo",
        instances: [
          "#happy-hour .colctrl__30-60",
          "#parsys-columncontrol_487523-columnControlCol2Parsys-columncontrol_copy .colctrl__30-60"
        ]
      },
      {
        name: "cards-steps",
        instances: [".contentsnippetlist"]
      },
      {
        name: "tabs-comparison",
        instances: [".giga-tab"]
      },
      {
        name: "accordion-legal",
        instances: ["#parsys-columncontrol_487523-columnControlCol2Parsys-columncontrol_340917_653381460-columnControlCol1Parsys-accordion_copy_copy__740162962"]
      },
      {
        name: "accordion-faq",
        instances: ["#root-accordion_905335099__470306153"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".stage-area",
        style: null,
        blocks: ["hero-product"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Introduction",
        selector: "#parsys-columncontrol_365142-columnControlCol1Parsys-text_copy_copy_copy_",
        style: null,
        blocks: [],
        defaultContent: [
          "#parsys-columncontrol_365142-columnControlCol1Parsys-text_copy_copy_copy_ h2",
          "#parsys-columncontrol_365142-columnControlCol1Parsys-text_copy_copy_copy_ p"
        ]
      },
      {
        id: "section-3",
        name: "Key Benefits",
        selector: "#parsys-columncontrol_365142-columnControlCol1Parsys-columncontrol",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Additional Features",
        selector: "#parsys-columncontrol_263516-columnControlCol2Parsys-text_copy_copy",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: [
          "#parsys-columncontrol_263516-columnControlCol2Parsys-text_copy_copy h2"
        ]
      },
      {
        id: "section-5",
        name: "Pricing",
        selector: "#parsys-columncontrol_copy_c_1273061504-columnControlCol2Parsys-experiencefragment_1",
        style: null,
        blocks: ["table-pricing"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Happy Hour Promo",
        selector: "#happy-hour",
        style: "grey",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "How It Works",
        selector: "#parsys-columncontrol_copy_c_2069414751-columnControlCol1Parsys-text",
        style: null,
        blocks: ["cards-steps"],
        defaultContent: [
          "#parsys-columncontrol_copy_c_2069414751-columnControlCol1Parsys-text h2"
        ]
      },
      {
        id: "section-8",
        name: "Trading Comparison",
        selector: ".comp--giga-tab",
        style: null,
        blocks: ["tabs-comparison"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Depot Switch Promo",
        selector: "#parsys-columncontrol_487523",
        style: "grey",
        blocks: ["columns-promo", "accordion-legal"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "FAQ",
        selector: "#root-accordion_905335099__470306153",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["#Fragen h2"]
      },
      {
        id: "section-11",
        name: "Disclaimers",
        selector: ".disclaimer",
        style: null,
        blocks: [],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_investment_product_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_investment_product_page_exports);
})();
