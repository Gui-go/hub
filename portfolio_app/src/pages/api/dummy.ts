export default function handler(req, res) {
  res.status(200).json({ message: 'Firestore API route is reachable!' });
}
