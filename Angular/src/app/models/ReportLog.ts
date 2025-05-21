export class ReportLog {
    id: number;
    userId: number;
    reportedUserId: number;
    message: string;
}

export class CreateReportDTO {
    requestorId: number;
    targetId: number;
    message: string;
}

export class UserReportDTO {
    userId: number;
    reportId: number;
    until: Date;
}