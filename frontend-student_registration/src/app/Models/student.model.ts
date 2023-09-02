export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  gender: string;
  password: string;
  phoneNumber: string;
  state: string;
  city: string;
  pincode: string;
  profileImage: string,
  originalValues: { isEditing: boolean; _id: string; firstName: string; lastName: string; dob: Date; email: string; gender: string; password: string; phoneNumber: string; state: string; city: string; pincode: string; };
  isEditing: boolean;
}
