import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long").optional(),
  description: z.string().max(1000, "Description too long").optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    await connectToDatabase();

    // Verify task belongs to user
    const existingTask = await Task.findOne({ _id: id, userId: session.userId });
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const validatedData = updateTaskSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    // Update fields
    if (validatedData.data.title !== undefined) {
      existingTask.title = validatedData.data.title;
    }
    if (validatedData.data.description !== undefined) {
      existingTask.description = validatedData.data.description;
    }
    if (validatedData.data.status !== undefined) {
      existingTask.status = validatedData.data.status;
    }

    await existingTask.save();

    return NextResponse.json({ task: existingTask }, { status: 200 });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    await connectToDatabase();

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: session.userId,
    });

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
