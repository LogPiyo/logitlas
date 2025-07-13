import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'testdata.json');

export async function POST(request: Request) {
  try {
    const { theoremName, dependencies } = await request.json();

    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    const newTheorem = {
      theoremId: data.length,
      theoremName,
      dependencies: dependencies
        .split(',')
        .map((s: string) => parseInt(s.trim())),
    };

    data.push(newTheorem);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ message: '追加成功', theorem: newTheorem });
  } catch (error) {
    return NextResponse.json(
      { error: 'ファイルの読み書きに失敗しました' },
      { status: 500 }
    );
  }
}
