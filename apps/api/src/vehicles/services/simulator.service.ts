import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { VehicleHistoryResponseDto } from '../dtos/vehicle-history.response.dto';

@Injectable()
export class SimulatorService {
  private readonly simulatorApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('SIMULATOR_API_URL');

    console.log('SIMULATOR_API_URL:', url);

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
      const url = `${this.simulatorApiUrl}/simulator/internal/vehicles`;
      await firstValueFrom(this.httpService.post(url, data));
    } catch (error) {
      this.handleError(error as AxiosError, 'register vehicle in simulator');
    }
  }

  async getVehicleHistory(
    licensePlate: string,
    startDate: string,
    endDate: string,
  ): Promise<VehicleHistoryResponseDto> {
    try {
      const url = `${this.simulatorApiUrl}/simulator/history/${licensePlate}`;
      const response: AxiosResponse<VehicleHistoryResponseDto> =
        await firstValueFrom(
          this.httpService.get(url, {
            params: { start_date: startDate, end_date: endDate },
          }),
        );

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
    // Em um cenário real, poderíamos lançar uma exceção mais específica
    // ou implementar um mecanismo de retry (tentar novamente).
    console.error(
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
