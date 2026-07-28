import { Model, Document } from 'mongoose';
import { IBaseRepository } from '../interfaces/repositories';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const newDoc = new this.model(data);
    return await newDoc.save();
  }

  async findByEmail(email: string): Promise<T | null> {
    // Assuming the document has an email field. We cast to any for the query object.
    return await this.model.findOne({ email } as unknown as Record<string, unknown>);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findAll(
    options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' },
    baseQuery: Record<string, unknown> = {}
  ): Promise<{ data: T[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }> {
    const { page, limit, search, isActive, sortField = 'createdAt', sortOrder = 'desc' } = options;
    const query = { ...baseQuery };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const skip = (page - 1) * limit;
    
    const sortParams: Record<string, 1 | -1> = {};
    sortParams[sortField] = sortOrder === 'asc' ? 1 : -1;

    const [data, totalItems] = await Promise.all([
      this.model.find(query).sort(sortParams).skip(skip).limit(limit),
      this.model.countDocuments(query)
    ]);

    return {
      data,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit
      }
    };
  }

  async toggleStatus(id: string): Promise<T | null> {
    const doc = await this.model.findById(id);
    if (!doc) return null;
    
    // Assumes T has isActive
    (doc as unknown as Record<string, unknown>).isActive = !(doc as unknown as Record<string, unknown>).isActive;
    return await doc.save();
  }

  async getStats(baseQuery: Record<string, unknown> = {}): Promise<{ total: number; active: number; suspended: number }> {
    const [total, active, suspended] = await Promise.all([
      this.model.countDocuments(baseQuery),
      this.model.countDocuments({ ...baseQuery, isActive: true }),
      this.model.countDocuments({ ...baseQuery, isActive: false })
    ]);
    return { total, active, suspended };
  }
}
