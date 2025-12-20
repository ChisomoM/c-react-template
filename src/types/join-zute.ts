export interface JoinZuteFormData {
  school: string;
  poBox: string;
  applicationDate: string; // ISO date string
  fullName: string;
  tsManNo: string;
  employmentNo: string;
  salaryScale: string;
  district: string;
  province: string;
  previousUnion: string;
  payPoint: string;
  payPointDistrict: string;
  nrc: string;
  nrcFront?: string; // URL to uploaded image
  nrcBack?: string; // URL to uploaded image
  contactNumber: string;
  referralCode?: string; // Optional referral code
  reasonForJoining: string;
  applicantSignature: string; // Base64 or URL
  representativeSignature?: string; // Optional for now
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any; // Firestore Timestamp
}
