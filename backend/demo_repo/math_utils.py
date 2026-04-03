def divide(a, b):
    try:
        a = float(a)
        b = float(b)
    except (TypeError, ValueError) as exc:
        raise TypeError("divide expects numeric values or numeric strings") from exc

    if b == 0:
        return 0

    result = a / b
    return int(result) if result.is_integer() else result
