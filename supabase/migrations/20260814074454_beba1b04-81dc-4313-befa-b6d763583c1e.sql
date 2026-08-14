CREATE TABLE public.scan_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL CHECK (verdict IN ('accurate','off')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (scan_id)
);

GRANT ALL ON public.scan_feedback TO service_role;

ALTER TABLE public.scan_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scan_feedback_service_only" ON public.scan_feedback FOR ALL TO service_role USING (true) WITH CHECK (true);