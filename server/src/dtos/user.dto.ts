import { Types } from 'mongoose';
import { AuthProvider } from '../enums';
import { ICandidate } from '../models/Candidate';
import { IRezulter, RezulterRole } from '../models/Rezulter';

export interface CandidateResponseDTO {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  authProvider: AuthProvider;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RezulterResponseDTO {
  id: string;
  name: string;
  email: string;
  role: RezulterRole;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  authProvider: AuthProvider;
  profileImage?: string;
  subscriptionId?: Types.ObjectId | string;
  candidateIds?: Types.ObjectId[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export function mapToCandidateDTO(candidate: ICandidate): CandidateResponseDTO {
  return {
    id: candidate._id ? candidate._id.toString() : '',
    name: candidate.name,
    email: candidate.email,
    phoneNumber: candidate.phoneNumber,
    isActive: candidate.isActive,
    isEmailVerified: candidate.isEmailVerified,
    authProvider: candidate.authProvider,
    profileImage: candidate.profileImage,
    // Safely pull timestamps if they exist
    createdAt: (candidate as unknown as Record<string, unknown>).createdAt as Date | undefined,
    updatedAt: (candidate as unknown as Record<string, unknown>).updatedAt as Date | undefined,
  };
}

export function mapToRezulterDTO(rezulter: IRezulter): RezulterResponseDTO {
  return {
    id: rezulter._id ? rezulter._id.toString() : '',
    name: rezulter.name,
    email: rezulter.email,
    role: rezulter.role,
    phoneNumber: rezulter.phoneNumber,
    isActive: rezulter.isActive,
    isEmailVerified: rezulter.isEmailVerified,
    authProvider: rezulter.authProvider,
    profileImage: rezulter.profileImage,
    subscriptionId: rezulter.subscriptionId,
    candidateIds: rezulter.candidateIds,
    createdAt: (rezulter as unknown as Record<string, unknown>).createdAt as Date | undefined,
    updatedAt: (rezulter as unknown as Record<string, unknown>).updatedAt as Date | undefined,
  };
}
