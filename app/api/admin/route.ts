import { createClient } from '@/app/utils/supabase/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient()
  if (req.method === 'POST') {
    // Crear una nueva tarea
    const { userId, name, tags } = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: userId, name, tags, is_done: false }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ task: data });
  }

  if (req.method === 'GET') {
    // Obtener todas las tareas de un usuario
    const { userId } = req.query;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ tasks: data });
  }

  res.status(405).json({ message: 'Método no permitido' });
}