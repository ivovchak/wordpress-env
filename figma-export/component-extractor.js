#!/usr/bin/env node

/**
 * WordPress Components to Figma Exporter
 * Генерує HTML компоненти з інлайн стилями для імпорту в Figma через html.to.design
 */

const fs = require('fs');
const path = require('path');

class ComponentExtractor {
  constructor() {
    this.outputDir = path.join(__dirname, 'output');
    this.componentsDir = path.join(this.outputDir, 'components');
    this.tokensDir = path.join(this.outputDir, 'tokens');

    // Design Tokens на базі Bootstrap/Understrap
    this.tokens = {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
        white: '#ffffff',
        black: '#000000'
      },
      typography: {
        fontFamily: {
          base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
        fontSize: {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.75rem',
          h4: '1.5rem',
          h5: '1.25rem',
          h6: '1rem',
          base: '1rem',
          small: '0.875rem'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          bold: 700
        },
        lineHeight: {
          tight: 1.25,
          base: 1.5,
          relaxed: 1.75
        }
      },
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '1rem',
        4: '1.5rem',
        5: '3rem'
      },
      borderRadius: {
        none: '0',
        sm: '0.2rem',
        base: '0.25rem',
        md: '0.3rem',
        lg: '0.5rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        base: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        lg: '0 1rem 3rem rgba(0, 0, 0, 0.175)'
      }
    };
  }

  init() {
    // Створити директорії
    [this.outputDir, this.componentsDir, this.tokensDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Генерація Design Tokens для Figma Tokens плагіну
  generateDesignTokens() {
    const figmaTokens = {
      colors: {},
      typography: {},
      spacing: {},
      borderRadius: {},
      shadows: {}
    };

    // Кольори
    Object.entries(this.tokens.colors).forEach(([name, value]) => {
      figmaTokens.colors[name] = {
        value,
        type: 'color'
      };
    });

    // Типографіка
    Object.entries(this.tokens.typography.fontSize).forEach(([name, value]) => {
      figmaTokens.typography[`fontSize-${name}`] = {
        value,
        type: 'fontSize'
      };
    });

    // Spacing
    Object.entries(this.tokens.spacing).forEach(([name, value]) => {
      figmaTokens.spacing[`space-${name}`] = {
        value,
        type: 'spacing'
      };
    });

    // Border Radius
    Object.entries(this.tokens.borderRadius).forEach(([name, value]) => {
      figmaTokens.borderRadius[`radius-${name}`] = {
        value,
        type: 'borderRadius'
      };
    });

    // Shadows
    Object.entries(this.tokens.shadows).forEach(([name, value]) => {
      figmaTokens.shadows[`shadow-${name}`] = {
        value,
        type: 'boxShadow'
      };
    });

    const tokensPath = path.join(this.tokensDir, 'design-tokens.json');
    fs.writeFileSync(tokensPath, JSON.stringify(figmaTokens, null, 2));

    console.log(`✅ Design Tokens згенеровано: ${tokensPath}`);
  }

  // Генерація HTML компонентів
  generateComponents() {
    const components = {
      buttons: this.generateButtons(),
      forms: this.generateForms(),
      typography: this.generateTypography(),
      cards: this.generateCards(),
      navigation: this.generateNavigation()
    };

    Object.entries(components).forEach(([category, html]) => {
      const componentPath = path.join(this.componentsDir, `${category}.html`);
      const fullHtml = this.wrapInTemplate(html, category);
      fs.writeFileSync(componentPath, fullHtml);
      console.log(`✅ Компонент "${category}" згенеровано: ${componentPath}`);
    });
  }

  // Wrapper для HTML
  wrapInTemplate(content, title) {
    return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${this.tokens.typography.fontFamily.base};
      font-size: ${this.tokens.typography.fontSize.base};
      line-height: ${this.tokens.typography.lineHeight.base};
      padding: 2rem;
      background: #f5f5f5;
    }
    .component-showcase {
      display: grid;
      gap: 2rem;
      max-width: 1200px;
    }
    .component-group {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .component-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: ${this.tokens.colors.dark};
    }
    .component-items {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }
  </style>
</head>
<body>
  <h1 style="margin-bottom: 2rem; color: ${this.tokens.colors.dark};">${title.toUpperCase()} - WordPress Components</h1>
  <div class="component-showcase">
    ${content}
  </div>
</body>
</html>`;
  }

  // Генерація кнопок
  generateButtons() {
    const buttonStyle = (bgColor, textColor = '#ffffff', hoverBg = null) => `
      display: inline-block;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      border: 1px solid transparent;
      border-radius: ${this.tokens.borderRadius.base};
      background-color: ${bgColor};
      color: ${textColor};
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    `.trim();

    return `
    <div class="component-group">
      <h2 class="component-title">Кнопки - Primary</h2>
      <div class="component-items">
        <button style="${buttonStyle(this.tokens.colors.primary)}">Primary Button</button>
        <button style="${buttonStyle(this.tokens.colors.primary)}; padding: 0.5rem 1rem; font-size: 1.25rem;">Large Button</button>
        <button style="${buttonStyle(this.tokens.colors.primary)}; padding: 0.25rem 0.5rem; font-size: 0.875rem;">Small Button</button>
      </div>
    </div>

    <div class="component-group">
      <h2 class="component-title">Кнопки - Secondary & Variants</h2>
      <div class="component-items">
        <button style="${buttonStyle(this.tokens.colors.secondary)}">Secondary</button>
        <button style="${buttonStyle(this.tokens.colors.success)}">Success</button>
        <button style="${buttonStyle(this.tokens.colors.danger)}">Danger</button>
        <button style="${buttonStyle(this.tokens.colors.warning, this.tokens.colors.dark)}">Warning</button>
        <button style="${buttonStyle(this.tokens.colors.info)}">Info</button>
      </div>
    </div>

    <div class="component-group">
      <h2 class="component-title">Кнопки - Outline</h2>
      <div class="component-items">
        <button style="
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          border: 1px solid ${this.tokens.colors.primary};
          border-radius: ${this.tokens.borderRadius.base};
          background-color: transparent;
          color: ${this.tokens.colors.primary};
          cursor: pointer;
        ">Primary Outline</button>
        <button style="
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          border: 1px solid ${this.tokens.colors.secondary};
          border-radius: ${this.tokens.borderRadius.base};
          background-color: transparent;
          color: ${this.tokens.colors.secondary};
          cursor: pointer;
        ">Secondary Outline</button>
      </div>
    </div>
    `;
  }

  // Генерація форм
  generateForms() {
    return `
    <div class="component-group">
      <h2 class="component-title">Input Fields</h2>
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;">
        <input type="text" placeholder="Text Input" style="
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          border: 1px solid #ced4da;
          border-radius: ${this.tokens.borderRadius.base};
          width: 100%;
        "/>
        <input type="email" placeholder="Email Input" style="
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          border: 1px solid #ced4da;
          border-radius: ${this.tokens.borderRadius.base};
          width: 100%;
        "/>
        <textarea placeholder="Textarea" rows="3" style="
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          border: 1px solid #ced4da;
          border-radius: ${this.tokens.borderRadius.base};
          width: 100%;
          resize: vertical;
        "></textarea>
      </div>
    </div>

    <div class="component-group">
      <h2 class="component-title">Select & Checkboxes</h2>
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;">
        <select style="
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          border: 1px solid #ced4da;
          border-radius: ${this.tokens.borderRadius.base};
          width: 100%;
        ">
          <option>Оберіть опцію</option>
          <option>Опція 1</option>
          <option>Опція 2</option>
        </select>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <input type="checkbox" id="check1" style="width: 1rem; height: 1rem;"/>
          <label for="check1">Checkbox Option</label>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <input type="radio" id="radio1" name="radio" style="width: 1rem; height: 1rem;"/>
          <label for="radio1">Radio Option 1</label>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <input type="radio" id="radio2" name="radio" style="width: 1rem; height: 1rem;"/>
          <label for="radio2">Radio Option 2</label>
        </div>
      </div>
    </div>
    `;
  }

  // Генерація типографіки
  generateTypography() {
    return `
    <div class="component-group">
      <h2 class="component-title">Заголовки</h2>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <h1 style="font-size: ${this.tokens.typography.fontSize.h1}; font-weight: ${this.tokens.typography.fontWeight.bold}; line-height: ${this.tokens.typography.lineHeight.tight};">Heading 1</h1>
        <h2 style="font-size: ${this.tokens.typography.fontSize.h2}; font-weight: ${this.tokens.typography.fontWeight.bold}; line-height: ${this.tokens.typography.lineHeight.tight};">Heading 2</h2>
        <h3 style="font-size: ${this.tokens.typography.fontSize.h3}; font-weight: ${this.tokens.typography.fontWeight.bold}; line-height: ${this.tokens.typography.lineHeight.tight};">Heading 3</h3>
        <h4 style="font-size: ${this.tokens.typography.fontSize.h4}; font-weight: ${this.tokens.typography.fontWeight.bold}; line-height: ${this.tokens.typography.lineHeight.tight};">Heading 4</h4>
        <h5 style="font-size: ${this.tokens.typography.fontSize.h5}; font-weight: ${this.tokens.typography.fontWeight.bold}; line-height: ${this.tokens.typography.lineHeight.tight};">Heading 5</h5>
        <h6 style="font-size: ${this.tokens.typography.fontSize.h6}; font-weight: ${this.tokens.typography.fontWeight.bold}; line-height: ${this.tokens.typography.lineHeight.tight};">Heading 6</h6>
      </div>
    </div>

    <div class="component-group">
      <h2 class="component-title">Текст</h2>
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px;">
        <p style="font-size: ${this.tokens.typography.fontSize.base}; line-height: ${this.tokens.typography.lineHeight.base};">
          Це звичайний параграф тексту. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <p style="font-size: ${this.tokens.typography.fontSize.small}; line-height: ${this.tokens.typography.lineHeight.base}; color: ${this.tokens.colors.secondary};">
          Дрібний текст для допоміжної інформації.
        </p>
        <p style="font-weight: ${this.tokens.typography.fontWeight.bold};">
          Жирний текст для акцентування уваги.
        </p>
      </div>
    </div>
    `;
  }

  // Генерація карток
  generateCards() {
    const cardStyle = `
      border: 1px solid rgba(0,0,0,.125);
      border-radius: ${this.tokens.borderRadius.base};
      background: white;
      overflow: hidden;
      box-shadow: ${this.tokens.shadows.sm};
    `;

    return `
    <div class="component-group">
      <h2 class="component-title">Cards</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        <div style="${cardStyle}">
          <div style="height: 180px; background: linear-gradient(135deg, ${this.tokens.colors.primary} 0%, ${this.tokens.colors.info} 100%);"></div>
          <div style="padding: 1.25rem;">
            <h3 style="font-size: 1.25rem; font-weight: ${this.tokens.typography.fontWeight.bold}; margin-bottom: 0.75rem;">Card Title</h3>
            <p style="color: ${this.tokens.colors.secondary}; margin-bottom: 1rem;">
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>
            <button style="
              padding: 0.375rem 0.75rem;
              background: ${this.tokens.colors.primary};
              color: white;
              border: none;
              border-radius: ${this.tokens.borderRadius.base};
              cursor: pointer;
            ">Learn More</button>
          </div>
        </div>

        <div style="${cardStyle}">
          <div style="padding: 1.25rem;">
            <h3 style="font-size: 1.25rem; font-weight: ${this.tokens.typography.fontWeight.bold}; margin-bottom: 0.75rem;">Simple Card</h3>
            <p style="color: ${this.tokens.colors.secondary};">
              Card without image. Perfect for text-only content.
            </p>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  // Генерація навігації
  generateNavigation() {
    return `
    <div class="component-group">
      <h2 class="component-title">Navigation</h2>
      <nav style="
        background: ${this.tokens.colors.dark};
        padding: 1rem;
        border-radius: ${this.tokens.borderRadius.base};
      ">
        <div style="display: flex; align-items: center; gap: 2rem;">
          <a href="#" style="
            color: white;
            text-decoration: none;
            font-weight: ${this.tokens.typography.fontWeight.bold};
            font-size: 1.25rem;
          ">Logo</a>
          <div style="display: flex; gap: 1rem;">
            <a href="#" style="color: white; text-decoration: none;">Home</a>
            <a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none;">About</a>
            <a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none;">Services</a>
            <a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a>
          </div>
        </div>
      </nav>
    </div>

    <div class="component-group">
      <h2 class="component-title">Breadcrumbs</h2>
      <nav style="
        padding: 0.75rem 1rem;
        background: ${this.tokens.colors.light};
        border-radius: ${this.tokens.borderRadius.base};
      ">
        <a href="#" style="color: ${this.tokens.colors.primary}; text-decoration: none;">Home</a>
        <span style="margin: 0 0.5rem; color: ${this.tokens.colors.secondary};">/</span>
        <a href="#" style="color: ${this.tokens.colors.primary}; text-decoration: none;">Category</a>
        <span style="margin: 0 0.5rem; color: ${this.tokens.colors.secondary};">/</span>
        <span style="color: ${this.tokens.colors.secondary};">Current Page</span>
      </nav>
    </div>
    `;
  }

  // Основний метод запуску
  run() {
    console.log('🚀 Початок генерації компонентів для Figma...\n');

    this.init();
    this.generateDesignTokens();
    this.generateComponents();

    console.log('\n✨ Готово! Файли згенеровано в директорії:', this.outputDir);
    console.log('\n📋 Наступні кроки:');
    console.log('1. Відкрийте HTML файли в браузері');
    console.log('2. Використайте html.to.design плагін в Figma');
    console.log('3. Імпортуйте design-tokens.json через Figma Tokens плагін');
  }
}

// Запуск
if (require.main === module) {
  const extractor = new ComponentExtractor();
  extractor.run();
}

module.exports = ComponentExtractor;
