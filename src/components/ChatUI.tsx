import React, { useState } from 'react';
import axios from 'axios';
import './ChatUI.css';

const BASE_URL = "http://localhost:3002";

// Define MessageHistory type
type Role = 'system' | 'user' | 'assistant'

interface Message {
    role: Role
    content: string
}

const ChatUI: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Merhaba! Size nasıl yardımcı olabilirim?" },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            const newUserMessage: Message = { role: 'user', content: inputValue };
            setMessages(prevMessages => [...prevMessages, newUserMessage]);
            setInputValue('');
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.post(`${BASE_URL}/generate`, { prompt: inputValue });
                const assistantMessage: Message = { role: 'assistant', content: response.data.message };
                setMessages(prevMessages => [...prevMessages, assistantMessage]);
            } catch (error) {
                console.error(error);
                setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.content}
                    </div>
                ))}
                {isLoading && <div className="message assistant">Yanıt yazılıyor...</div>}
                {error && <div className="error-message">{error}</div>}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    className="prompt-input"
                    placeholder="Mesajınızı yazın..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                />
                <button className="send-button" onClick={handleSendMessage} disabled={isLoading}>
                    <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatUI;