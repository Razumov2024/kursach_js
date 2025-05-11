const bases = [
    { isChosen: false, text: 'Сырная', className: 'button', price: 13.90, img: 'img/pizza2.png', type: 'base' },
    { isChosen: false, text: 'Томатная', className: 'button', price: 19.90, img: 'img/pizza2.png', type: 'base' },
    { isChosen: false, text: 'Чесночная', className: 'button', price: 25.90, img: 'img/pizza2.png', type: 'base' },
    { isChosen: false, text: 'Майонезная', className: 'button', price: 31.90, img: 'img/pizza2.png', type: 'base' }
];

const meats = [
    { isChosen: false, text: 'Пепперони', className: 'button', price: 5.90, img: 'img/pizza3.png', type: 'meat' },
    { isChosen: false, text: 'Охот. колбаски', className: 'button', price: 8.90, img: 'img/pizza3.png', type: 'meat' },
    { isChosen: false, text: 'Курица', className: 'button', price: 7.90, img: 'img/pizza3.png', type: 'meat' },
    { isChosen: false, text: 'Ветчина', className: 'button', price: 9.90, img: 'img/pizza3.png', type: 'meat' },
    { isChosen: false, text: 'Солями', className: 'button', price: 10.90, img: 'img/pizza3.png', type: 'meat' },
    { isChosen: false, text: 'Бекон', className: 'button', price: 6.90, img: 'img/pizza3.png', type: 'meat' }
];

const veggies = [
    { isChosen: false, text: 'Помидоры', className: 'button', price: 2.90, img: 'img/pizza4.png', type: 'veggie' },
    { isChosen: false, text: 'Маслины', className: 'button', price: 5.50, img: 'img/pizza4.png', type: 'veggie' },
    { isChosen: false, text: 'Перец халапеньо', className: 'button', price: 3.80, img: 'img/pizza4.png', type: 'veggie' },
    { isChosen: false, text: 'Болгар. перец', className: 'button', price: 3.50, img: 'img/pizza4.png', type: 'veggie' },
    { isChosen: false, text: 'Красный лук', className: 'button', price: 2.50, img: 'img/pizza4.png', type: 'veggie' },
    { isChosen: false, text: 'Марино. огурцы', className: 'button', price: 4.00, img: 'img/pizza4.png', type: 'veggie' }
];

const sauces = [
    { isChosen: false, text: 'Фирменный', className: 'button', price: 1.90, img: 'img/pizza5.png', type: 'sauce' },
    { isChosen: false, text: 'Альфредо', className: 'button', price: 2.50, img: 'img/pizza5.png', type: 'sauce' },
    { isChosen: false, text: 'Ранч', className: 'button', price: 1.80, img: 'img/pizza5.png', type: 'sauce' },
    { isChosen: false, text: 'Медово горчич.', className: 'button', price: 2.10, img: 'img/pizza5.png', type: 'sauce' }
];

let selectedBase = null;
let selectedMeats = [];
let selectedVeggies = [];
let selectedSauce = null;
let totalPrice = 0;

const ingredientsDisplay = document.getElementById('ingredients-display');
const priceDisplay = document.getElementById('priceDisplay');
const orderButton = document.getElementById('zakaz');
const pizzaContainer = document.querySelector('.pizza-layers');

pizzaContainer.innerHTML = `
    <img src="img/pizza1.png" class="pizza-gray" style="position:absolute; z-index:1;">
    <img src="" class="pizza-base" style="position:absolute; z-index:2; display:none;">
    <img src="" class="pizza-meat" style="position:absolute; z-index:3; display:none;">
    <img src="" class="pizza-veggies" style="position:absolute; z-index:4; display:none;">
    <img src="" class="pizza-complete" style="position:absolute; z-index:5; display:none;">
`;

const pizzaGray = pizzaContainer.querySelector('.pizza-gray');
const pizzaBase = pizzaContainer.querySelector('.pizza-base');
const pizzaMeat = pizzaContainer.querySelector('.pizza-meat');
const pizzaVeggies = pizzaContainer.querySelector('.pizza-veggies');
const pizzaComplete = pizzaContainer.querySelector('.pizza-complete');

// Сохранения заказа в localStorage
function saveOrderToStorage() {
    const order = {
        base: selectedBase,
        meats: selectedMeats,
        veggies: selectedVeggies,
        sauce: selectedSauce,
        totalPrice: totalPrice,
        ingredientsText: ingredientsDisplay.textContent
    };
    localStorage.setItem('currentOrder', JSON.stringify(order));
}

// Обновления области просмотра заказа
function updateIngredientsDisplay() {
    let displayHTML = '<div class="ingredients-list">';
    
    // Основа
    if (selectedBase) {
        displayHTML += `
            <div class="ingredient-item" data-type="base">
                ${selectedBase.text} (${selectedBase.price.toFixed(2)} BYN)
                <span class="remove-ingredient">×</span>
            </div>
        `;
    }
    
    // Мясо
    selectedMeats.forEach((meat, index) => {
        displayHTML += `
            <div class="ingredient-item" data-type="meat" data-index="${index}">
                ${meat.text} (${meat.price.toFixed(2)} BYN)
                <span class="remove-ingredient">×</span>
            </div>
        `;
    });
    
    // Овощи
    selectedVeggies.forEach((veggie, index) => {
        displayHTML += `
            <div class="ingredient-item" data-type="veggie" data-index="${index}">
                ${veggie.text} (${veggie.price.toFixed(2)} BYN)
                <span class="remove-ingredient">×</span>
            </div>
        `;
    });
    
    // Соус
    if (selectedSauce) {
        displayHTML += `
            <div class="ingredient-item" data-type="sauce">
                ${selectedSauce.text} (${selectedSauce.price.toFixed(2)} BYN)
                <span class="remove-ingredient">×</span>
            </div>
        `;
    }
    
    displayHTML += '</div>';
    ingredientsDisplay.innerHTML = displayHTML || 'Ингредиенты: ничего не выбрано';
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-ingredient').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.parentElement;
            const type = item.getAttribute('data-type');
            const index = item.getAttribute('data-index');
            
            removeIngredient(type, index);
        });
    });
}

// удаление ингредиентов
function removeIngredient(type, index) {
    switch(type) {
        case 'base':
            document.querySelector(`.osnovi-container .button.selected`).classList.remove('selected');
            selectedBase = null;
            break;
        case 'meat':
            selectedMeats.splice(index, 1);
            updateMeatButtons();
            break;
        case 'veggie':
            selectedVeggies.splice(index, 1);
            updateVeggieButtons();
            break;
        case 'sauce':
            document.querySelector(`.sauces-container .button.selected`).classList.remove('selected');
            selectedSauce = null;
            break;
    }
    updateUI();
}

// Обновление кнопок мяса
function updateMeatButtons() {
    document.querySelectorAll('.ingredienti-meat-container .button').forEach((btn, i) => {
        btn.classList.toggle('selected', selectedMeats.some(m => m.text === meats[i].text));
    });
}

// Обновление кнопок овощей
function updateVeggieButtons() {
    document.querySelectorAll('.ingredienti-veg-container .button').forEach((btn, i) => {
        btn.classList.toggle('selected', selectedVeggies.some(v => v.text === veggies[i].text));
    });
}

// Основные функции
function updateOrderDisplay() {
    updateIngredientsDisplay();
    calculateTotalPrice();
    priceDisplay.textContent = `Цена: ${totalPrice.toFixed(2)} BYN`;
    updateOrderButton();
    updatePizzaView();
}

function calculateTotalPrice() {
    totalPrice = 0;
    if (selectedBase) totalPrice += selectedBase.price;
    selectedMeats.forEach(m => totalPrice += m.price);
    selectedVeggies.forEach(v => totalPrice += v.price);
    if (selectedSauce) totalPrice += selectedSauce.price;
}

function updatePizzaView() {
    pizzaGray.style.display = 'block';
    pizzaBase.style.display = selectedBase ? 'block' : 'none';
    pizzaMeat.style.display = selectedMeats.length > 0 ? 'block' : 'none';
    pizzaVeggies.style.display = selectedVeggies.length > 0 ? 'block' : 'none';
    
    if (selectedBase) pizzaBase.src = selectedBase.img;
    if (selectedMeats.length > 0) pizzaMeat.src = 'img/pizza3.png';
    if (selectedVeggies.length > 0) pizzaVeggies.src = 'img/pizza4.png';
    
    if (selectedSauce) {
        pizzaComplete.style.display = 'block';
        pizzaComplete.src = 'img/pizza5.png';
        pizzaGray.style.display = 'none';
        pizzaBase.style.display = 'none';
        pizzaMeat.style.display = 'none';
        pizzaVeggies.style.display = 'none';
    } else {
        pizzaComplete.style.display = 'none';
    }
    
    animatePizza();
}

function animatePizza() {
    const layers = [pizzaBase, pizzaMeat, pizzaVeggies, pizzaComplete]
        .filter(layer => layer.style.display !== 'none');
    
    layers.forEach((layer, i) => {
        layer.style.transform = 'scale(0.8)';
        layer.style.opacity = '0';
        setTimeout(() => {
            layer.style.transition = 'all 0.5s ease-out';
            layer.style.transform = 'scale(1)';
            layer.style.opacity = '1';
        }, i * 200);
    });
}

function updateOrderButton() {
    const canOrder = selectedBase && selectedMeats.length > 0 && 
                   selectedVeggies.length > 0 && selectedSauce;
    orderButton.disabled = !canOrder;
    orderButton.style.backgroundColor = canOrder ? '#4CAF50' : '#cccccc';
    orderButton.style.cursor = canOrder ? 'pointer' : 'not-allowed';
}

// Обработчики выбора
function handleBaseSelection(base) {
    bases.forEach(b => b.isChosen = false);
    base.isChosen = true;
    selectedBase = base;
    updateUI();
}

function handleMeatSelection(meat) {
    const index = selectedMeats.findIndex(m => m.text === meat.text);
    
    if (index === -1) {
        if (selectedMeats.length < 2) {
            selectedMeats.push(meat);
        } else {
            alert('Можно выбрать только 2 мясных ингредиента!');
            return;
        }
    } else {
        selectedMeats.splice(index, 1);
    }
    updateUI();
}

function handleVeggieSelection(veggie) {
    const index = selectedVeggies.findIndex(v => v.text === veggie.text);
    
    if (index === -1) {
        if (selectedVeggies.length < 2) {
            selectedVeggies.push(veggie);
        } else {
            alert('Можно выбрать только 2 овощных ингредиента!');
            return;
        }
    } else {
        selectedVeggies.splice(index, 1);
    }
    updateUI();
}

function handleSauceSelection(sauce) {
    sauces.forEach(s => s.isChosen = false);
    sauce.isChosen = true;
    selectedSauce = sauce;
    updateUI();
}

function updateUI() {
    updateOrderDisplay();
    updateButtonStates();
}

function updateButtonStates() {
    document.querySelectorAll('.osnovi-container .button').forEach((btn, i) => {
        btn.classList.toggle('selected', bases[i].isChosen);
    });
    updateMeatButtons();
    updateVeggieButtons();
    document.querySelectorAll('.sauces-container .button').forEach((btn, i) => {
        btn.classList.toggle('selected', sauces[i].isChosen);
    });
}

// обработчики событий
function initEventListeners() {
    // Основы
    document.querySelectorAll('.osnovi-container .button').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleBaseSelection(bases[i]);
        });
    });

    // Мясо
    document.querySelectorAll('.ingredienti-meat-container .button').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleMeatSelection(meats[i]);
        });
    });

    // Овощи
    document.querySelectorAll('.ingredienti-veg-container .button').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleVeggieSelection(veggies[i]);
        });
    });

    // Соусы
    document.querySelectorAll('.sauces-container .button').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSauceSelection(sauces[i]);
        });
    });

    // Кнопка заказа
    orderButton.addEventListener('click', () => {
        if (!orderButton.disabled) {
            saveOrderToStorage();
            window.location.href = 'order.html';
        }
    });
}

function resetOrder() {
    selectedBase = null;
    selectedMeats = [];
    selectedVeggies = [];
    selectedSauce = null;
    bases.forEach(b => b.isChosen = false);
    sauces.forEach(s => s.isChosen = false);
    updateUI();
    resetPizzaView();
}

function resetPizzaView() {
    pizzaGray.style.display = 'block';
    pizzaBase.style.display = 'none';
    pizzaMeat.style.display = 'none';
    pizzaVeggies.style.display = 'none';
    pizzaComplete.style.display = 'none';
}

initEventListeners();
updateOrderDisplay();