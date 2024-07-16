import React, { useState, useEffect } from 'react';
import { loadWasmModule } from './wasmLoader';

const App = () => {
  const [wasm, setWasm] = useState(null);
  const [queue, setQueue] = useState(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [dequeuedTasks, setDequeuedTasks] = useState([]);

  useEffect(() => {
    (async () => {
      const wasmModule = await loadWasmModule();
      setWasm(wasmModule);
      const queuePtr = wasmModule._createQueue();
      setQueue(queuePtr);
    })();
  }, []);

  const handleEnqueue = () => {
    if (task.trim() !== '') {
      const encoder = new TextEncoder();
      const encodedTask = encoder.encode(task);
      const taskPtr = wasm._malloc(encodedTask.length + 1);
      new Uint8Array(wasm.memory.buffer, taskPtr, encodedTask.length + 1).set(encodedTask);
      wasm._enqueue(queue, taskPtr);
      wasm._free(taskPtr);
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  const handleDequeue = () => {
    const taskPtr = wasm._dequeue(queue);
    if (taskPtr !== 0) {
      const decoder = new TextDecoder();
      const taskString = decoder.decode(new Uint8Array(wasm.memory.buffer, taskPtr));
      wasm._free(taskPtr);
      setTasks(tasks.filter(t => t !== taskString));
      setDequeuedTasks([...dequeuedTasks, taskString]);
    }
  };

  return (
    <div>
      <h1>To-Do List (Queue)</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={handleEnqueue}>Add Task</button>
      <button onClick={handleDequeue}>Remove Task</button>
      <h2>Current Tasks</h2>
      <ul>
  {tasks.map((t, index) => (
    <li key={index}>{t}</li>
  ))}
</ul>

      <h2>Removed Tasks</h2>
      <ul>
        {dequeuedTasks.map((t, index) => (
          <li key={index}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
