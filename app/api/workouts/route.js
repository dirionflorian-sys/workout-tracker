import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/workouts → Alle Workouts laden
export async function GET() {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/workouts → Neues Workout speichern
export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("workouts")
    .insert([
      {
        exercise: body.exercise,
        weight: body.weight,
        reps: body.reps,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}