import { Request, Response } from 'express';
import { SuperAdminService } from '../services/SuperAdminService';
import { sendResponse } from '../utils/responseHandler';
import { StatusCode } from '../enums';

export class SuperAdminController {
  private superAdminService: SuperAdminService;

  constructor(superAdminService: SuperAdminService) {
    this.superAdminService = superAdminService;
  }

  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.superAdminService.getDashboardStats();
      sendResponse(res, StatusCode.OK, true, stats);
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, 'Failed to fetch dashboard stats');
    }
  };
}
