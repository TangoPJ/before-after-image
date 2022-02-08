import { MSEC, HANDLEPOSITION, BEFOREPOSITION } from './defaults';

class BeforeAfter extends HTMLElement {
    constructor({ id }) {
        super();
        const beforeAfterContainer = document.querySelector(id);
        const before = beforeAfterContainer.querySelector('.ba-before');
        const afterText = beforeAfterContainer.querySelector('.ba-afterPosition');
        const handle = beforeAfterContainer.querySelector('.ba-handler');
        const beforeInset = beforeAfterContainer.querySelector('.ba-before-inset');

        let containerWidth = beforeAfterContainer.offsetWidth;
        let startOfDiv = beforeAfterContainer.offsetLeft;
        let timeout: number;

        beforeInset.setAttribute('style', `width: ${beforeAfterContainer.offsetWidth}px;`);
        window.addEventListener('resize', () => {
            beforeInset.setAttribute('style', `width: ${beforeAfterContainer.offsetWidth}px;`);
        });

        // calculates from the new zero point
        const getCurrentPosition = (curPos: number, startDiv: number) => curPos - startDiv;

        // default positions
        before.setAttribute('style', `width: ${BEFOREPOSITION}%;`);
        handle.setAttribute('style', `left: ${BEFOREPOSITION}%;`);

        // returns to before position the before image and the handle
        const returnToDefaultPosition = (time: number) => {
            setTimeout(() => {
                handle.setAttribute('style', `left: ${BEFOREPOSITION}%;`);
                handle.style.transition = 'all .4s';
                before.setAttribute('style', `width: ${BEFOREPOSITION}%;`);
                before.style.transition = 'all .4s';
            }, time);
        };

        // touchmove event listener
        beforeAfterContainer.addEventListener('touchmove', (e: { changedTouches: { clientX: number; }[]; }) => {
            let currentPoint = Math.floor(e.changedTouches[0].clientX);

            let modifiedCurrentPoint = getCurrentPosition(currentPoint, startOfDiv);

            if (modifiedCurrentPoint < 0) modifiedCurrentPoint = 0;
            if (modifiedCurrentPoint > containerWidth) modifiedCurrentPoint = containerWidth;

            let newWidth = modifiedCurrentPoint * 100 / containerWidth;

            before.setAttribute('style', `width: ${newWidth}%;`);
            afterText.setAttribute('style', 'z-index: 1;');
            handle.setAttribute('style', `left: ${newWidth}%;`);

            // returns to before position the before image and the handle
            beforeAfterContainer.addEventListener('touchend', () => {
                returnToDefaultPosition(MSEC);
            });
        });

        // mousemove event listener
        beforeAfterContainer.addEventListener('mousemove', (e: { clientX: number; }) => {
            let currentPoint = Math.floor(e.clientX);
            let modifiedCurrentPoint = getCurrentPosition(currentPoint, startOfDiv);
            
            if (modifiedCurrentPoint < 0) modifiedCurrentPoint = 0;
            if (modifiedCurrentPoint > containerWidth) modifiedCurrentPoint = containerWidth;
            
            let newWidth = modifiedCurrentPoint * 100 / containerWidth;

            before.setAttribute('style', `width: ${newWidth}%;`);
            afterText.setAttribute('style', 'z-index: 1;');
            handle.setAttribute('style', `left: ${newWidth}%;`);

            // returns to before position the before image and the handle
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                returnToDefaultPosition(MSEC);
            }, MSEC);
        });
    }
}

window.customElements.define(
    'before-after-image',
    BeforeAfter
);