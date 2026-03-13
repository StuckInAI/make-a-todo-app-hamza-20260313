import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Todo } from '@/entities/Todo';

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const todoRepository = dataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error('GET /api/todos/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, completed } = body;

    const dataSource = await getDataSource();
    const todoRepository = dataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      todo.description =
        typeof description === 'string' && description.trim()
          ? description.trim()
          : null;
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return NextResponse.json(
          { error: 'Completed must be a boolean' },
          { status: 400 }
        );
      }
      todo.completed = completed;
    }

    const updated = await todoRepository.save(todo);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PUT /api/todos/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
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
    const todo = await todoRepository.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await todoRepository.remove(todo);
    return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
