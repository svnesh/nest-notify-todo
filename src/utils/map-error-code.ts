import { ErrorCode } from "../shared/constants/error-code";


export function mapValidtionToErrorCode(
  field: string,
  constraintKey: string,
): ErrorCode {
  if (field === 'title' && constraintKey === 'isNotEmpty') {
    return ErrorCode.TODO_TITLE_REQUIRED;
  } 

  return ErrorCode.VALIDATION_ERROR;
}