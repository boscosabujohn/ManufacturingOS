import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type ForecastMethod = 'moving_average' | 'exponential_smoothing' | 'linear_regression' | 'seasonal' | 'weighted_average';
export type ForecastPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type TrendDirection = 'increasing' | 'decreasing' | 'stable' | 'seasonal';

export interface HistoricalDemand {
  id: string;
  itemId: string;
  itemCode: string;
  period: string;
  actualDemand: number;
  forecastedDemand?: number;
  variance?: number;
  variancePercent?: number;
}

export interface DemandForecast {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  forecastMethod: ForecastMethod;
  forecastPeriod: ForecastPeriod;
  periodsForecast: ForecastPeriodData[];
  totalForecast: number;
  confidence: number;
  trend: TrendDirection;
  seasonalityIndex?: number[];
  generatedAt: string;
  parameters: ForecastParameters;
}

export interface ForecastPeriodData {
  period: string;
  forecast: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface ForecastParameters {
  method: ForecastMethod;
  periods: number;
  smoothingFactor?: number;
  seasonalPeriods?: number;
  weights?: number[];
}

export interface ForecastAccuracy {
  itemId: string;
  itemCode: string;
  mape: number; // Mean Absolute Percentage Error
  mae: number;  // Mean Absolute Error
  rmse: number; // Root Mean Square Error
  bias: number;
  trackingSignal: number;
  periodsAnalyzed: number;
}

export interface DemandPattern {
  itemId: string;
  itemCode: string;
  pattern: 'stable' | 'trend' | 'seasonal' | 'irregular';
  avgDemand: number;
  stdDev: number;
  coefficientOfVariation: number;
  peakPeriods: string[];
  lowPeriods: string[];
  recommendedMethod: ForecastMethod;
}

@Injectable()
export class DemandForecastingService {
  private historicalData: Map<string, HistoricalDemand[]> = new Map();
  private forecasts: DemandForecast[] = [];

  constructor() {
    this.seedMockData();
  }

  async generateForecast(
    itemId: string,
    method: ForecastMethod,
    periodsAhead: number = 6,
    forecastPeriod: ForecastPeriod = 'monthly'
  ): Promise<DemandForecast> {
    const history = this.historicalData.get(itemId);
    if (!history || history.length === 0) {
      throw new Error(`No historical data for item ${itemId}`);
    }

    const demands = history.map(h => h.actualDemand);
    let periodForecasts: ForecastPeriodData[];
    let confidence: number;

    switch (method) {
      case 'moving_average':
        periodForecasts = this.movingAverageForecast(demands, periodsAhead, 3);
        confidence = 0.75;
        break;
      case 'exponential_smoothing':
        periodForecasts = this.exponentialSmoothingForecast(demands, periodsAhead, 0.3);
        confidence = 0.80;
        break;
      case 'linear_regression':
        periodForecasts = this.linearRegressionForecast(demands, periodsAhead);
        confidence = 0.85;
        break;
      case 'weighted_average':
        periodForecasts = this.weightedAverageForecast(demands, periodsAhead);
        confidence = 0.78;
        break;
      case 'seasonal':
        periodForecasts = this.seasonalForecast(demands, periodsAhead);
        confidence = 0.82;
        break;
      default:
        periodForecasts = this.movingAverageForecast(demands, periodsAhead, 3);
        confidence = 0.75;
    }

    // Determine trend
    const trend = this.determineTrend(demands);
    const totalForecast = periodForecasts.reduce((sum, p) => sum + p.forecast, 0);

    const forecast: DemandForecast = {
      id: uuidv4(),
      itemId,
      itemCode: history[0].itemCode,
      itemName: `Item ${history[0].itemCode}`,
      forecastMethod: method,
      forecastPeriod,
      periodsForecast: periodForecasts,
      totalForecast,
      confidence,
      trend,
      generatedAt: new Date().toISOString(),
      parameters: {
        method,
        periods: periodsAhead,
        smoothingFactor: method === 'exponential_smoothing' ? 0.3 : undefined,
      },
    };

    this.forecasts.push(forecast);
    return forecast;
  }

  private movingAverageForecast(demands: number[], periods: number, window: number): ForecastPeriodData[] {
    const results: ForecastPeriodData[] = [];
    const recentDemands = demands.slice(-window);
    const avg = recentDemands.reduce((a, b) => a + b, 0) / recentDemands.length;
    const stdDev = this.calculateStdDev(recentDemands);

    for (let i = 1; i <= periods; i++) {
      const period = this.getFuturePeriod(i);
      results.push({
        period,
        forecast: Math.round(avg),
        lowerBound: Math.round(avg - 1.96 * stdDev),
        upperBound: Math.round(avg + 1.96 * stdDev),
        confidence: 0.75 - (i * 0.02),
      });
    }

    return results;
  }

  private exponentialSmoothingForecast(demands: number[], periods: number, alpha: number): ForecastPeriodData[] {
    const results: ForecastPeriodData[] = [];

    // Calculate smoothed value
    let smoothed = demands[0];
    for (let i = 1; i < demands.length; i++) {
      smoothed = alpha * demands[i] + (1 - alpha) * smoothed;
    }

    const stdDev = this.calculateStdDev(demands);

    for (let i = 1; i <= periods; i++) {
      const period = this.getFuturePeriod(i);
      results.push({
        period,
        forecast: Math.round(smoothed),
        lowerBound: Math.round(smoothed - 1.96 * stdDev),
        upperBound: Math.round(smoothed + 1.96 * stdDev),
        confidence: 0.80 - (i * 0.02),
      });
    }

    return results;
  }

  private linearRegressionForecast(demands: number[], periods: number): ForecastPeriodData[] {
    const results: ForecastPeriodData[] = [];
    const n = demands.length;

    // Calculate linear regression coefficients
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += demands[i];
      sumXY += i * demands[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const residuals = demands.map((d, i) => d - (intercept + slope * i));
    const stdDev = this.calculateStdDev(residuals);

    for (let i = 1; i <= periods; i++) {
      const period = this.getFuturePeriod(i);
      const forecast = intercept + slope * (n + i - 1);
      results.push({
        period,
        forecast: Math.round(Math.max(0, forecast)),
        lowerBound: Math.round(Math.max(0, forecast - 1.96 * stdDev)),
        upperBound: Math.round(forecast + 1.96 * stdDev),
        confidence: 0.85 - (i * 0.02),
      });
    }

    return results;
  }

  private weightedAverageForecast(demands: number[], periods: number): ForecastPeriodData[] {
    const results: ForecastPeriodData[] = [];
    const weights = [0.5, 0.3, 0.2]; // Most recent has highest weight
    const recentDemands = demands.slice(-3);

    let weightedSum = 0;
    for (let i = 0; i < Math.min(recentDemands.length, weights.length); i++) {
      weightedSum += recentDemands[recentDemands.length - 1 - i] * weights[i];
    }

    const stdDev = this.calculateStdDev(demands);

    for (let i = 1; i <= periods; i++) {
      const period = this.getFuturePeriod(i);
      results.push({
        period,
        forecast: Math.round(weightedSum),
        lowerBound: Math.round(weightedSum - 1.96 * stdDev),
        upperBound: Math.round(weightedSum + 1.96 * stdDev),
        confidence: 0.78 - (i * 0.02),
      });
    }

    return results;
  }

  private seasonalForecast(demands: number[], periods: number): ForecastPeriodData[] {
    const results: ForecastPeriodData[] = [];
    const seasonLength = 4; // Quarterly seasonality

    // Calculate seasonal indices
    const seasonalIndices: number[] = [];
    const avg = demands.reduce((a, b) => a + b, 0) / demands.length;

    for (let s = 0; s < seasonLength; s++) {
      let seasonSum = 0;
      let count = 0;
      for (let i = s; i < demands.length; i += seasonLength) {
        seasonSum += demands[i];
        count++;
      }
      seasonalIndices.push(count > 0 ? (seasonSum / count) / avg : 1);
    }

    const stdDev = this.calculateStdDev(demands);

    for (let i = 1; i <= periods; i++) {
      const period = this.getFuturePeriod(i);
      const seasonIndex = seasonalIndices[(demands.length + i - 1) % seasonLength];
      const forecast = avg * seasonIndex;

      results.push({
        period,
        forecast: Math.round(forecast),
        lowerBound: Math.round(forecast - 1.96 * stdDev),
        upperBound: Math.round(forecast + 1.96 * stdDev),
        confidence: 0.82 - (i * 0.02),
      });
    }

    return results;
  }

  async analyzeDemandPattern(itemId: string): Promise<DemandPattern> {
    const history = this.historicalData.get(itemId);
    if (!history || history.length === 0) {
      throw new Error(`No historical data for item ${itemId}`);
    }

    const demands = history.map(h => h.actualDemand);
    const avg = demands.reduce((a, b) => a + b, 0) / demands.length;
    const stdDev = this.calculateStdDev(demands);
    const cv = stdDev / avg;

    // Determine pattern
    let pattern: 'stable' | 'trend' | 'seasonal' | 'irregular';
    let recommendedMethod: ForecastMethod;

    if (cv < 0.2) {
      pattern = 'stable';
      recommendedMethod = 'moving_average';
    } else if (this.hasTrend(demands)) {
      pattern = 'trend';
      recommendedMethod = 'linear_regression';
    } else if (this.hasSeasonality(demands)) {
      pattern = 'seasonal';
      recommendedMethod = 'seasonal';
    } else {
      pattern = 'irregular';
      recommendedMethod = 'exponential_smoothing';
    }

    // Find peak and low periods
    const periodsWithDemand = history.map((h, i) => ({ period: h.period, demand: h.actualDemand, index: i }));
    const sorted = [...periodsWithDemand].sort((a, b) => b.demand - a.demand);
    const peakPeriods = sorted.slice(0, 3).map(p => p.period);
    const lowPeriods = sorted.slice(-3).map(p => p.period);

    return {
      itemId,
      itemCode: history[0].itemCode,
      pattern,
      avgDemand: Math.round(avg),
      stdDev: Math.round(stdDev),
      coefficientOfVariation: Math.round(cv * 100) / 100,
      peakPeriods,
      lowPeriods,
      recommendedMethod,
    };
  }

  async calculateForecastAccuracy(itemId: string): Promise<ForecastAccuracy> {
    const history = this.historicalData.get(itemId);
    if (!history || history.length === 0) {
      throw new Error(`No historical data for item ${itemId}`);
    }

    const withForecasts = history.filter(h => h.forecastedDemand !== undefined);
    if (withForecasts.length === 0) {
      throw new Error('No forecast data available for accuracy calculation');
    }

    let sumApe = 0;
    let sumAe = 0;
    let sumSe = 0;
    let sumError = 0;

    for (const h of withForecasts) {
      const error = h.actualDemand - (h.forecastedDemand || 0);
      const absError = Math.abs(error);
      sumApe += h.actualDemand > 0 ? (absError / h.actualDemand) * 100 : 0;
      sumAe += absError;
      sumSe += error * error;
      sumError += error;
    }

    const n = withForecasts.length;
    const mape = sumApe / n;
    const mae = sumAe / n;
    const rmse = Math.sqrt(sumSe / n);
    const bias = sumError / n;
    const trackingSignal = mae > 0 ? bias / mae : 0;

    return {
      itemId,
      itemCode: history[0].itemCode,
      mape: Math.round(mape * 100) / 100,
      mae: Math.round(mae),
      rmse: Math.round(rmse),
      bias: Math.round(bias),
      trackingSignal: Math.round(trackingSignal * 100) / 100,
      periodsAnalyzed: n,
    };
  }

  async getMultiItemForecast(
    itemIds: string[],
    method: ForecastMethod,
    periods: number
  ): Promise<DemandForecast[]> {
    const forecasts: DemandForecast[] = [];

    for (const itemId of itemIds) {
      try {
        const forecast = await this.generateForecast(itemId, method, periods);
        forecasts.push(forecast);
      } catch {
        // Skip items without historical data
      }
    }

    return forecasts;
  }

  async getForecastSummary(): Promise<{
    totalForecasts: number;
    byMethod: Record<string, number>;
    avgConfidence: number;
    trendDistribution: Record<string, number>;
  }> {
    const byMethod: Record<string, number> = {};
    const trendDistribution: Record<string, number> = {};
    let totalConfidence = 0;

    for (const forecast of this.forecasts) {
      byMethod[forecast.forecastMethod] = (byMethod[forecast.forecastMethod] || 0) + 1;
      trendDistribution[forecast.trend] = (trendDistribution[forecast.trend] || 0) + 1;
      totalConfidence += forecast.confidence;
    }

    return {
      totalForecasts: this.forecasts.length,
      byMethod,
      avgConfidence: this.forecasts.length > 0 ? Math.round((totalConfidence / this.forecasts.length) * 100) / 100 : 0,
      trendDistribution,
    };
  }

  private determineTrend(demands: number[]): TrendDirection {
    if (demands.length < 3) return 'stable';

    const firstHalf = demands.slice(0, Math.floor(demands.length / 2));
    const secondHalf = demands.slice(Math.floor(demands.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = (secondAvg - firstAvg) / firstAvg;

    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    if (this.hasSeasonality(demands)) return 'seasonal';
    return 'stable';
  }

  private hasTrend(demands: number[]): boolean {
    const n = demands.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += demands[i];
      sumXY += i * demands[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const avgDemand = sumY / n;

    return Math.abs(slope) > avgDemand * 0.05;
  }

  private hasSeasonality(demands: number[]): boolean {
    // Simple seasonality detection using autocorrelation
    if (demands.length < 8) return false;

    const avg = demands.reduce((a, b) => a + b, 0) / demands.length;
    const centered = demands.map(d => d - avg);

    // Check for quarterly seasonality (lag 4)
    let numerator = 0;
    let denominator = 0;

    for (let i = 4; i < centered.length; i++) {
      numerator += centered[i] * centered[i - 4];
    }
    for (const c of centered) {
      denominator += c * c;
    }

    const autocorr = denominator > 0 ? numerator / denominator : 0;
    return autocorr > 0.5;
  }

  private calculateStdDev(values: number[]): number {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(v => Math.pow(v - avg, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  private getFuturePeriod(monthsAhead: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsAhead);
    return date.toISOString().slice(0, 7);
  }

  private seedMockData(): void {
    // Item 1: Stable demand
    const item1History: HistoricalDemand[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      item1History.push({
        id: uuidv4(),
        itemId: 'item-001',
        itemCode: 'RM-001',
        period: date.toISOString().slice(0, 7),
        actualDemand: 1000 + Math.floor(Math.random() * 100) - 50,
        forecastedDemand: 1000,
      });
    }
    this.historicalData.set('item-001', item1History);

    // Item 2: Increasing trend
    const item2History: HistoricalDemand[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      item2History.push({
        id: uuidv4(),
        itemId: 'item-002',
        itemCode: 'CP-001',
        period: date.toISOString().slice(0, 7),
        actualDemand: 40 + (11 - i) * 5 + Math.floor(Math.random() * 10) - 5,
        forecastedDemand: 40 + (11 - i) * 5,
      });
    }
    this.historicalData.set('item-002', item2History);

    // Item 3: Seasonal pattern
    const item3History: HistoricalDemand[] = [];
    const seasonalPattern = [1.2, 0.8, 1.3, 0.7];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const basedemand = 500;
      const seasonal = seasonalPattern[(11 - i) % 4];
      item3History.push({
        id: uuidv4(),
        itemId: 'item-003',
        itemCode: 'PK-001',
        period: date.toISOString().slice(0, 7),
        actualDemand: Math.round(basedemand * seasonal + Math.random() * 50 - 25),
        forecastedDemand: Math.round(basedemand * seasonal),
      });
    }
    this.historicalData.set('item-003', item3History);
  }
}
