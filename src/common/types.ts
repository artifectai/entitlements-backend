export interface Notification {
    type: string;
    message: string;
    [key: string]: any;
}

export interface DatabaseConnectionOptions {
    user: string;
    host: string;
    port: number;
    password: string;
    database: string;
}

export interface CreateAccessRequestAttributes {
    userId: string;
    datasetId: string;
    frequencyId: string;
    status: StatusEnum;
    requestedAt: Date;
    resolvedAt: Date | null;
    expiryDate: Date | null;
    isTemporary: boolean;
}

export enum StatusEnum {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
    REVOKED = 'revoked',
  }