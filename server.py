import eel
import asyncio
import asyncpg
import pandas as pd
import os
from openpyxl import load_workbook

# Инициализация Eel
eel.init('front')

# Путь к Excel-файлу
EXCEL_FILE = 'data.xlsx'

# Функция для подключения к базе данных и получения данных
@eel.expose
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



@eel.expose
def save_form_data(form_data):
    try:
        if os.path.exists(EXCEL_FILE):
            # Загружаем существующий Excel-файл
            book = load_workbook(EXCEL_FILE)
            writer = pd.ExcelWriter(EXCEL_FILE, engine='openpyxl')
            writer.book = book
            writer.sheets = {ws.title: ws for ws in book.worksheets}
        else:
            # Создаём новый Excel-файл
            writer = pd.ExcelWriter(EXCEL_FILE, engine='openpyxl')

        for section, data in form_data.items():
            df = pd.DataFrame([data])

            if section in writer.sheets:
                # Читаем существующий лист
                existing_df = pd.read_excel(writer, sheet_name=section)
                # Объединяем данные
                combined_df = pd.concat([existing_df, df], ignore_index=True)
            else:
                # Создаём новый лист
                combined_df = df

            # Записываем данные в лист
            combined_df.to_excel(writer, sheet_name=section, index=False)

        writer.save()
        writer.close()
        return {"status": "success", "message": "Данные успешно сохранены."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

eel.start('index.html', size=(760, 760))
