const ERROR_STATUS_LENGTH = 3;

const ErrorStatus = {
  UNAUTHORIZED: '401',
  NOT_FOUND: '404'
};

const ErrorMessage = {
  [ErrorStatus.UNAUTHORIZED] : 'Header Authorization is not correct',
  [ErrorStatus.NOT_FOUND] : 'Not found'
};

const getErrorMessage = (error) => {
  const errorStatus = error.message.substring(0, ERROR_STATUS_LENGTH);
  if(ErrorMessage[errorStatus] !== undefined){
    return ErrorMessage[errorStatus];
  }
  return error.message;
};

export { getErrorMessage };
