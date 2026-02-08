
import React, { useState } from 'react';
import { AltriLogo } from './icons';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import type { User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() !== '' && password.trim() !== '') {
            const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';
            onLogin({ username, role });
        } else {
            alert('ERROR_AUTH: Credenciales requeridas.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-altri-dark relative overflow-hidden px-6">
            <div className="scan-line"></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-16">
                    <div className="w-32 h-32 bg-altri-orange rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,102,0,0.3)] mb-10 ring-1 ring-white/20">
                         <AltriLogo className="text-white" hideText />
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">ALTRI</h1>
                    <p className="text-[10px] font-black text-altri-orange uppercase tracking-[0.5em] mt-4">LOGISTICS PROTOCOL v2.0</p>
                </div>

                <Card className="p-12 !bg-white/5 border border-white/10 ring-1 ring-white/5">
                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">USUARIO_ID</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-altri-orange transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ACCESO_KEY</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-altri-orange transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full py-5 text-xs orange-glow">
                            AUTENTICAR SISTEMA
                        </Button>
                    </form>
                </Card>
                
                <p className="text-center text-[9px] text-gray-600 font-black mt-16 uppercase tracking-[0.3em]">
                    SISTEMA DE CONTROL PROPIETARIO • ALTRITELECOM S.L.
                </p>
            </div>
        </div>
    );
};
