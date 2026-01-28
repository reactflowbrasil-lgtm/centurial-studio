// Database types for Centurial SGPG

export type OsStatus = 
  | 'orcamento'
  | 'aprovado' 
  | 'arte'
  | 'producao'
  | 'acabamento'
  | 'revisao'
  | 'entrega'
  | 'concluido'
  | 'cancelado';

export type PriorityLevel = 'baixa' | 'normal' | 'alta' | 'urgente';

export type ProductType = 
  | 'placa_sinalizacao'
  | 'adesivo'
  | 'fachada'
  | 'banner'
  | 'brinde'
  | 'outdoor'
  | 'impressao_digital'
  | 'outros';

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf_cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceOrder {
  id: string;
  os_number: number;
  client_id: string | null;
  title: string;
  description: string | null;
  product_type: ProductType;
  status: OsStatus;
  priority: PriorityLevel;
  quantity: number;
  unit_price: number;
  total_price: number;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  notes: string | null;
  created_by: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  clients?: Client;
}

export interface OsStatusHistory {
  id: string;
  service_order_id: string;
  from_status: OsStatus | null;
  to_status: OsStatus;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export const STATUS_CONFIG: Record<OsStatus, { label: string; color: string; bgClass: string }> = {
  orcamento: { label: 'Orçamento', color: 'status-pending', bgClass: 'status-orcamento' },
  aprovado: { label: 'Aprovado', color: 'status-approved', bgClass: 'status-aprovado' },
  arte: { label: 'Em Arte', color: 'status-art', bgClass: 'status-arte' },
  producao: { label: 'Produção', color: 'status-production', bgClass: 'status-producao' },
  acabamento: { label: 'Acabamento', color: 'status-finishing', bgClass: 'status-acabamento' },
  revisao: { label: 'Revisão', color: 'status-review', bgClass: 'status-revisao' },
  entrega: { label: 'Entrega', color: 'status-delivery', bgClass: 'status-entrega' },
  concluido: { label: 'Concluído', color: 'status-delivery', bgClass: 'status-entrega' },
  cancelado: { label: 'Cancelado', color: 'status-cancelled', bgClass: 'status-cancelado' },
};

export const PRIORITY_CONFIG: Record<PriorityLevel, { label: string; color: string }> = {
  baixa: { label: 'Baixa', color: 'text-muted-foreground' },
  normal: { label: 'Normal', color: 'text-foreground' },
  alta: { label: 'Alta', color: 'text-orange-600' },
  urgente: { label: 'Urgente', color: 'text-red-600' },
};

export const PRODUCT_TYPE_CONFIG: Record<ProductType, { label: string; icon: string }> = {
  placa_sinalizacao: { label: 'Placa de Sinalização', icon: '🪧' },
  adesivo: { label: 'Adesivo', icon: '🏷️' },
  fachada: { label: 'Fachada', icon: '🏢' },
  banner: { label: 'Banner', icon: '🎌' },
  brinde: { label: 'Brinde', icon: '🎁' },
  outdoor: { label: 'Outdoor', icon: '📺' },
  impressao_digital: { label: 'Impressão Digital', icon: '🖨️' },
  outros: { label: 'Outros', icon: '📦' },
};

// Status workflow order
export const STATUS_WORKFLOW: OsStatus[] = [
  'orcamento',
  'aprovado',
  'arte',
  'producao',
  'acabamento',
  'revisao',
  'entrega',
  'concluido',
];
