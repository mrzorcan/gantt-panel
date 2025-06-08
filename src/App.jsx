import { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ person: '', plane: '', start: '', end: '' });

  const handleAddTask = () => {
    if (!newTask.person || !newTask.plane || !newTask.start || !newTask.end) return;
    setTasks([...tasks, newTask]);
    setNewTask({ person: '', plane: '', start: '', end: '' });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Gantt Panel</h1>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Kişi" value={newTask.person} onChange={e => setNewTask({ ...newTask, person: e.target.value })} />
        <input placeholder="Uçak" value={newTask.plane} onChange={e => setNewTask({ ...newTask, plane: e.target.value })} />
        <input type="time" value={newTask.start} onChange={e => setNewTask({ ...newTask, start: e.target.value })} />
        <input type="time" value={newTask.end} onChange={e => setNewTask({ ...newTask, end: e.target.value })} />
        <button onClick={handleAddTask}>Ekle</button>
      </div>
      <div>
        {tasks.map((t, i) => (
          <div key={i}>
            <strong>{t.person}</strong> – {t.plane} ({t.start} - {t.end})
          </div>
        ))}
      </div>
    </div>
  );
}