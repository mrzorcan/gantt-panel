import { useState } from 'react';

const shiftStart = 6 * 60 + 30;
const shiftEnd = 15 * 60;
const pxPerMin = 2;
const timelineInterval = 30;

const toMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const formatHour = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}\`;
};

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

  const getLeft = (start) => (toMinutes(start) - shiftStart) * pxPerMin;
  const getWidth = (start, end) => (toMinutes(end) - toMinutes(start)) * pxPerMin;
  const totalWidth = (shiftEnd - shiftStart) * pxPerMin;

  const timeline = [];
  for (let m = shiftStart; m <= shiftEnd; m += timelineInterval) {
    timeline.push({ label: formatHour(m), left: (m - shiftStart) * pxPerMin });
  }

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

      {/* Zaman Çizelgesi */}
      <div style={{ position: 'relative', height: 20, width: totalWidth, marginBottom: 10 }}>
        {timeline.map((t, i) => (
          <div key={i} style={{ position: 'absolute', left: t.left, fontSize: 10, color: '#555' }}>{t.label}</div>
        ))}
      </div>

      {/* Gantt Alanı */}
      <div>
        {Object.entries(grouped).map(([person, personTasks], index) => (
          <div key={person} style={{ marginBottom: 25 }}>
            <div style={{ marginBottom: 4, fontWeight: 'bold' }}>{person}</div>
            <div style={{
              position: 'relative',
              height: 34,
              width: totalWidth,
              background: 'repeating-linear-gradient(to right, #f2f2f2 0px, #f2f2f2 1px, #fff 1px, #fff ' + timelineInterval * pxPerMin + 'px)'
            }}>
              {personTasks.map((t, i) => (
                <div key={i}
                  style={{
                    position: 'absolute',
                    left: getLeft(t.start),
                    width: getWidth(t.start, t.end),
                    height: 30,
                    background: '#4caf50',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: '30px',
                    borderRadius: 4,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
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
