'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // timer

    const deadline = '2021-05-20';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / 1000 / 60 / 60 / 24),
            hours = Math.floor(t / 1000 / 60 / 60 % 24),
            minutes = Math.floor(t / 1000 / 60 % 60),
            seconds = Math.floor(t / 1000 % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };    
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }        
    }

    setClock('.timer', deadline);

    // modal-window

    const modal = document.querySelector('.modal'),
        modalBtns = document.querySelectorAll('[data-modal]');
        // modalTimer = setTimeout(showModal, 60000);

    function showModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
    }

    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modalBtns.forEach(item => {
        item.addEventListener('click', showModal);
    });

    window.addEventListener('keydown', evt => {
        if (evt.code === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    modal.addEventListener('click', evt => {
        if (evt.target === modal || evt.target.getAttribute('data-close') == '') {
            hideModal();
        }
    });

    window.addEventListener('scroll', showModalByScroll);

    // class cards

    class MenuCard {
        constructor (imgSrc, imgAlt, subtitle, description, price, parent, ...classes) {
            this.imgSrc = imgSrc;
            this.imgAlt = imgAlt;
            this.subtitle = subtitle;
            this.description = description;
            this.price = price;
            this.transfer = 27;
            this.changeToUAH();
            this.parent = document.querySelector(parent);
            this.classes = classes;
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const newCard = document.createElement('div');
            newCard.classList.add('menu__item', ...this.classes);
            newCard.innerHTML =
                `<img src="${this.imgSrc}" alt="${this.imgAlt}">
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>`;
            this.parent.append(newCard);
        }
    }

    document.querySelector('.menu .container').innerHTML = '';

    const getResourse = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResourse('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (evt) => {
            evt.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    // thanks modal

    function showThanksModal (message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            hideModal();
        }, 4000);
    }

    // slider

    const sliderTab = document.querySelector('.offer__slider'),
        slides = sliderTab.querySelectorAll('.offer__slide'),
        currentCounter = sliderTab.querySelector('#current'),
        totalCounter = sliderTab.querySelector('#total'),
        next = sliderTab.querySelector('.offer__slider-next'),
        prev = sliderTab.querySelector('.offer__slider-prev'),
        slidesWrapper = sliderTab.querySelector('.offer__slider-wrapper'),
        slidesField = slidesWrapper.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = +currentCounter.textContent,
        offset = +width.slice(0, -2) * (slideIndex - 1);

    totalCounter.textContent = getZero(slides.length);

    slidesField.style.cssText = `width: ${100 * slides.length}%; display: flex; transition: 0.5s all;`;
    slidesWrapper.style.overflow = 'hidden';
    slidesField.style.transform = `translateX(-${offset}px)`;

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
        slidesField.style.transform = `translateX(-${offset}px)`;
        dots.forEach(item => item.style.opacity = 0.5);
        dots[n-1].style.opacity = 1;
        currentCounter.textContent = getZero(n);
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
        if (i === slideIndex - 1) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
        dot.addEventListener('click', () => {
            slideIndex = i + 1;
            offset = +width.slice(0, -2) * (slideIndex - 1);
            slideTo(slideIndex);
        });
    }

    next.addEventListener('click', () => {
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
            offset = 0;
        } else {
            offset += +width.slice(0, -2);
        }
        slideTo(slideIndex);
    });

    prev.addEventListener('click', () => {
        slideIndex--;
        if (slideIndex < 1) {
            slideIndex = slides.length;
            offset = +width.slice(0, -2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, -2);
        }
        slideTo(slideIndex);
    });
});