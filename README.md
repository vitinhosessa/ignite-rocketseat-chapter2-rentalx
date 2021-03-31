# Cadastro de Carro
**Req Funcionais**
Deve ser possivel cadastrar um novo carro.

**Regra de Negocio**
Não deve ser possivel cadastrar um carro com uma placa existente.
O carro deve ser cadastrado com disponibilidade true por padrão.
*Apenas administradores podem cadastrar carros.


# Listagem de Carros
**Req Funcionais**
Deve ser possivel listar todos os carros disponiveis.
Deve ser possivel listar todos os carros disponiveis pelo nome da categoria.
Deve ser possivel listar todos os carros disponiveis pelo nome da marca.
Deve ser possivel listar todos os carros disponiveis pelo nome da carro.

**Regra de Negocio**
Usuario não precisa estar logado no sistema.


# Cadastro de Especificação
**Req Funcionais**
Deve ser possivel cadastrar uma especificação para um carro.
Deve ser possivel listar todas as especificações.
Deve ser possivel listar todos os carros.

**Regra de Negocio**
Não deve ser possivel cadastrar uma especificação para um carro não cadastrado.
Não deve ser possivel cadastrar uma especificação já existente para o mesmo carro. 
Apenas administradores podem cadastrar especificações.


# Cadastro de Imagens do Carro
**Req Funcionais**
Deve ser possivel cadastrar a imagem do carro.
Deve ser possivel listar todos os carros.

**Req Não Funcionais**
Utilizar o multer para upload dos arquivos.

**Regra de Negocio**
O usuario deve poder cadastrar mais de uma imagem do mesmo carro.
Apenas administradores podem cadastrar as imagens.


# Aluguel de Carro
**Req Funcionais**
Deve ser possivel cadastrar um aluguel

**Regra de Negocio**
O aluguel deve duração minima de 24 horas.
Não deve ser possivel cadastrar um novo aluguel caso já exista um aberto para o mesmo usuario.
Não deve ser possivel cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
