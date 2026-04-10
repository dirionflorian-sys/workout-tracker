"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    const response = await fetch("/api/workouts");
    const data = await response.json();
    setWorkouts(data);
    setLoading(false);
  }

  async function addWorkout(e) {
    e.preventDefault();

    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exercise,
        weight: parseFloat(weight),
        reps: parseInt(reps),
      }),
    });

    const newWorkout = await response.json();
    setWorkouts([newWorkout, ...workouts]);
    setExercise("");
    setWeight("");
    setReps("");
  }

  async function deleteWorkout(id) {
    await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    setWorkouts(workouts.filter((w) => w.id !== id));
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Workout Tracker</h1>

        <div className="bg-zinc-900 rounded-lg p-6 mb-8 border border-zinc-800">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Übung (z.B. Bench Press)"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded px-4 py-2
                         text-zinc-100 placeholder-zinc-500 outline-none
                         focus:border-lime-400 transition-colors"
            />
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Gewicht (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-4 py-2
                           text-zinc-100 placeholder-zinc-500 outline-none
                           focus:border-lime-400 transition-colors w-1/2"
              />
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-4 py-2
                           text-zinc-100 placeholder-zinc-500 outline-none
                           focus:border-lime-400 transition-colors w-1/2"
              />
            </div>
            <button
              onClick={addWorkout}
              disabled={!exercise || !weight || !reps}
              className="bg-lime-400 text-zinc-950 font-semibold rounded px-4 py-2
                         hover:bg-lime-300 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-zinc-500">Lädt...</p>
        ) : workouts.length === 0 ? (
          <p className="text-zinc-500">Noch keine Workouts. Leg los!</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4
                           flex items-center justify-between
                           hover:border-zinc-700 transition-colors"
              >
                <div>
                  <p className="font-semibold text-lg">{workout.exercise}</p>
                  <p className="text-zinc-400 text-sm">
                    {workout.weight} kg x {workout.reps} reps
                    <span className="mx-2">·</span>
                    {new Date(workout.created_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <button
                  onClick={() => deleteWorkout(workout.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors
                             text-sm px-3 py-1"
                >
                  Löschen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}