'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PainelGerencial() {
  const [iaAtiva, setIaAtiva] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const registrarLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [`${timestamp} - ${msg}`, ...prev]);
  };

  useEffect(() => {
    registrarLog('Painel iniciado.');
  }, []);

  const toggleIA = () => {
    setIaAtiva(prev => {
      const newState = !prev;
      registrarLog(`IA ${newState ? 'ativada' : 'desligada'}.`);
      return newState;
    });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Painel Gerencial Autônomo</h1>
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Estado da IA</h2>
          <Button onClick={toggleIA} variant={iaAtiva ? 'primary' : 'secondary'}>
            {iaAtiva ? 'Desligar IA' : 'Ligar IA'}
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray-400">A IA está atualmente {iaAtiva ? 'ativada' : 'desligada'}.</p>
      </Card>
      <Card className="mb-4">
        <h2 className="text-xl mb-2">Logs</h2>
        <div className="h-64 overflow-y-auto text-sm">
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </Card>
    </main>
  );
}
