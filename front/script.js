function formatDataForExcel(data) {
    const headers = ["Поле", "Значение"];
    const formattedData = Object.entries(data);
    formattedData.unshift(headers);
    return formattedData;
}

function exportToExcel(data) {
    const formattedData = formatDataForExcel(data);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Генерация");
    XLSX.writeFile(workbook, "generation_data.xlsx");
}

document.getElementById('generationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target); 
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    exportToExcel(data);
    alert("Данные успешно экспортированы в Excel!");
});

document.querySelectorAll('.collapsible').forEach(section => {
    const header = section.querySelector('h2');
    const content = section.querySelector('.content');

    header.addEventListener('click', () => {
        const isOpen = content.classList.contains('open');

        // Закрываем текущую секцию, если она открыта
        if (isOpen) {
            content.classList.remove('open');
            content.style.maxHeight = null;
            content.style.padding = '0';
        } else {
            // Открываем текущую секцию
            content.classList.add('open');
            content.style.maxHeight = `${content.scrollHeight}px`;
            content.style.padding = '10px';
        }
    });
});

// Модальные окна и их элементы
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');

// Иконка пользователя и выпадающее меню
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('userDropdown');

// Функция для открытия модального окна
function openModal(modal) {
    modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModalFunction(modal) {
    modal.style.display = 'none';
}

// Обработчики открытия модальных окон
loginButton.addEventListener('click', () => {
    openModal(loginModal);
});

registerButton.addEventListener('click', () => {
    openModal(registerModal);
});

// Обработчики закрытия модальных окон
closeLoginModal.addEventListener('click', () => {
    closeModalFunction(loginModal);
});

closeRegisterModal.addEventListener('click', () => {
    closeModalFunction(registerModal);
});

// Закрытие модальных окон при клике вне их области
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        closeModalFunction(loginModal);
    } else if (event.target === registerModal) {
        closeModalFunction(registerModal);
    } else if (!userDropdown.contains(event.target) && event.target !== userIcon) {
        userDropdown.style.display = 'none';
    }
});

// Тогглинг выпадающего меню при клике на иконку пользователя
userIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Останавливаем всплытие события
    if (userDropdown.style.display === 'block') {
        userDropdown.style.display = 'none';
    } else {
        userDropdown.style.display = 'block';
    }
});

// Закрытие выпадающего меню при клике вне его области
window.addEventListener('click', () => {
    userDropdown.style.display = 'none';
});

// Обработка регистрации
document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const registerRole = document.getElementById('registerRole').value;

    // Получаем существующих пользователей из localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Проверяем, существует ли уже пользователь с таким именем
    const userExists = users.some(user => user.username === newUsername);
    if (userExists) {
        alert('Пользователь с таким именем уже существует!');
        return;
    }

    // Добавляем нового пользователя
    users.push({
        username: newUsername,
        password: newPassword,
        role: registerRole
    });

    // Сохраняем обновленный список пользователей в localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('Регистрация успешно завершена!');
    closeModalFunction(registerModal);
});

// Обработка выбора роли при входе
document.querySelectorAll('.role-button').forEach(button => {
    button.addEventListener('click', () => {
        const role = button.getAttribute('data-role');
        const username = prompt('Введите имя пользователя:');
        const password = prompt('Введите пароль:');

        if (!username || !password) {
            alert('Пожалуйста, введите имя пользователя и пароль.');
            return;
        }

        // Получаем пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Находим пользователя с указанными именем и паролем
        const user = users.find(user => user.username === username && user.password === password && user.role === role);

        if (!user) {
            alert('Неверное имя пользователя, пароль или роль.');
            return;
        }

        // Сохраняем текущего пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        closeModalFunction(loginModal);
        userDropdown.style.display = 'none';
        updateUI(user);
    });
});

// Функция для обновления интерфейса после входа
function updateUI(user) {
    // Изменяем иконку пользователя или добавляем текст
    const userMenu = document.querySelector('.user-menu');
    userMenu.innerHTML = `
        <span class="welcome-text">Добро пожаловать, ${user.username} (${user.role === 'worker' ? 'Сотрудник' : 'Администратор'})</span>
        <button id="logoutButton" class="logout-button">Выйти</button>
    `;

    // Добавляем обработчик для кнопки выхода
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        location.reload(); // Перезагружаем страницу для сброса интерфейса
    });

    // Дополнительно: настройка интерфейса в зависимости от роли
    if (user.role === 'admin') {
        // Например, показать дополнительные секции только для администраторов
        document.querySelectorAll('.admin-only').forEach(section => {
            section.style.display = 'block';
        });
    } else if (user.role === 'worker') {
        // Скрыть административные секции для работников
        document.querySelectorAll('.admin-only').forEach(section => {
            section.style.display = 'none';
        });
    }
}

// Проверка авторизации при загрузке страницы
window.addEventListener('load', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUI(currentUser);
    }
});

document.getElementById("saveButton").addEventListener("click", async () => {
    // Собираем данные формы
    const form = document.getElementById("generationForm");
    const formData = {};

    // Получаем все секции формы
    const sections = form.querySelectorAll("section.collapsible");

    sections.forEach(section => {
        const sectionName = section.querySelector("h2").innerText;
        const data = {};

        // Получаем все поля внутри секции
        const inputs = section.querySelectorAll("input, textarea, select");

        inputs.forEach(input => {
            if (input.type === "checkbox") {
                data[input.name] = input.checked;
            } else if (input.type === "file") {
                // Обработка файлов (можно реализовать загрузку файлов на сервер)
                data[input.name] = input.value.split('\\').pop(); // Получаем имя файла
            } else {
                data[input.name] = input.value;
            }
        });

        formData[sectionName] = data;
    });

    try {
        // Отправляем данные в Python через Eel
        const response = await eel.save_form_data(formData)();

        // Обрабатываем ответ
        if (response.status === "success") {
            alert(response.message);
            form.reset(); // Сбрасываем форму
        } else {
            alert("Ошибка: " + response.message);
        }
    } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
        alert("Произошла ошибка при сохранении данных.");
    }
});

document.getElementById("analyzeButton").addEventListener("click", async () => {
    const data = await eel.get_table_data()();

    // Проверяем на ошибку
    if (data.error) {
        alert("Ошибка: " + data.error);
        return;
    }

    // Создаем таблицу для отображения данных
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = ""; // Очищаем контейнер

    if (data.length === 0) {
        tableContainer.innerHTML = "<p>Нет данных для отображения.</p>";
        return;
    }

    const table = document.createElement("table");
    table.border = "1";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

     // Создаем заголовок таблицы
    const header = table.createTHead();
    const headerRow = header.insertRow();
    Object.keys(data[0]).forEach((key) => {
        const th = document.createElement("th");
        th.textContent = key;
        th.style.padding = "8px";
        th.style.backgroundColor = "#f2f2f2";
        headerRow.appendChild(th);
    });

    // Заполняем таблицу данными
    const body = table.createTBody();
    data.forEach((row) => {
        const tableRow = body.insertRow();
        Object.values(row).forEach((value) => {
            const cell = tableRow.insertCell();
            cell.textContent = value;
            cell.style.padding = "8px";
        });
    });

    tableContainer.appendChild(table);
});