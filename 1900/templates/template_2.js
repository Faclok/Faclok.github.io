// Находим все элементы с классом "slide" — это наши слайды на странице
const slides = document.querySelectorAll(".slide");

// Создаём настройки для наблюдателя IntersectionObserver
const observerOptions = {
  // threshold: 0.5 означает, что слайд считается "видимым",
  // когда минимум 50% его высоты внутри экрана
  threshold: 0.5
};

// Функция-обработчик, которая будет вызываться, когда слайды заходят в зону видимости
const onSlideIntersect = (entries) => {
  // entries — массив объектов, каждый объект описывает один наблюдаемый элемент
  entries.forEach((entry) => {
    // entry.target — это сам DOM-элемент (наш .slide)
    const slideElement = entry.target;

    // entry.isIntersecting === true, когда элемент пересёк границу видимости
    if (entry.isIntersecting) {
      // Добавляем класс .slide--active,
      // чтобы включить анимацию показа слайда (см. CSS)
      slideElement.classList.add("slide--active");
    } else {
      // Удаляем класс .slide--active, если слайд ушёл из зоны видимости.
      // Если хочешь, чтобы слайды "зажигались" только один раз
      // и больше не исчезали — можно эту строку закомментировать.
      slideElement.classList.remove("slide--active");
    }
  });
};

// Создаём экземпляр IntersectionObserver и передаём ему нашу функцию и настройки
const slideObserver = new IntersectionObserver(onSlideIntersect, observerOptions);

// Запускаем наблюдение для каждого слайда
slides.forEach((slide) => {
  // Подключаем наблюдатель к конкретному слайду
  slideObserver.observe(slide);
});

/*
  Если хочешь поиграть с эффектом "супер плавной" смены слайдов,
  можно изменить threshold выше:
    - threshold: 0.7 — слайд станет активным только тогда,
      когда 70% высоты будет в зоне экрана.
    - threshold: 0.3 — слайд будет включаться раньше.

  Для этого достаточно поменять число в observerOptions.threshold.
*/
