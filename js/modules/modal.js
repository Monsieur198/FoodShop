function showModal(modalSelector, modalTimer) {
    document.querySelector(modalSelector).classList.add('show');
    document.body.style.overflow = 'hidden';

    console.log(modalTimer);
    if (modalTimer) {
        clearInterval(modalTimer);
    }    
}

function hideModal(modalSelector) {
    document.querySelector(modalSelector).classList.remove('show');
    document.body.style.overflow = '';
}

function modal (triggerSelector, modalSelector, modalTimer) {
    const modal = document.querySelector(modalSelector),
        modalBtns = document.querySelectorAll(triggerSelector);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal(modalSelector, modalTimer);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modalBtns.forEach(item => {
        item.addEventListener('click', () => showModal(modalSelector, modalTimer));
    });

    window.addEventListener('keydown', evt => {
        if (evt.code === 'Escape' && modal.classList.contains('show')) {
            hideModal(modalSelector);
        }
    });

    modal.addEventListener('click', evt => {
        if (evt.target === modal || evt.target.getAttribute('data-close') == '') {
            hideModal(modalSelector);
        }
    });

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {hideModal};
export {showModal};