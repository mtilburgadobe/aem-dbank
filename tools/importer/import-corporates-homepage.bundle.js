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

  // tools/importer/import-corporates-homepage.js
  var import_corporates_homepage_exports = {};
  __export(import_corporates_homepage_exports, {
    default: () => import_corporates_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll('ul.slider-wrapper > li.itm-stage, ul.slider-wrapper > li[class*="itm-stage"]');
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("figure.media img, figure img, .media img");
      const contentCell = [];
      const overheadline = slide.querySelector("p.stage-overheadline, .content-block > p:first-child");
      if (overheadline) {
        contentCell.push(overheadline);
      }
      const heading = slide.querySelector("h2, h1, h3");
      if (heading) {
        contentCell.push(heading);
      }
      const descriptionText = slide.querySelector("p.text, .content-block > p:not(.stage-overheadline)");
      if (descriptionText && descriptionText !== overheadline) {
        contentCell.push(descriptionText);
      }
      const ctaLinks = slide.querySelectorAll(".button-wrapper a.button, .button-wrapper a, a.button");
      ctaLinks.forEach((cta) => {
        const hiddenTitle = cta.querySelector("span.hidden-title");
        if (hiddenTitle) {
          hiddenTitle.remove();
        }
        contentCell.push(cta);
      });
      const imageCell = img ? [img] : [""];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-overlay.js
  function parse2(element, { document }) {
    const parent = element.parentElement;
    const siblingCards = parent ? parent.querySelectorAll(":scope > .mod-text-box.type-image-background") : null;
    const cards = siblingCards && siblingCards.length > 1 ? siblingCards : [element];
    const cells = [];
    cards.forEach((card) => {
      const hiddenTitles = card.querySelectorAll("span.hidden-title");
      hiddenTitles.forEach((span) => span.remove());
      const image = card.querySelector(".media figure img, .media img, figure img, img");
      const heading = card.querySelector(".content-wrapper .content h2, .content h2, h2");
      const ctaLink = card.querySelector(".content-wrapper .content > a.button, .content > a.button, a.button");
      if (image || heading || ctaLink) {
        const contentCell = [];
        if (heading) contentCell.push(heading);
        if (ctaLink) contentCell.push(ctaLink);
        cells.push([image || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-overlay", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll(":scope .mod-text-box, :scope.mod-text-box");
    const items = cardItems.length > 0 ? cardItems : [element];
    const cells = [];
    items.forEach((card) => {
      const img = card.querySelector(".media img, .image-wrapper img, figure img");
      const overline = card.querySelector(".content-wrapper > h3, .content-wrapper h3");
      const heading = card.querySelector(".content h2, .content-wrapper .content h2");
      const description = card.querySelector(".content p.text, .content p");
      const ctaButton = card.querySelector(".content a.button, .content a.type-primary");
      const imageCell = [];
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        picture.appendChild(imgEl);
        imageCell.push(picture);
      }
      const bodyCell = [];
      if (overline) {
        const overlineEl = document.createElement("p");
        overlineEl.textContent = overline.textContent.trim();
        bodyCell.push(overlineEl);
      }
      if (heading) {
        const h2 = document.createElement("h2");
        const link = heading.querySelector("a");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href;
          const visibleText = Array.from(link.childNodes).filter((node) => !(node.nodeType === 1 && node.classList && node.classList.contains("hidden-title"))).map((node) => node.textContent.trim()).filter(Boolean).join(" ");
          a.textContent = visibleText || link.textContent.trim();
          h2.appendChild(a);
        } else {
          h2.textContent = heading.textContent.trim();
        }
        bodyCell.push(h2);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        bodyCell.push(p);
      }
      if (ctaButton) {
        const a = document.createElement("a");
        a.href = ctaButton.href;
        const visibleText = Array.from(ctaButton.childNodes).filter((node) => !(node.nodeType === 1 && node.classList && node.classList.contains("hidden-title"))).map((node) => node.textContent.trim()).filter(Boolean).join(" ");
        a.textContent = visibleText || ctaButton.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        bodyCell.push(p);
      }
      if (imageCell.length > 0 || bodyCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", bodyCell.length > 0 ? bodyCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-mixed.js
  function parse4(element, { document }) {
    element.querySelectorAll(".hidden-title").forEach((span) => span.remove());
    const leftColumnEl = element.querySelector('.cms-column-66, [class*="column-66"], [class*="col-8"]');
    const rightColumnEl = element.querySelector('.cms-column-33, [class*="column-33"], [class*="col-4"]');
    if (!leftColumnEl && !rightColumnEl) {
      const headline = element.querySelector(".container-headline h2, .container-headline h3, h2, h3");
      const description = element.querySelector(".container-headline p, .mod-text p, .cms-content p");
      const contentCell = [];
      if (headline) contentCell.push(headline);
      if (description) contentCell.push(description);
      if (contentCell.length === 0) {
        const fragment = document.createDocumentFragment();
        element.replaceWith(fragment);
        return;
      }
      const cells2 = [[contentCell]];
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-mixed", cells: cells2 });
      element.replaceWith(block2);
      return;
    }
    const leftCell = [];
    if (leftColumnEl) {
      const textBoxes = leftColumnEl.querySelectorAll(".mod-text-box.type-image-background, .mod-text-box");
      textBoxes.forEach((box) => {
        const picture = box.querySelector("picture");
        const img = box.querySelector("img");
        if (picture) {
          leftCell.push(picture);
        } else if (img) {
          leftCell.push(img);
        }
        const heading = box.querySelector(".content h2, .content h3, .content h1, .content-wrapper h2, .content-wrapper h3");
        if (heading) leftCell.push(heading);
        const ctaLink = box.querySelector(".content > a.button, .content-wrapper > .content > a.button, a.button.type-icon");
        if (ctaLink) leftCell.push(ctaLink);
      });
    }
    const rightCell = [];
    if (rightColumnEl) {
      const tagWrappers = rightColumnEl.querySelectorAll(".tag-wrapper");
      if (tagWrappers.length > 0) {
        tagWrappers.forEach((wrapper) => {
          const link = wrapper.querySelector("a");
          if (link) {
            rightCell.push(link);
          }
        });
      } else {
        const links = rightColumnEl.querySelectorAll("a[href]");
        links.forEach((link) => {
          rightCell.push(link);
        });
      }
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-mixed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse5(element, { document }) {
    element.querySelectorAll("span.hidden-title").forEach((span) => span.remove());
    const bgImage = element.querySelector(".media img, figure.mod-img-loader img");
    const eyebrow = element.querySelector(".content-wrapper > h3");
    const mainHeading = element.querySelector(".content h2");
    const description = element.querySelector(".content p.text, .content > p");
    const ctaButton = element.querySelector(".content a.button, .content > a");
    const cells = [];
    if (bgImage) {
      cells.push([[bgImage]]);
    }
    const contentElements = [];
    if (eyebrow) contentElements.push(eyebrow);
    if (mainHeading) contentElements.push(mainHeading);
    if (description) contentElements.push(description);
    if (ctaButton) contentElements.push(ctaButton);
    if (contentElements.length > 0) {
      cells.push([contentElements]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/corporates-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".modal-layer"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header.cms-row"]);
      WebImporter.DOMUtils.remove(element, ["nav.navigation-customer"]);
      WebImporter.DOMUtils.remove(element, ["nav.navigation-main"]);
      WebImporter.DOMUtils.remove(element, ["footer.cms-row"]);
      WebImporter.DOMUtils.remove(element, [".footer-back-to-top"]);
      WebImporter.DOMUtils.remove(element, [".mod-toolbox"]);
    }
  }

  // tools/importer/transformers/corporates-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = null;
        if (Array.isArray(section.selector)) {
          for (const sel of section.selector) {
            sectionEl = element.querySelector(sel);
            if (sectionEl) break;
          }
        } else {
          sectionEl = element.querySelector(section.selector);
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

  // tools/importer/import-corporates-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-overlay": parse2,
    "cards-article": parse3,
    "columns-mixed": parse4,
    "hero-banner": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "corporates-homepage",
    description: "DB Corporates homepage with hero carousel, product cards, and corporate banking information",
    urls: [
      "https://corporates.db.com/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".mod-stage"]
      },
      {
        name: "cards-overlay",
        instances: [
          ".cms-row.row-index-1 .itm-tile .mod-text-box.type-image-background",
          ".cms-row.row-index-4 .cnt-generic.type-2 .mod-text-box.type-image-background"
        ]
      },
      {
        name: "cards-article",
        instances: [
          ".cms-row.row-index-11 .cnt-generic.type-3 .mod-text-box.type-default",
          ".cms-row.row-index-16 .cnt-generic.type-3 .mod-text-box"
        ]
      },
      {
        name: "columns-mixed",
        instances: [".cms-row.row-index-13, .cms-row.row-index-14"]
      },
      {
        name: "hero-banner",
        instances: [".cms-row.row-index-15 .mod-text-box.type-image-background"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".cms-row.row-index-1",
        style: null,
        blocks: ["carousel-hero", "cards-overlay"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Introduction",
        selector: ".cms-row.row-index-2",
        style: null,
        blocks: [],
        defaultContent: [".mod-page-headline h1", ".mod-page-headline p"]
      },
      {
        id: "section-3",
        name: "Solutions Grid",
        selector: ".cms-row.row-index-4",
        style: "grey",
        blocks: ["cards-overlay"],
        defaultContent: [".cms-row.row-index-4 .container-headline"]
      },
      {
        id: "section-4",
        name: "Feature Cards",
        selector: ".cms-row.row-index-11",
        style: null,
        blocks: ["cards-article"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Stay Updated",
        selector: [".cms-row.row-index-13", ".cms-row.row-index-14"],
        style: null,
        blocks: ["columns-mixed"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Flow Banner",
        selector: ".cms-row.row-index-15",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Awards",
        selector: ".cms-row.row-index-16",
        style: "grey",
        blocks: ["cards-article"],
        defaultContent: [".cms-row.row-index-16 .container-headline"]
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
  var import_corporates_homepage_default = {
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
  return __toCommonJS(import_corporates_homepage_exports);
})();
