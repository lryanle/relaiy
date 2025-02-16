
interface Utterance {
    role: 'agent' | 'user';
    content: string;
}

// LLM Websocket Request Object
export interface RetellRequest {
    response_id?: number;
    transcript: Utterance[];
    interaction_type: 'update_only' | 'response_required' | 'reminder_required';
}

// LLM Websocket Response Object
export interface RetellResponse {
    response_id?: number;
    content: string;
    content_complete: boolean;
    end_call: boolean;
}
