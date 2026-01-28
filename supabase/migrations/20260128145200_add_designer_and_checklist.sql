-- Migration to add designer and checklist support to service_orders
ALTER TABLE public.service_orders 
ADD COLUMN IF NOT EXISTS designer_name TEXT,
ADD COLUMN IF NOT EXISTS production_checklist TEXT[] DEFAULT '{}';

-- Update RLS policies just in case, although the current policies use (true)
-- which covers all columns.

COMMENT ON COLUMN public.service_orders.designer_name IS 'Nome do designer responsável pela arte';
COMMENT ON COLUMN public.service_orders.production_checklist IS 'Lista de etapas de produção concluídas';
