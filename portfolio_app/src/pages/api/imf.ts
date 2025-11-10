import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint' });
  }

  try {
    const BASE = 'https://www.imf.org/external/datamapper/api/v1';
    const response = await axios.get(`${BASE}/${endpoint}`);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching IMF API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
