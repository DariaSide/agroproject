from currency_converter import CurrencyConverter

c = CurrencyConverter()

def convert_value(value: float, from_cur: str, to_cur: str) -> float:
    return c.convert(value, from_cur, to_cur)