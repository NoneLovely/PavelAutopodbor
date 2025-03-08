const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');

        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        document.querySelector(target).classList.add('active');
    });
});

const burgerMenu = document.getElementById('burger-menu');
const nav = document.getElementById('nav');

burgerMenu.addEventListener('click', () => {
    nav.classList.toggle('hidden');
});

document.querySelector('a[href="#login"]').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('login-popup').classList.remove('hidden');
    showLoginForm();
});

document.getElementById('close-popup').addEventListener('click', function () {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('login-popup').classList.add('hidden');
});

document.getElementById('overlay').addEventListener('click', function () {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('login-popup').classList.add('hidden');
});

document.getElementById('show-register-form').addEventListener('click', function (e) {
    e.preventDefault();
    showRegisterForm();
});

document.getElementById('show-login-form').addEventListener('click', function (e) {
    e.preventDefault();
    showLoginForm();
});

function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
}

ymaps.ready(function () {
    const map = new ymaps.Map("map", {
        center: [55.827419, 49.080956],
        zoom: 12,
    });

    const placemark = new ymaps.Placemark([55.827419, 49.080956], {
        hintContent: "Pavel Avtopodbor",
        balloonContent: "Мы находимся здесь!",
    });

    map.geoObjects.add(placemark);
});

const scriptURL = 'https://script.google.com/macros/s/AKfycbyAy2-rDaG-2tQrZkhJmq67POTjgpTh9QGS80-r6d-yrlDADsGvEKWwLhFzaWzUAW54gg/exec';

async function sendRequest(method, params) {
    const url = new URL(scriptURL);
    url.searchParams.append('method', method);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url);
    return await response.json();
}

async function login(username, password) {
    const response = await sendRequest('login', { username, password });
    if (response.вывод.username) {
        document.getElementById('login-info').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('user-name').textContent = response.вывод.username;
        document.getElementById('user-phone').textContent = response.вывод.phone;

        localStorage.setItem('user', JSON.stringify(response.вывод));

        loadUserRequests(response.вывод.phone);
    } else {
        alert(response.вывод);
    }
}

async function register(username, phone, password1, password2) {
    const response = await sendRequest('register', { username, phone, password1, password2 });
    if (response.вывод.username) {

        alert('Регистрация прошла успешно!');
        showLoginForm();
    } else {
        alert(response.вывод);
    }
}

async function submitRequest(name, phone, message) {
    alert('Заявка успешно отправлена!');

    document.getElementById("reqName").value = "";
    document.getElementById("reqPhone").value = "";
    document.getElementById("reqMessage").value = "";

    const response = await sendRequest('request', { name, phone, message });
}


async function loadUserRequests(phone) {
    const response = await sendRequest('userRequests', { phone });
    const requestsList = document.getElementById('user-requests');
    requestsList.innerHTML = ''; // Очистка списка
    response.вывод.forEach(request => {
        const li = document.createElement('li');
        li.textContent = `Имя: ${request[0]}, Телефон: ${request[1]}, Сообщение: ${request[2]}`;
        requestsList.appendChild(li);
    });
}

async function loadPosts() {
    const response = await sendRequest('posts', {});
    const blogSection = document.getElementById('blog');
    const postsContainer = document.createElement('div');
    postsContainer.className = 'space-y-4';

    response.вывод.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'bg-gray-700 p-6 rounded-lg';
        postDiv.innerHTML = `
            <h3 class="text-xl font-bold text-green-500 mb-2">${post[0]}</h3>
            <p class="text-gray-400">${post[1]}</p>
        `;
        postsContainer.appendChild(postDiv);
    });

    blogSection.appendChild(postsContainer);
}

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('login-info').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('user-name').textContent = user.username;
        document.getElementById('user-phone').textContent = user.phone;
        loadUserRequests(user.phone);
    }
    loadPosts();
});

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('login-info').classList.remove('hidden');
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    login(username, password);
});

document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const password1 = this.querySelector('input[type="password"]').value;
    const password2 = this.querySelectorAll('input[type="password"]')[1].value;
    register(username, phone, password1, password2);
});

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const message = this.querySelector('textarea').value;
    submitRequest(name, phone, message);
});
