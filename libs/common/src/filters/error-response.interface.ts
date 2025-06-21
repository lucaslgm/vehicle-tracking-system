// Este é o formato de resposta de erro que será retornado pelo filtro de exceção
// quando uma exceção não tratada ocorrer na aplicação.
// Ele é usado para padronizar as respostas de erro em toda a aplicação,
// facilitando o tratamento de erros no frontend ou em outros serviços que consomem a API.
// Ele pode ser usado em conjunto com o filtro de exceção global do NestJS
// para garantir que todas as exceções sejam capturadas e retornadas nesse formato.

export interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | object;
}
