How to run
Example
index.html
<div class="slider-wrapper" id="slider-wrapper">
    <div class="slider">
        <div class="thumb"></div>
    </div>
    <div class="slider-value"></div>
</div>

js
var slider = new Slider('#slider-wrapper', {
    min: 0,
    max: 100,
    value: 0,
    measurementUnit: '%',
    step: 10
});
slider.init()
