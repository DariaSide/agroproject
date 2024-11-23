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

        // Закрываем все остальные секции (необязательно, если требуется только одна открытая секция)
        document.querySelectorAll('.collapsible .content.open').forEach(openContent => {
            openContent.classList.remove('open');
            openContent.style.maxHeight = null; // Сброс высоты
            openContent.style.padding = '0'; // Скрываем отступы
        });

        // Открываем или закрываем текущую секцию
        if (!isOpen) {
            content.classList.add('open');
            content.style.maxHeight = `${content.scrollHeight}px`; // Устанавливаем точную высоту
            content.style.padding = '10px'; // Восстанавливаем отступы
        } else {
            content.classList.remove('open');
            content.style.maxHeight = null;
            content.style.padding = '0'; // Скрываем отступы
        }
    });
});



