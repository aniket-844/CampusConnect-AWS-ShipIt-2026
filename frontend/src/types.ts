export type Role='student'|'admin';
export type Status='Submitted'|'In Progress'|'Resolved'|'Rejected';
export interface User {id:string; name:string; email:string; role:Role}
export interface Complaint {id:string; ownerId:string; ownerName:string; location:string; room:string; category:string; priority:'Low'|'Medium'|'High'; description:string; status:Status; createdAt:string; notes:string[]; assignedTo?:string; demo?:boolean}
export interface Feedback {id:string; ownerId:string; meal:string; rating:number; comment:string; createdAt:string; demo?:boolean}
export interface Seat {id:string; zone:string; status:'available'|'occupied'|'maintenance'; bookedBy?:string; expiresAt?:string; demo?:boolean}
export interface Announcement {id:string; title:string; body:string; category:string; priority:'Normal'|'Important'|'Urgent'; createdAt:string; demo?:boolean}
export interface AppData {complaints:Complaint[]; feedback:Feedback[]; seats:Seat[]; announcements:Announcement[]}
