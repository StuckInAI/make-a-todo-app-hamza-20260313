import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Todo } from '@/entities/Todo';

type RouteParams = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json() as {
      title?: string;
      description?: string;
      completed?: boolean;
    };

    const dataSource = await getDataSource();
    const todoRepository = dataSource.getRepository(Todo);

    const todo = await todoRepository.findOne({ where: { id } });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    if (body.title !== undefined) {
      if (body.title.trim() === '') {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
      }
      todo.title = body.title.trim();
    }
    if (body.description !== undefined) {
      todo.description = body.description.trim() || null;
    }
    if (body.completed !== undefined) {
      todo.completed = body.completed;
    }

    const updatedTodo = await todoRepository.save(todo);
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error('PUT /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const todoRepository = dataSource.getRepository(Todo);

    const todo = await todoRepository.findOne({ where: { id } });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await todoRepository.remove(todo);
    return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
