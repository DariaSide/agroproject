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



