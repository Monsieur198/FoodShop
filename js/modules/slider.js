import {getZero} from  '../services/services';

function slider({container, slide, nextArrow, previousArrow, totalSlides, currentSlide, wrapper, field}) {
    const sliderTab = document.querySelector(container),
        slides = sliderTab.querySelectorAll(slide),
        currentCounter = sliderTab.querySelector(currentSlide),
        totalCounter = sliderTab.querySelector(totalSlides),
        next = sliderTab.querySelector(nextArrow),
        prev = sliderTab.querySelector(previousArrow),
        slidesWrapper = sliderTab.querySelector(wrapper),
        slidesField = slidesWrapper.querySelector(field),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = +currentCounter.textContent;

    totalCounter.textContent = getZero(slides.length);

    slidesField.style.cssText = `width: ${100 * slides.length}%; display: flex; transition: 0.5s all;`;
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => slide.style.width = width);

    sliderTab.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    sliderTab.append(indicators);

    function slideTo(n) {
        (n < 1) ? slideIndex = slides.length : n > slides.length ? slideIndex = 1 : slideIndex = n;
        const offset = makeNum(width) * (slideIndex - 1);
        slidesField.style.transform = `translateX(-${offset}px)`;
        dots.forEach(item => item.style.opacity = 0.5);
        dots[slideIndex-1].style.opacity = 1;
        currentCounter.textContent = getZero(slideIndex);
    }

    function makeNum(str) {
        return +str.replace(/\D/g, '');
    }

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        indicators.append(dot);
        dots.push(dot);
        dot.addEventListener('click', () => slideTo(i + 1));
    }

    slideTo(slideIndex);

    next.addEventListener('click', () => slideTo(++slideIndex));

    prev.addEventListener('click', () => slideTo(--slideIndex));
}

export default slider;