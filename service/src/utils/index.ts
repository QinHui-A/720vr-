export const successResponse = (data: any, message?: string) => {
  return {
    code: 0,
    data: data,
    message: message || 'success'
  }
}

export const errorResponse = (message?: string) => {
  return {
    code: -1,
    message: message || 'error'
  }
}