// ============================
// 1. АНИМАЦИЯ "ПЕЧАТИ" В ЗАГОЛОВКЕ
// ============================

// Находим элемент, в который будем "печатать" текст
const typingTextElement = document.getElementById("typing-text");

// Находим элемент-курсор (мигающая палочка)
const caretElement = document.getElementById("typing-caret");

// Текст, который будет постепенно появляться
const typingText = "работаю и не сдаюсь";

// Скорость печати символов (миллисекунды между буквами)
// Значение для удобства берём из CSS переменной, но можно просто
// поменять число здесь, например 60 или 120
let typingSpeed = 85; // по умолчанию 85 мс на символ

// Пробуем прочитать значение CSS-переменной --typing-speed
// Это опционально: если не хочется связываться с CSS, можно удалить этот блок
const rootStyles = getComputedStyle(document.documentElement); // читаем стили :root
const cssTypingSpeedValue = rootStyles.getPropertyValue("--typing-speed").trim(); // достаем значение

// Если в CSS указали число и оно не пустое — используем его вместо 85
if (cssTypingSpeedValue) {
  // parseInt превращает строку "85ms" или "85" в число 85
  const parsedSpeed = parseInt(cssTypingSpeedValue, 10);
  // Проверяем, что получилось корректное число, и подставляем
  if (!Number.isNaN(parsedSpeed)) {
    typingSpeed = parsedSpeed;
  }
}

// Индекс текущего символа, который будем добавлять
let typingIndex = 0;

// Функция, которая по одному добавляет символы в заголовок
function typeNextCharacter() {
  // Если элемента нет (кто-то удалил в HTML), выходим
  if (!typingTextElement) return;

  // Если ещё не дописали весь текст
  if (typingIndex < typingText.length) {
    // Добавляем следующий символ к уже существующему тексту
    typingTextElement.textContent += typingText.charAt(typingIndex);

    // Переходим к следующему символу
    typingIndex += 1;

    // Запускаем эту же функцию ещё раз через typingSpeed миллисекунд
    setTimeout(typeNextCharacter, typingSpeed);
  } else {
    // Если текст полностью дописан, можно при желании что-то сделать
    // Например, убрать курсор через секунду:
    setTimeout(() => {
      if (caretElement) {
        caretElement.style.opacity = "0";
      }
    }, 1000);
  }
}

// Запускаем печать после небольшой задержки, чтобы всё успело отрисоваться
setTimeout(typeNextCharacter, 400);

// ============================
// 2. ПРОГРЕСС-ПОЛОСА ПРИ СКРОЛЛЕ
// ============================

// Находим элемент полосы прогресса
const scrollBar = document.getElementById("scroll-progress-bar");

// Функция, которая пересчитывает длину полосы при прокрутке
function updateScrollProgress() {
  // Высота всей страницы с учётом прокрутки (scrollHeight)
  const scrollHeight = document.documentElement.scrollHeight;

  // Высота окна браузера (innerHeight)
  const windowHeight = window.innerHeight;

  // Текущее значение прокрутки сверху (scrollTop)
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  // Максимально возможный "путь" прокрутки
  const scrollable = scrollHeight - windowHeight;

  // Защита от деления на ноль, если страница маленькая
  if (scrollable <= 0) {
    // Если скроллить особо некуда, просто делаем полосу заполненной
    if (scrollBar) scrollBar.style.width = "100%";
    return;
  }

  // Доля прокрутки от 0 до 1
  const fraction = scrollTop / scrollable;

  // Переводим в проценты от 0 до 100
  const percent = fraction * 100;

  // Обновляем ширину полосы
  if (scrollBar) {
    scrollBar.style.width = `${percent}%`;
  }
}

// Подписываемся на событие скролла
window.addEventListener("scroll", updateScrollProgress);

// Вызываем один раз при загрузке страницы
updateScrollProgress();

// ============================
// 3. ПОЯВЛЕНИЕ БЛОКОВ ПРИ СКРОЛЛЕ (FADE-IN)
// ============================

// Ищем все блоки, которые помечены атрибутом data-block
const fadeBlocks = document.querySelectorAll("[data-block]");

// Настройки для IntersectionObserver
const fadeObserverOptions = {
  // threshold: 0.3 — блок считается видимым, когда 30% его высоты в зоне экрана
  threshold: 0.3
};

// Функция-обработчик появления блоков
function onBlockIntersect(entries) {
  // entries — массив наблюдаемых элементов
  entries.forEach((entry) => {
    // Если блок вошёл в зону видимости
    if (entry.isIntersecting) {
      // Добавляем класс, который включает анимацию
      entry.target.classList.add("block--visible");
    } else {
      // Если нужно, чтобы блок исчезал при уходе из экрана,
      // можно раскомментировать строчку ниже:
      // entry.target.classList.remove("block--visible");
    }
  });
}

// Создаём наблюдатель для блоков
const fadeObserver = new IntersectionObserver(onBlockIntersect, fadeObserverOptions);

// Подключаем наблюдатель ко всем блокам
fadeBlocks.forEach((block) => fadeObserver.observe(block));

// ============================
// 4. ПОЯВЛЕНИЕ "ВНУТРЕННИХ" ЭЛЕМЕНТОВ (data-fade)
// ============================

// Ищем все элементы, у которых есть атрибут data-fade
const innerFadeElements = document.querySelectorAll("[data-fade]");

// Настройки для второго наблюдателя
const innerFadeOptions = {
  threshold: 0.4 // элемент будет "загораться", когда 40% высоты видны на экране
};

// Функция для внутренних элементов
function onInnerFade(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Добавляем класс, который включает анимацию появления
      entry.target.classList.add("fade--visible");
    } else {
      // Если хотим, чтобы исчезали при скролле назад — можно раскомментировать:
      // entry.target.classList.remove("fade--visible");
    }
  });
}

// Создаём наблюдатель для внутренних элементов
const innerFadeObserver = new IntersectionObserver(onInnerFade, innerFadeOptions);

// Подключаем наблюдение ко всем data-fade элементам
innerFadeElements.forEach((el) => innerFadeObserver.observe(el));

// ============================
// 5. СЧЁТЧИК "ПОПЫТОК" И ЗАПОЛНЕНИЕ ЛИНИИ
// ============================

// Находим элементы счётчика и полосы усилий
const effortCountElement = document.getElementById("effort-count");
const effortBarElement = document.getElementById("effort-bar");

// Задаём максимальное количество "попыток", до которых будет считать
const effortMax = 10;

// Стартовое значение счётчика
let effortCurrent = 0;

// Флаг, чтобы анимация запустилась только один раз
let effortAnimated = false;

// Функция, которая плавно увеличивает счётчик и ширину полосы
function animateEffort() {
  // Если анимация уже прошла, выходим
  if (effortAnimated) return;

  // Ставим флаг, что начинаем анимацию один раз
  effortAnimated = true;

  // Интервал между шагами (миллисекунды)
  const stepDelay = 150;

  // Внутренняя функция, которая будет вызвана несколько раз
  function step() {
    // Увеличиваем текущее значение, пока оно меньше максимального
    if (effortCurrent < effortMax) {
      // Увеличиваем число на 1
      effortCurrent += 1;

      // Обновляем текст в счётчике
      if (effortCountElement) {
        effortCountElement.textContent = String(effortCurrent);
      }

      // Вычисляем процент для полосы (от 0 до 100)
      const percent = (effortCurrent / effortMax) * 100;

      // Обновляем ширину линии усилий
      if (effortBarElement) {
        effortBarElement.style.width = `${percent}%`;
      }

      // Планируем следующий шаг через stepDelay миллисекунд
      setTimeout(step, stepDelay);
    }
  }

  // Запускаем первый шаг
  step();
}

// Создаём отдельный наблюдатель, чтобы понять, когда блок "усилия" попадает в зону экрана
if (effortBarElement) {
  // Находим ближайший родительский блок с атрибутом data-block (секция)
  const effortSection = effortBarElement.closest("[data-block]");

  if (effortSection) {
    // Настройки — достаточно, чтобы 30% секции были видны
    const effortObserverOptions = { threshold: 0.3 };

    // Функция-обработчик
    const effortObserverCallback = (entries) => {
      entries.forEach((entry) => {
        // Как только секция появилась — запускаем анимацию счётчика
        if (entry.isIntersecting) {
          animateEffort();
        }
      });
    };

    // Создаём наблюдатель
    const effortObserver = new IntersectionObserver(
      effortObserverCallback,
      effortObserverOptions
    );

    // Подключаем наблюдение к секции
    effortObserver.observe(effortSection);
  }
}

/*
  Кратко, что можно менять самому:

  1) Текст печати:
     - переменная typingText — можно вписать свой текст.
     - typingSpeed — изменить скорость печати (чем меньше число, тем быстрее).

  2) Полоса скролла:
     - ничего трогать не нужно, но можно изменить её цвет в CSS: .scroll-progress__bar.

  3) Появление блоков:
     - threshold в fadeObserverOptions / innerFadeOptions:
       больше число — позже появляются элементы.

  4) Счётчик усилий:
     - effortMax — до какого числа считать.
     - stepDelay — как быстро растут числа.
*/
