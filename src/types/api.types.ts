export interface ApiFieldError{
    field:string,
    message:string
}
export  interface ApiErrorResponse{
    
    statusCode: number;
  code: string;
  message: string;
  errors?: ApiFieldError[];
  requestId?: string;
}