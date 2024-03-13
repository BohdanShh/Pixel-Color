/* eslint-disable no-prototype-builtins */

type ElementOptions = {
  id?: string;
  classList?: string[];
  attributes?: Record<string, string>;
  textContent?: string;
  children?: HTMLElement[];
};

export function createElement(
  tag: keyof HTMLElementTagNameMap,
  options?: ElementOptions
): HTMLElement {
  const element = document.createElement(tag);

  if (options) {
    if (options.id) {
      element.id = options.id;
    }

    if (options.classList && options.classList.length) {
      element.classList.add(...options.classList);
    }

    if (options.attributes) {
      for (const key in options.attributes) {
        if (options.attributes.hasOwnProperty(key)) {
          element.setAttribute(key, options.attributes[key]);
        }
      }
    }

    if (options.textContent) {
      element.textContent = options.textContent;
    }

    if (options.children && options.children.length) {
      options.children.forEach(child => {
        element.appendChild(child);
      });
    }
  }

  return element;
}
