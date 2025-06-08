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

const generateColor = (key) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return \`hsl(\${hue}, 65%, 55%)\`;
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

      {/* Saat etiketi */}
      <div style={{ position: 'relative', height: 20, width: totalWidth, marginBottom: 10 }}>
        {timeline.map((t, i) => (
          <div key={i} style={{ position: 'absolute', left: t.left, fontSize: 10, color: '#555' }}>{t.label}</div>
        ))}
      </div>

      {/* Gantt Alanı */}
      <div>
        {Object.entries(grouped).map(([person, personTasks]) => {
          // görevleri çakışmayacak şekilde satırlara dağıt
          const layers = [];

          personTasks.forEach(task => {
            const start = toMinutes(task.start);
            const end = toMinutes(task.end);
            let row = 0;
            while (true) {
              const overlap = (layers[row] || []).some(t =>
                !(toMinutes(t.end) <= start || toMinutes(t.start) >= end)
              );
              if (!overlap) break;
              row++;
            }
            if (!layers[row]) layers[row] = [];
            layers[row].push(task);
          });

          return (
            <div key={person} style={{ marginBottom: 30 }}>
              <div style={{ marginBottom: 4, fontWeight: 'bold', textTransform: 'uppercase' }}>{person}</div>
              <div style={{
                position: 'relative',
                height: layers.length * 34,
                width: totalWidth,
                backgroundImage: 'repeating-linear-gradient(to right, #ccc 1px, transparent 1px), repeating-linear-gradient(to bottom, #eee 1px, transparent 1px)'
              }}>
                {layers.flatMap((rowTasks, rowIndex) =>
                  rowTasks.map((t, i) => {
                    const left = getLeft(t.start);
                    const width = getWidth(t.start, t.end);
                    const color = generateColor(t.plane);
                    return (
                      <div key={i + '-' + rowIndex}
                        style={{
                          position: 'absolute',
                          left,
                          width,
                          top: rowIndex * 34,
                          height: 30,
                          background: color,
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
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
