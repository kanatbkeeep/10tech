$('#threeLines').click(function () {
    if (document.getElementById('navbar').style.top === "50px") {
        $('#navbar').css({
            'top': '-580px',
        });

        $('#header').css({
            'background-color': 'rgba(0, 0, 0, 0.8)',
        });
    } else {
        $('#navbar').css({
            'top': '50px',
        });

        $('#header').css({
            'background-color': '#0a0a0a',
        });
    }
});

$('#dropped1').click(function () {
    if (document.getElementById('droppedList1').style.display === "flex") {
        $('#droppedList1').css({
            'display': 'none',
        });
    } else {
        $('#droppedList1').css({
            'display': 'flex',
        });
    }
});

$('#dropped2').click(function () {
    if (document.getElementById('droppedList2').style.display === "flex") {
        $('#droppedList2').css({
            'display': 'none',
        });
    } else {
        $('#droppedList2').css({
            'display': 'flex',
        });
    }
});

// Модальное окно

// открыть по кнопке
$('.js-button-campaign').click(function () {
    $('main').css('filter', 'blur(5px)');
    $('footer').css('filter', 'blur(5px)');
    $('.js-overlay-campaign').fadeIn();
    if (document.body.offsetWidth <= 890) {
        $('#navbar').css({
            'top': '-580px',
        });
    }
});

// закрыть на крестик
$('.js-close-campaign').click(function () {
    $('.js-overlay-campaign').fadeOut();
    $('.writeToUs').fadeIn();
    $('main').css('filter', 'none');
    $('footer').css('filter', 'none');
});

// закрыть по клику вне окна
$(document).mouseup(function (e) {
    var popup = $('.js-popup-campaign');
    if (e.target != popup[0] && popup.has(e.target).length === 0) {
        $('.js-overlay-campaign').fadeOut();
        $('.writeToUs').fadeIn();
        $('main').css('filter', 'none');
        $('footer').css('filter', 'none');
    }
});

// открыть по кнопке
$('.chat').click(function () {
    $('.chatBox').fadeIn();
});

// закрыть на крестик
$('.close-chat').click(function () {
    $('.chatBox').fadeOut();
});

// ----------------------------------slider-start------------------------------------


'use strict';
var slideShow = (function () {
    return function (selector, config) {
        var
            _slider = document.querySelector(selector), // основный элемент блока
            _sliderContainer = _slider.querySelector('.slider__items'), // контейнер для .slider-item
            _sliderItems = _slider.querySelectorAll('.slider__item'), // коллекция .slider-item
            _sliderControls = _slider.querySelectorAll('.slider__control'), // элементы управления
            _currentPosition = 0, // позиция левого активного элемента
            _transformValue = 0, // значение транфсофрмации .slider_wrapper
            _transformStep = 100, // величина шага (для трансформации)
            _itemsArray = [], // массив элементов
            _timerId,
            _indicatorItems,
            _indicatorIndex = 0,
            _indicatorIndexMax = _sliderItems.length - 1,
            _stepTouch = 50,
            _config = {
                isAutoplay: false, // автоматическая смена слайдов
                directionAutoplay: 'next', // направление смены слайдов
                delayAutoplay: 5000, // интервал между автоматической сменой слайдов
                isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру
            };

        // настройка конфигурации слайдера в зависимости от полученных ключей
        for (var key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }

        // наполнение массива _itemsArray
        for (var i = 0, length = _sliderItems.length; i < length; i++) {
            _itemsArray.push({item: _sliderItems[i], position: i, transform: 0});
        }

        // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
        var position = {
            getItemIndex: function (mode) {
                var index = 0;
                for (var i = 0, length = _itemsArray.length; i < length; i++) {
                    if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
                        index = i;
                    }
                }
                return index;
            },
            getItemPosition: function (mode) {
                return _itemsArray[position.getItemIndex(mode)].position;
            }
        };

        // функция, выполняющая смену слайда в указанном направлении
        var _move = function (direction) {
            var nextItem, currentIndicator = _indicatorIndex;
            ;
            if (direction === 'next') {
                _currentPosition++;
                if (_currentPosition > position.getItemPosition('max')) {
                    nextItem = position.getItemIndex('min');
                    _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
                    _itemsArray[nextItem].transform += _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue -= _transformStep;
                _indicatorIndex = _indicatorIndex + 1;
                if (_indicatorIndex > _indicatorIndexMax) {
                    _indicatorIndex = 0;
                }
            } else {
                _currentPosition--;
                if (_currentPosition < position.getItemPosition('min')) {
                    nextItem = position.getItemIndex('max');
                    _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
                    _itemsArray[nextItem].transform -= _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue += _transformStep;
                _indicatorIndex = _indicatorIndex - 1;
                if (_indicatorIndex < 0) {
                    _indicatorIndex = _indicatorIndexMax;
                }
            }
            _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
            _indicatorItems[currentIndicator].classList.remove('active');
            _indicatorItems[_indicatorIndex].classList.add('active');
        };

        // функция, осуществляющая переход к слайду по его порядковому номеру
        var _moveTo = function (index) {
            var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
            while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
                _move(direction);
                i++;
            }
        };

        // функция для запуска автоматической смены слайдов через промежутки времени
        var _startAutoplay = function () {
            if (!_config.isAutoplay) {
                return;
            }
            _stopAutoplay();
            _timerId = setInterval(function () {
                _move(_config.directionAutoplay);
            }, _config.delayAutoplay);
        };

        // функция, отключающая автоматическую смену слайдов
        var _stopAutoplay = function () {
            clearInterval(_timerId);
        };

        // функция, добавляющая индикаторы к слайдеру
        var _addIndicators = function () {
            var indicatorsContainer = document.createElement('ol');
            indicatorsContainer.classList.add('slider__indicators');
            for (var i = 0, length = _sliderItems.length; i < length; i++) {
                var sliderIndicatorsItem = document.createElement('li');
                if (i === 0) {
                    sliderIndicatorsItem.classList.add('active');
                }
                sliderIndicatorsItem.setAttribute("data-slide-to", i);
                indicatorsContainer.appendChild(sliderIndicatorsItem);
            }
            _slider.appendChild(indicatorsContainer);
            _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
        };

        var _isTouchDevice = function () {
            return !!('ontouchstart' in window || navigator.maxTouchPoints);
        };

        // функция, осуществляющая установку обработчиков для событий
        var _setUpListeners = function () {
            var _startX = 0;
            if (_isTouchDevice()) {
                _slider.addEventListener('touchstart', function (e) {
                    _startX = e.changedTouches[0].clientX;
                    _startAutoplay();
                });
                _slider.addEventListener('touchend', function (e) {
                    var
                        _endX = e.changedTouches[0].clientX,
                        _deltaX = _endX - _startX;
                    if (_deltaX > _stepTouch) {
                        _move('prev');
                    } else if (_deltaX < -_stepTouch) {
                        _move('next');
                    }
                    _startAutoplay();
                });
            } else {
                for (var i = 0, length = _sliderControls.length; i < length; i++) {
                    _sliderControls[i].classList.add('slider__control_show');
                }
            }
            _slider.addEventListener('click', function (e) {
                if (e.target.classList.contains('slider__control')) {
                    e.preventDefault();
                    _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
                    _startAutoplay();
                } else if (e.target.getAttribute('data-slide-to')) {
                    e.preventDefault();
                    _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
                    _startAutoplay();
                }
            });
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === "hidden") {
                    _stopAutoplay();
                } else {
                    _startAutoplay();
                }
            }, false);
            if (_config.isPauseOnHover && _config.isAutoplay) {
                _slider.addEventListener('mouseenter', function () {
                    _stopAutoplay();
                });
                _slider.addEventListener('mouseleave', function () {
                    _startAutoplay();
                });
            }
        };

        // добавляем индикаторы к слайдеру
        _addIndicators();
        // установливаем обработчики для событий
        _setUpListeners();
        // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
        _startAutoplay();

        return {
            // метод слайдера для перехода к следующему слайду
            next: function () {
                _move('next');
            },
            // метод слайдера для перехода к предыдущему слайду
            left: function () {
                _move('prev');
            },
            // метод отключающий автоматическую смену слайдов
            stop: function () {
                _config.isAutoplay = false;
                _stopAutoplay();
            },
            // метод запускающий автоматическую смену слайдов
            cycle: function () {
                _config.isAutoplay = true;
                _startAutoplay();
            }
        }
    }
}());

slideShow('.slider', {
    isAutoplay: true
});


//----------------------------------slider-end------------------------------------

AOS.init();

//-------------------------3d_model_of_VR_helmetSet-------

let scene, camera, renderer, controls;

let canvas = document.getElementById('canvas');

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.set(1, 2, 8);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    renderer.domElement.setAttribute("id", "canvas");
    document.getElementById("canvas").insertBefore(renderer.domElement, canvas.firstChild);

    window.addEventListener('resize', function () {
        let width = document.getElementById('canvas').offsetWidth;
        let height = document.getElementById('canvas').offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    })

    const aLight = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(aLight);

    const pLight = new THREE.PointLight(0xFFFFFF, 1.2);
    pLight.position.set(0, -3, 7);
    scene.add(pLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;

    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('./3d/model/textures/VR_Base_Color.png');
    var material = new THREE.MeshPhongMaterial({map: map});

    let loader = new THREE.OBJLoader();

    loader.load('./3d/model/VR.obj', function (object) {

        // For any meshes in the model, add our material.
        object.traverse(function (node) {

            if (node.isMesh) node.material = material;

        });

        // Add the model to the scene.
        scene.add(object);
    })
}

controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}