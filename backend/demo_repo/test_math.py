from math_utils import divide


def test_divide_by_zero_returns_zero():
    assert divide(10, 0) == 0
