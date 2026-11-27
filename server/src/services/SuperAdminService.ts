import { Rezulter } from '../models/Rezulter';
import { Candidate } from '../models/Candidate';
import { Assessment } from '../models/Assessment';

export class SuperAdminService {
  async getDashboardStats() {
    try {
      const [
        totalRezulters,
        totalCandidates,
        totalAssessments,
        liveAssessmentsList
      ] = await Promise.all([
        Rezulter.countDocuments(),
        Candidate.countDocuments(),
        Assessment.countDocuments(),
        Assessment.find({ status: 'active' })
          .populate('rezulterId', 'name')
          .sort({ createdAt: -1 })
          .limit(10)
      ]);

      const liveAssessments = liveAssessmentsList.map(a => ({
        id: a._id,
        name: a.title,
        rezulterName: (a.rezulterId as any)?.name || 'Unknown',
        activeUsers: 0, // Mock for now, requires AssessmentResult joining
        status: a.status
      }));

      return {
        totalRezulters,
        totalCandidates,
        totalAssessments,
        liveAssessments
      };
    } catch (error) {
      throw error;
    }
  }
}
