export type Role = 'guest' | 'client' | 'admin'

export interface User {
  id: string
  name: string
  role: Role
  email: string
  avatar?: string
}

export type RequestStatus = 'pending' | 'reviewing' | 'scheduled' | 'completed' | 'rejected'

export interface PortabilityRequest {
  id: string
  ownerName: string
  document: string // CPF or CNPJ
  email: string
  currentOperator: string
  operatorOther?: string
  state: string
  city: string
  numbers: string[]
  documentsUploaded: boolean
  videoAuthorized: boolean
  status: RequestStatus
  createdAt: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending'
}

export interface CallLog {
  id: string
  destination: string
  duration: string
  date: string
}

export interface WidgetSetting {
  id: string
  name: string
  agent_id: string
  schema: string
  type: string
  is_active: boolean
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'react-widget-uv': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        agent_id?: string
        schema?: string
        type?: string
      }
    }
  }
}
