
export type UserRole = "TECHNICIAN" | "MANAGER" | "CSR" | "ADMIN";
export interface User{
    id:number,
    email:string,
    name:string,
    role: UserRole
    tenantid:string
}
export interface AuthState {
    
    user:User|null,
    isAuthenticated:boolean;
    isLoading:boolean
}