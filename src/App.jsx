import { useState } from 'react';

const shiftStart = 6 * 60 + 30; // 06:30

const toMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const getLeft = (start) => (toMinutes(start) - shiftStart) * 2; // 2px per minute
const getWidth = (start, end) => (toMinutes(end) - toMinutes(start)) * 2;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ person: '', plane: '', start: '', end: '' });

  const handleAddTask = () => {
    if (!newTask.person || !newTask.plane || !newTask.start || !newTask.end) return;
    setTasks([...tasks, newTask]);
    setNewTask({ person: '', plane: '', start: '', end: '' });
  };

  const grouped = tasks.reduce((acc, t) => {
    if (!acc[t.person]) acc[t.person] = [];
    acc[t.person].push(t);
    return acc;
  }, {});

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

      <div style={{ borderTop: '1px solid #ccc', marginTop: 20, paddingTop: 10 }}>
        {Object.entries(grouped).map(([person, personTasks]) => (
          <div key={person} style={{ marginBottom: 30 }}>
            <strong>{person}</strong>
            <div style={{ position: 'relative', height: 30, background: '#f0f0f0', marginTop: 5 }}>
              {personTasks.map((t, i) => (
                <div key={i}
                  style={{
                    position: 'absolute',
                    left: getLeft(t.start),
                    width: getWidth(t.start, t.end),
                    top: 0,
                    height: '100%',
                    background: '#4caf50',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: '30px',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                >
                  {t.plane}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
