"use strict";
window.onload = function() {

    class SLider {
        constructor(slider, thumb) {
            this.slider = document.querySelector(slider);
            this.thumb = document.querySelector(thumb);

        }

        events = {
            "thumbCLick": [
                {
                    'target': () => this.slider,
                    'event': 'click',
                    'handler': (e) => this.setClickPosition(e)
                }
            ],
            "thumbDrag": [
                {
                    'target': () => this.thumb,
                    'event': 'mousedown',
                    'handler': (e) => this.setDragPosition(e)
                },
                {
                    'target': () => this.thumb,
                    'event': 'dragstart',
                    'handler': () => false
                }
            ]
        };

        init() {
            this.initEvents(this.events.thumbCLick);
            this.initEvents(this.events.thumbDrag);
        }

        initEvents(eventType) {
            eventType.forEach(el => {
                el.target().addEventListener(el.event, el.handler)
            });
        }

        destroy(eventType) {
            eventType.forEach(el => {
                el.target().removeEventListener(el.event, el.handler)
            });
        }

        setClickPosition(e) {
            if(e.target === this.thumb) return;
            let cordXSlider = this.slider.getBoundingClientRect().x;
            let cordXthumb = e.pageX - cordXSlider - this.thumb.offsetWidth / 2;
            this.thumb.style.left = cordXthumb + 'px';
        }

        setDragPosition(e) {
            let shiftX = e.clientX - e.target.getBoundingClientRect().left;
            let mouseMove = onMouseMove.bind(this);

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', onMouseUp);

            function onMouseMove(e) {
                let newLeft = e.clientX - shiftX - this.slider.getBoundingClientRect().x;

                if(newLeft < 0) {
                    newLeft = 0;
                }

                let rightEdge = this.slider.offsetWidth - this.thumb.offsetWidth;
                if(newLeft > rightEdge) {
                    newLeft = rightEdge;
                }

                this.thumb.style.left = newLeft + 'px';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mousemove', onMouseUp);
            }

        }
    }

    const slider = new SLider('#slider', '.thumb');
    slider.init();
};
