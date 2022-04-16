import { CloseHandler } from './Close'
import { ErrorHandler } from './Error'
import { MessageHandler } from './Message'

export const handlers = [
  CloseHandler,
  ErrorHandler,
  MessageHandler,
]
