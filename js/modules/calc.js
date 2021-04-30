function calc() {
    const result = document.querySelector('.calculating__result span');

    let sex = localStorage.getItem('sex') ? localStorage.getItem('sex') : 'female',
        ratio = localStorage.getItem('ratio') ? localStorage.getItem('ratio') : 1.375,
        height = localStorage.getItem('height') ? localStorage.getItem('height') : 0,
        weight = localStorage.getItem('weight') ? localStorage.getItem('weight') : 0,
        age = localStorage.getItem('age') ? localStorage.getItem('age') : 0;

    function calcTotal() {
        if (!height || !weight || !age ) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = ((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio).toFixed(0);
        } else {
            result.textContent = ((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio).toFixed(0);
        }
    }

    calcTotal();

    function getStaticInfo(selector, activeClass) {
        const elements = document.querySelectorAll(`${selector}`);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('data-ratio') === ratio || elem.getAttribute('id') === sex) {
                elem.classList.add(activeClass);
            }

            elem.addEventListener('click', (evt) => {
                if (evt.target.getAttribute('data-ratio')) {
                    ratio = +evt.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +evt.target.getAttribute('data-ratio'));
                } else {
                    sex = evt.target.getAttribute('id');
                    localStorage.setItem('sex', evt.target.getAttribute('id'));
                }
    
                elements.forEach(elem => elem.classList.remove(activeClass));
                evt.target.classList.add(activeClass);
    
                calcTotal();
            });       
        });
    }

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);
        if (localStorage.getItem(selector.slice(1)) && localStorage.getItem(selector.slice(1)) != 0) {
            input.value = +localStorage.getItem(selector.slice(1));
        }

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '2px solid red';
            } else {
                input.style.border = '';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    localStorage.setItem('height', +input.value);
                    break;
                case 'weight':
                    weight = +input.value;
                    localStorage.setItem('weight', +input.value);
                    break;
                case 'age':
                    age = +input.value;
                    localStorage.setItem('age', +input.value);
                    break;    
            }

            calcTotal();
        });        
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
}

export default calc;