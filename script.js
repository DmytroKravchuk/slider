/* eslint-disable no-unused-vars*/

function Slider(sliderContainerSelector, props) {
    var sliderContainer = document.querySelector(sliderContainerSelector);
    var slider = sliderContainer.querySelector('.slider');
    var thumb = sliderContainer.querySelector('.thumb');
    var output = props ? sliderContainer.querySelector('.slider-value') : null;
    var currentValue = 0;

    this.getValue = function () {
        return currentValue;
    };

    var events = [
        {
            'target': function () {return slider;},
            'event': 'click',
            'handler': setClickPosition
        },
        {
            'target': function () {return thumb;},
            'event': 'mousedown',
            'handler': function (e) {return setDragPosition(e, 'mousemove', 'mouseup');}
        },
        {
            'target': function () {return thumb;},
            'event': 'dragstart',
            'handler': function () {return false;}
        },
        {
            'target': function () {return thumb;},
            'event': 'touchstart',
            'handler': function (e) {return setDragPosition(e, 'touchmove', 'touchend');}
        },
        {
            'target': function () {return sliderContainer;},
            'event': 'onSliderChangeValue',
            'handler': this.getValue.bind(this)
        },
        {
            'target': function () {return sliderContainer;},
            'event': 'swipeleft',
            'handler': preventSwipe
        },
        {
            'target': function () {return sliderContainer;},
            'event': 'swiperight',
            'handler': preventSwipe
        }
    ];

    var sliderEvent = new CustomEvent('onSliderChangeValue');

    this.init = function () {
        initEvents(events);
        setValue(0);
    };

    function preventSwipe(e) {
        e.stopPropagation();
    }

    function initEvents(eventType) {
        eventType.forEach(function (el) {
            el.target().addEventListener(el.event, el.handler);
        });
    }

    this.destroy = function (eventType) {
        eventType.forEach(function (el) {
            el.target().removeEventListener(el.event, el.handler);
        });
    };

    function setClickPosition(e) {
        if (e.target === thumb) return;
        var cordXSlider = slider.getBoundingClientRect().x;
        var cordXthumb = e.pageX - cordXSlider - thumb.offsetWidth / 2;
        setValue(cordXthumb, true);
    }

    function setDragPosition(e, eventMove, eventEnd) {
        e.stopPropagation();
        var shiftX = (e.clientX || e.changedTouches[0].clientX) - e.target.getBoundingClientRect().left;
        var mouseMove = onMouseMove.bind(this);

        document.addEventListener(eventMove, mouseMove);
        document.addEventListener(eventEnd, onMouseUp);

        function onMouseMove(event) {
            var newLeft = (event.clientX || event.changedTouches[0].clientX) - shiftX - slider.getBoundingClientRect().x;
            if (newLeft < 0) {
                newLeft = 0;
            }

            if (newLeft > slider.offsetWidth) {
                newLeft = slider.offsetWidth;
            }
            setValue(newLeft, true);
        }

        function onMouseUp() {
            document.removeEventListener(eventMove, mouseMove);
            document.removeEventListener(eventMove, onMouseUp);
        }
    }

    function calcSliderValue(cssValue) {
        var abs = Math.abs(props.max - props.min);
        if (props.step) {
            return Math.round(Math.round(cssValue * abs / slider.offsetWidth) / props.step) * props.step;
        }
        return Math.round(cssValue * abs / slider.offsetWidth);
    }

    function setValue(value, isCss) {
        var abs = Math.abs(props.max - props.min);
        currentValue = calcSliderValue(value);
        sliderContainer.dispatchEvent(sliderEvent);
        if (isCss) {
            var percentValue = value / slider.offsetWidth * 100;
            slider.style.backgroundImage = 'linear-gradient(to right, #3961ac 0, #3961ac ' + percentValue + '%, #b3b2b5 ' + percentValue + '%)';
            thumb.style.left = value + 'px';
            output.innerHTML = currentValue + (props.measurementUnit ? props.measurementUnit : '');
            return;
        }
        output.innerHTML = value + (props.measurementUnit ? props.measurementUnit : '');
        thumb.style.left = value * slider.offsetWidth / abs + 'px';
    }
}


