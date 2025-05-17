from django.core.cache import cache

def is_password_reset_limit_reached(email: str) -> bool:
    """
    Verifica se o número de tentativas de recuperação de senha para o e-mail informado
    atingiu o limite definido (por exemplo, 5 tentativas) em um determinado período.

    :param email: E-mail do usuário.
    :return: True se o limite de tentativas foi atingido, False caso contrário.
    """
    attempts = cache.get(f"password_reset_attempts_{email}") or 0
    return attempts >= 3

def increment_password_reset_attempts(email: str) -> None:
    """
    Incrementa o número de tentativas de recuperação de senha para o e-mail informado.
    Se a chave não existir, ela é criada com um timeout (por exemplo, 15 minutos).
    """
    key = f"password_reset_attempts_{email}"
    if not cache.get(key):
        cache.set(key, 1, timeout=60 * 15)
        # print(f"Chave {key} criada com valor 1")
    else:
        new_value = cache.incr(key)
        # print(f"Chave {key} incrementada para {new_value}")
