# 2025 Tailwind - WordPress Theme

Це дублікат теми WordPress "Twenty Twenty-Five" з інтегрованим Tailwind CSS 4.1.

## Вимоги

- Node.js >= 20.10.0
- npm >= 10.2.3

## Встановлення

1. Встановіть залежності:
```bash
npm install
```

## Розробка

Для запуску в режимі розробки з автоматичною перезбіркою:

```bash
npm run dev
```

## Збірка для продакшену

Для створення оптимізованої збірки:

```bash
npm run build
```

Зібрані файли будуть знаходитись в директорії `assets/dist/`.

## Структура проекту

- `assets/src/main.css` - головний CSS файл з Tailwind директивами
- `assets/dist/` - зібрані файли (генеруються автоматично)
- `vite.config.js` - конфігурація Vite для збірки
- `functions.php` - функції теми, включає підключення стилів

## Використання Tailwind CSS

Tailwind CSS 4.1 використовує новий синтаксис `@import "tailwindcss"` замість старих директив `@tailwind`.

Ви можете використовувати utility-класи Tailwind в шаблонах, патернах та блоках теми:

```html
<div class="container mx-auto px-4">
  <h1 class="text-4xl font-bold text-blue-600">Hello World</h1>
</div>
```

## Оригінальна тема

Базована на офіційній темі WordPress [Twenty Twenty-Five](https://github.com/WordPress/twentytwentyfive).
