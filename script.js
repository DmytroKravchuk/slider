"use strict";
window.onload = function() {

    class Slider {
        constructor(slider, thumb, props) {
            this.slider = document.querySelector(slider);
            this.sliderWidth = this.slider.offsetWidth;
            this.thumb = document.querySelector(thumb);
            this.config = {
                min: props.min || 0,
                max: props.max || 100,
                step: props.step || 1,
                start: props.start || [0, 100],
                isMultiple: props.isMultiple || false
            }
        }

        events = [
            {
                'target': () => this.slider,
                'event': 'click',
                'handler': (e) => this.setClickPosition(e)
            },
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
        ];

        init() {
            this.slider.append(this._createBarValue());
            this.initEvents();
            this.setValue(this.config.start);
        }

        initEvents() {
            this.events.forEach(el => {
                el.target().addEventListener(el.event, el.handler)
            });
        }

        destroy(eventType) {
            this.events.forEach(el => {
                el.target().removeEventListener(el.event, el.handler)
            });
        }

        setClickPosition(e) {
            if(e.target === this.thumb) return;
            let cordXSlider = this.slider.getBoundingClientRect().x;
            let cordXthumb = e.pageX - cordXSlider - this.thumb.offsetWidth / 2;
            if(cordXthumb >= 0) {
                let value = Math.round(parseFloat(cordXthumb *  this.config.max / this.sliderWidth));
                this.setValue(value);
            }
        }

        setDragPosition(e) {
            let shiftX = e.clientX - e.target.getBoundingClientRect().left;
            let mouseMove = onMouseMove.bind(this);
            let self = this;
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
                let value = Math.round(parseFloat(newLeft *  this.config.max / this.sliderWidth));
                self.setValue(value);
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mousemove', onMouseUp);
            }
        }

        setValue(value) {
            if(!this.config.isMultiple) {
                this.bar.style.width = this._calcCorrectValue(value) + 'px';
                this.barValue.style.left = this._calcCorrectValue(value) + 'px';
                this.barValue.innerHTML = value;
                this.thumb.style.left = this._calcCorrectValue(value) + 'px';
            }
        }

        _createBarValue() {
            let wrapValue = document.createElement('div');
            this.bar = document.createElement('div');
            this.bar.classList.add('bar-value');

            if(!this.config.isMultiple) {
                this.barValue = document.createElement('span');
                this.barValue.classList.add('value');
                this.barValue.innerText = this.config.start[0];
                wrapValue.append(this.bar);
                wrapValue.append(this.barValue);
            }

            return wrapValue;
        }

        _calcCorrectValue(value) {
            return Math.round(parseFloat(value * this.sliderWidth / this.config.max));
        }
    }

    const slider = new Slider('#slider', '.thumb', {
        min: 0,
        max: 150,
        step: 1,
        start: [10],
    });

    slider.init();

};
