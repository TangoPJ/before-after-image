class BeforeAfter {
    constructor(enteryObject) {
        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.ba-before');
        const afterText = beforeAfterContainer.querySelector('.ba-afterPosition');
        const handle = beforeAfterContainer.querySelector('.ba-handler');
        const beforeInset = beforeAfterContainer.querySelector('.ba-before-inset');
        const MSEC = 1000;
        const handlePosition = 50;
        const beforePosition = 50;

        let containerWidth = beforeAfterContainer.offsetWidth;
        let startOfDiv = beforeAfterContainer.offsetLeft;
        let timeout;

        beforeInset.setAttribute('style', `width: ${beforeAfterContainer.offsetWidth}px;`);
        window.addEventListener('resize', () => {
            beforeInset.setAttribute('style', `width: ${beforeAfterContainer.offsetWidth}px;`);
        });

        // calculates from the new zero point
        const getCurrentPosition = (curPos, startDiv) => curPos - startDiv;

        // default positions
        before.setAttribute('style', `width: ${beforePosition}%;`);
        handle.setAttribute('style', `left: ${handlePosition}%;`);

        // returns to before position the before image and the handle
        const returnToDefaultPosition = time => {
            setTimeout(() => {
                handle.setAttribute('style', `left: ${handlePosition}%;`);
                handle.style.transition = 'all .4s';
                before.setAttribute('style', `width: ${beforePosition}%;`);
                before.style.transition = 'all .4s';
            }, time);
        };

        // touchmove event listener
        beforeAfterContainer.addEventListener('touchmove', e => {
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

        beforeAfterContainer.addEventListener('mousemove', e => {
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
                returnToDefaultPosition();
            }, MSEC);
        });
    }
}