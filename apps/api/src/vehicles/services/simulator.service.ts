import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { IVehicleHistory } from '@app/common/interfaces';

@Injectable()
export class SimulatorService {
  private readonly simulatorApiUrl: string;
  private readonly apiToken: string;
  private readonly logger = new Logger(SimulatorService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.simulatorApiUrl = this._getRequiredConfig('SIMULATOR_API_URL');
    this.apiToken = this._getRequiredConfig('API_TOKEN');
  }

  async registerVehicle(data: {
    vin: string;
    license_plate: string;
  }): Promise<void> {
    try {
      const url = `${this.simulatorApiUrl}/vehicles`;
      await firstValueFrom(
        this.httpService.post(url, data, {
          headers: { 'x-api-token': this.apiToken },
        }),
      );
    } catch (error) {
      this._handleError(error as AxiosError, 'register vehicle in simulator');
    }
  }

  async getVehicleHistory(
    licensePlate: string,
    startDate: string,
    endDate: string,
  ): Promise<IVehicleHistory> {
    try {
      const url = `${this.simulatorApiUrl}/vehicles/${licensePlate}/history`;
      const response: AxiosResponse<IVehicleHistory> = await firstValueFrom(
        this.httpService.get(url, {
          params: { start_date: startDate, end_date: endDate },
          headers: { 'x-api-token': this.apiToken },
        }),
      );

      const data = response.data;
      return data;
    } catch (error) {
      this._handleError(
        error as AxiosError,
        `get history for plate ${licensePlate}`,
      );
    }
  }

  private _getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      const errorMessage = `Configuration error: ${key} is not defined in environment variables.`;
      this.logger.error(errorMessage);

      throw new ServiceUnavailableException(
        'Service is unavailable due to a configuration error.',
      );
    }
    return value;
  }

  private _handleError(error: AxiosError, context: string): never {
    const request = error.config
      ? `${error.config.method?.toUpperCase()} ${error.config.url}`
      : 'N/A';
    const errorDetails = error.response?.data || error.message;

    this.logger.error(
      `Failed to ${context}. Request: [${request}]`,
      JSON.stringify(errorDetails, null, 2),
      error.stack,
    );

    throw new HttpException(
      {
        message: `Failed to communicate with the simulator service during operation: ${context}.`,
        details: errorDetails,
      },
      error.response?.status || HttpStatus.BAD_GATEWAY,
    );
  }
}
