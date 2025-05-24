# 1. Parar os containers
docker-compose down

# 2. Remover os containers
docker container prune -f

# 3. Remover as imagens
docker image prune -a -f

# 4. Remover volumes (inclui banco de dados, se estiver em volume)
docker volume prune -f

# 5. Remover cache de build
docker builder prune -a -f

# 6. (Opcional) Remover redes
docker network prune -f

# 7. Confirmar que tudo foi limpo
docker system df

# 8. Recriar
docker-compose up --build -d


fake.store.2025@gmail.com
fake.store.2025@project.full.stack



fake.store.2025@FS





Última aula JS!

github: 
git clone https://github.com/thiagooshiro/js-classes


Consumir fakestore api

pagina da API: https://fakestoreapi.com/docs

Vocês devem construir uma aplicação para consumir a API da FakeStore simulando uma página de e-commerce. 
É responsabilidade da dupla estruturar todo html e css, bem como o script em js com as seguintes funcionalidades: 

1 - Ao entrar na página todos os produtos devem ser exibidos na tela.

2 - Implementar um filtro de produtos por nome - esse filtro deve filtrar por carácter de forma parcial e seu comportamento é instantâneo - enquanto você digita ele filtra pelos caracteres existentes.

3 - Implementar filtro de produtos por categoria

4 - Implementar filtro de produtos por preço - esse filtro deve ser "flexível" 
considerando que pode ser para valores acima do valor informado, abaixo do valor informado
ou igual ao valor informado.

Extras:

Criar formulário  e página de cadastro de novos usuários

Criar formulário e página de cadastro de novos produtos.
