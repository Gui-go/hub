import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const metadataServerUrl =
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=https://fastapi-run-241432738087.us-central1.run.app';
    
    const tokenResponse = await fetch(metadataServerUrl, {
      headers: {
        'Metadata-Flavor': 'Google',
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to fetch Identity Token');
    }

    const token = await tokenResponse.text();

    const apiUrl =
      'https://fastapi-run-241432738087.us-central1.run.app/fetch/brvectors_dev/clean_municipalities?limit=10';

    const apiResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    res.status(500).json({ error: 'Failed to fetch municipalities' });
  }
}
