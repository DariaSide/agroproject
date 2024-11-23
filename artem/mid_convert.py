import asyncpg
import eel
import asyncio


eel.init('front') 

@eel.expose
async def get_table_test():
    try:
        pool = await asyncpg.create_pool(
            dsn="postgresql://neondb_owner:a0XJgBCt2xMI@ep-rapid-shape-a5bjuo6b.us-east-2.aws.neon.tech/neondb?sslmode=require"
        )
        async with pool.acquire() as conn:

            time = await conn.fetchall('SELECT NOW();')

        await pool.close()

        return time
    
    except Exception as e:
        return {"error": str(e)}

@eel.expose
def get_table_data():
    return asyncio.run(get_table_test())

eel.start('index.html', size=(760, 760))