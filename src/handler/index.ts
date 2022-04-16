import { ListeningHandler } from './Listening'
import { ConnectionHandler } from './Connection'
import { ErrorHandler } from './Error'
import { CloseHandler } from './Close'

export const handlers = [
  ListeningHandler,
  ConnectionHandler,
  ErrorHandler,
  CloseHandler,
]
