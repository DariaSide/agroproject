import eel
import asyncio
import asyncpg
import pandas as pd
import os
from openpyxl import load_workbook

# Инициализация Eel
#eel.init('front')

# Путь к Excel-файлу
EXCEL_FILE = 'data.xlsx'

# Функция для подключения к базе данных и получения данных
#@eel.expose
def get_table_data():
    async def fetch_data():
        try:
            pool = await asyncpg.create_pool(
                dsn="postgresql://neondb_owner:a0XJgBCt2xMI@ep-rapid-shape-a5bjuo6b.us-east-2.aws.neon.tech/neondb?sslmode=require"
            )
            async with pool.acquire() as conn:
                # Пример запроса, замените на ваш
                query = "SELECT * FROM data LIMIT 10;"

                # fetch
                rows = await conn.fetch(query)
                print(rows)
                if rows:
                    colnames = rows[0].keys()
                    data = [dict(row) for row in rows]
                else:
                    data = []
            await pool.close()
            return data
        except Exception as e:
            return {"error": str(e)}
    
    return asyncio.run(fetch_data())
get_table_data()


# Функция для сохранения данных из формы в Excel
# @eel.expose
# def save_form_data(form_data):
#     try:
#         # Преобразуем данные из формы в DataFrame
#         df = pd.DataFrame([form_data])

#         # Если файл существует, добавляем данные, иначе создаем новый файл
#         if os.path.exists(EXCEL_FILE):
#             # Читаем существующий файл
#             existing_df = pd.read_excel(EXCEL_FILE)
#             # Объединяем данные
#             combined_df = pd.concat([existing_df, df], ignore_index=True)
#             # Записываем обратно
#             combined_df.to_excel(EXCEL_FILE, index=False)
#         else:
#             # Создаем новый Excel-файл
#             df.to_excel(EXCEL_FILE, index=False)
        
#         return {"status": "success", "message": "Данные успешно сохранены."}
#     except Exception as e:
#         return {"status": "error", "message": str(e)}

# # Запуск Eel
# eel.start('index.html', size=(760, 760))
