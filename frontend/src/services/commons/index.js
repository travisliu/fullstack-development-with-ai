export const formatValidationErrors = (errorData) => {
  let errorMessage = '';
  if (errorData.errors && Array.isArray(errorData.errors)) {
    errorData.errors.forEach((error) => {
      errorMessage += `Field: ${error.path}, Message: ${error.msg}\n`;
    });
  } else {
    errorMessage += `Error: ${response.status} ${response.statusText}`;
  }
  return errorMessage;
}