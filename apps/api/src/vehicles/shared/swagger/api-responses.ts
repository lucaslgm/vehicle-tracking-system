import { applyDecorators, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

type StatusDescriptions = Partial<{
  created: string;
  badRequest: string;
  unauthorized: string;
  conflict: string;
  found: string;
  invalidId: string;
  notFound: string;
  ok: string;
  deleted: string;
  updated: string;
  list: string;
}>;

export function ApiCreateResponse(
  entity = 'Resource',
  descriptions: StatusDescriptions = {},
): MethodDecorator {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiResponse({
      status: 201,
      description: descriptions.created ?? `${entity} created successfully.`,
    }),
    ApiResponse({
      status: 400,
      description: descriptions.badRequest ?? 'Invalid input data.',
    }),
    ApiResponse({
      status: 401,
      description: descriptions.unauthorized ?? 'Unauthorized.',
    }),
    ApiResponse({
      status: 409,
      description: descriptions.conflict ?? `${entity} already exists.`,
    }),
  );
}

export function ApiReadOneResponse(
  entity = 'Resource',
  descriptions: StatusDescriptions = {},
): MethodDecorator {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: 200,
      description: descriptions.found ?? `${entity} found.`,
    }),
    ApiResponse({
      status: 400,
      description: descriptions.invalidId ?? 'Invalid ID format.',
    }),
    ApiResponse({
      status: 401,
      description: descriptions.unauthorized ?? 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: descriptions.notFound ?? `${entity} not found.`,
    }),
  );
}

export function ApiReadAllResponse(
  entity = 'Resources',
  descriptions: StatusDescriptions = {},
): MethodDecorator {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: 200,
      description: descriptions.list ?? `List of ${entity.toLowerCase()}.`,
    }),
    ApiResponse({
      status: 401,
      description: descriptions.unauthorized ?? 'Unauthorized.',
    }),
  );
}

export function ApiReadAllByFilterResponse(
  entity = 'Resources',
  descriptions: StatusDescriptions = {},
): MethodDecorator {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: 200,
      description: descriptions.list ?? `List of ${entity.toLowerCase()}.`,
    }),
    ApiResponse({
      status: 400,
      description: descriptions.invalidId ?? 'Invalid ID format.',
    }),
    ApiResponse({
      status: 401,
      description: descriptions.unauthorized ?? 'Unauthorized.',
    }),
  );
}

export function ApiUpdateResponse(
  entity = 'Resource',
  descriptions: StatusDescriptions = {},
): MethodDecorator {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: 200,
      description: descriptions.updated ?? `${entity} updated successfully.`,
    }),
    ApiResponse({
      status: 400,
      description: descriptions.badRequest ?? 'Invalid input data.',
    }),
    ApiResponse({
      status: 401,
      description: descriptions.unauthorized ?? 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: descriptions.notFound ?? `${entity} not found.`,
    }),
    ApiResponse({
      status: 409,
      description: descriptions.conflict ?? `${entity} already exists.`,
    }),
  );
}

export function ApiDeleteResponse(
  entity = 'Resource',
  descriptions: StatusDescriptions = {},
): MethodDecorator {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: 200,
      description: descriptions.deleted ?? `${entity} deleted successfully.`,
    }),
    ApiResponse({
      status: 400,
      description: descriptions.badRequest ?? 'Invalid input data.',
    }),
    ApiResponse({
      status: 401,
      description: descriptions.unauthorized ?? 'Unauthorized.',
    }),
    ApiResponse({
      status: 404,
      description: descriptions.notFound ?? `${entity} not found.`,
    }),
  );
}
