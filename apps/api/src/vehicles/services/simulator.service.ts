import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { IVehicleHistory } from './vehicle-history.response';

@Injectable()
export class SimulatorService {
  private readonly simulatorApiUrl: string;
  private readonly logger = new Logger(SimulatorService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('SIMULATOR_API_URL');

    if (!url) {
      throw new Error(
        'SIMULATOR_API_URL is not defined in environment variables',
      );
    }

    this.simulatorApiUrl = url;
  }

  async registerVehicle(data: {
    vin: string;
    license_plate: string;
  }): Promise<void> {
    try {
      const url = `${this.simulatorApiUrl}/simulator/vehicles`;
      await firstValueFrom(this.httpService.post(url, data));
    } catch (error) {
      this.handleError(error as AxiosError, 'register vehicle in simulator');
    }
  }

  async getVehicleHistory(
    licensePlate: string,
    startDate: string,
    endDate: string,
  ): Promise<IVehicleHistory> {
    try {
      const url = `${this.simulatorApiUrl}/simulator/vehicles/${licensePlate}/history`;
      const response: AxiosResponse<IVehicleHistory> = await firstValueFrom(
        this.httpService.get(url, {
          params: { start_date: startDate, end_date: endDate },
        }),
      );

      this.logger.debug(response.data, `get history for plate ${licensePlate}`);

      const data = response.data;
      return data;
    } catch (error) {
      this.handleError(
        error as AxiosError,
        `get history for plate ${licensePlate}`,
      );
    }
  }

  private handleError(error: AxiosError, context: string): never {
    this.logger.error(
      `Error trying to ${context}:`,
      error.response?.data || error.message,
    );

    throw new HttpException(
      {
        message: `Failed to communicate with the simulator service.`,
        details: error.response?.data || error.message,
      },
      error.response?.status || HttpStatus.BAD_GATEWAY,
    );
  }
}
