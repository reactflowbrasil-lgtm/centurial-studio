-- Centurial SGPG Database Schema

-- Enum for service order status (7+ status workflow)
CREATE TYPE public.os_status AS ENUM (
  'orcamento',      -- Orçamento
  'aprovado',       -- Aprovado
  'arte',           -- Em Arte/Design
  'producao',       -- Em Produção
  'acabamento',     -- Acabamento
  'revisao',        -- Revisão/Qualidade
  'entrega',        -- Pronto para Entrega
  'concluido',      -- Concluído/Entregue
  'cancelado'       -- Cancelado
);

-- Enum for priority levels
CREATE TYPE public.priority_level AS ENUM ('baixa', 'normal', 'alta', 'urgente');

-- Enum for product types
CREATE TYPE public.product_type AS ENUM (
  'placa_sinalizacao',
  'adesivo',
  'fachada',
  'banner',
  'brinde',
  'outdoor',
  'impressao_digital',
  'outros'
);

-- Clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf_cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'SP',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service Orders (OS) table
CREATE TABLE public.service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  os_number SERIAL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  product_type public.product_type NOT NULL DEFAULT 'outros',
  status public.os_status NOT NULL DEFAULT 'orcamento',
  priority public.priority_level NOT NULL DEFAULT 'normal',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) DEFAULT 0,
  estimated_delivery DATE,
  actual_delivery DATE,
  notes TEXT,
  created_by UUID,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- OS Status History for tracking changes
CREATE TABLE public.os_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  from_status public.os_status,
  to_status public.os_status NOT NULL,
  changed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- OS Attachments for files
CREATE TABLE public.os_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log status changes
CREATE OR REPLACE FUNCTION public.log_os_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.os_status_history (service_order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.assigned_to);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER log_os_status_change_trigger
  AFTER UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.log_os_status_change();

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all authenticated users to manage data
-- Clients policies
CREATE POLICY "Authenticated users can view clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (true);

-- Service Orders policies
CREATE POLICY "Authenticated users can view service orders"
  ON public.service_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create service orders"
  ON public.service_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service orders"
  ON public.service_orders FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete service orders"
  ON public.service_orders FOR DELETE
  TO authenticated
  USING (true);

-- Status History policies
CREATE POLICY "Authenticated users can view status history"
  ON public.os_status_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert status history"
  ON public.os_status_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Attachments policies
CREATE POLICY "Authenticated users can view attachments"
  ON public.os_attachments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create attachments"
  ON public.os_attachments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete attachments"
  ON public.os_attachments FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_service_orders_status ON public.service_orders(status);
CREATE INDEX idx_service_orders_client ON public.service_orders(client_id);
CREATE INDEX idx_service_orders_created_at ON public.service_orders(created_at DESC);
CREATE INDEX idx_os_status_history_order ON public.os_status_history(service_order_id);
CREATE INDEX idx_clients_name ON public.clients(name);

-- Insert sample data for demonstration
INSERT INTO public.clients (name, email, phone, cpf_cnpj, city, state) VALUES
  ('Construtora ABC Ltda', 'contato@construtorabc.com.br', '(11) 98765-4321', '12.345.678/0001-90', 'São Paulo', 'SP'),
  ('Supermercado Bom Preço', 'compras@bompreco.com.br', '(11) 91234-5678', '98.765.432/0001-10', 'Campinas', 'SP'),
  ('Farmácia Popular', 'farmacia@popular.com.br', '(11) 99876-5432', '11.222.333/0001-44', 'São Paulo', 'SP');

INSERT INTO public.service_orders (client_id, title, description, product_type, status, priority, quantity, unit_price, total_price, estimated_delivery) VALUES
  ((SELECT id FROM public.clients WHERE name = 'Construtora ABC Ltda'), 'Placas de Sinalização Obra', 'Kit com 15 placas de sinalização para canteiro de obras', 'placa_sinalizacao', 'producao', 'alta', 15, 85.00, 1275.00, CURRENT_DATE + INTERVAL '5 days'),
  ((SELECT id FROM public.clients WHERE name = 'Supermercado Bom Preço'), 'Fachada Luminosa', 'Fachada em ACM com letras caixa luminosas', 'fachada', 'arte', 'urgente', 1, 12500.00, 12500.00, CURRENT_DATE + INTERVAL '15 days'),
  ((SELECT id FROM public.clients WHERE name = 'Farmácia Popular'), 'Adesivos Vitrines', 'Adesivos perfurados para vitrines frontais', 'adesivo', 'orcamento', 'normal', 8, 180.00, 1440.00, CURRENT_DATE + INTERVAL '7 days'),
  ((SELECT id FROM public.clients WHERE name = 'Construtora ABC Ltda'), 'Banner Lançamento', 'Banner 3x2m para evento de lançamento', 'banner', 'entrega', 'normal', 2, 320.00, 640.00, CURRENT_DATE),
  ((SELECT id FROM public.clients WHERE name = 'Supermercado Bom Preço'), 'Outdoor Promoção', 'Outdoor 9x3m para campanha promocional', 'outdoor', 'revisao', 'alta', 1, 2800.00, 2800.00, CURRENT_DATE + INTERVAL '3 days');