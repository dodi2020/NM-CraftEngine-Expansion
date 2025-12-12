export default function ArmorEditor({ useState, useEffect, api, projectId }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.nexomaker.item.readAll(projectId);
        setItems(data);
      } catch (error) {
        api.console.error('Failed to load:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{/* content */}</div>;
}