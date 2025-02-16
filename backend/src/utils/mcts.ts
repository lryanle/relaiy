import type { ResponseFormat } from './prompt';
interface Node {
    response: string;
    visits: number;
    score: number;
    children: Node[];
    parent: Node | null;
    modelName: string;
    responseId: string;
}

function createNode(response: string, parent: Node | null = null, modelName: string, responseId: string): Node {
    return {
        response,
        visits: 0,
        score: 0,
        children: [],
        parent,
        modelName,
        responseId
    };
}

function UCB1(node: Node, parentVisits: number): number {
    const explorationConstant = Math.sqrt(2);
    if (node.visits === 0) return Infinity;
    
    const exploitation = node.score / node.visits;
    const exploration = explorationConstant * Math.sqrt(Math.log(parentVisits) / node.visits);
    
    return exploitation + exploration;
}

function select(node: Node): Node {
    let current = node;
    
    while (current.children.length > 0) {
        current = current.children.reduce((best, child) => {
            return UCB1(child, current.visits) > UCB1(best, current.visits) ? child : best;
        }, current.children[0]);
    }
    
    return current;
}

function simulate(response: string): number {
    let score = 0;
    
    // Base score from length (more granular scaling)
    const length = response.length;
    if (length >= 50 && length <= 120) {
        score += 0.5;
    } else if (length >= 30 && length <= 150) {
        score += 0.3;
    } else if (length < 20 || length > 200) {
        score -= 0.3;
    }
    
    // Personality scoring (weighted by count)
    const personalityWords = (response.match(/\b(I|me|my|mine)\b/gi) || []).length;
    score += Math.min(0.3, personalityWords * 0.1);
    
    // Natural conversation markers (weighted by variety)
    const conversationMarkers = new Set(response.match(/\b(hey|oh|well|so|actually|yeah|cool|nice)\b/gi) || []);
    score += Math.min(0.3, conversationMarkers.size * 0.08);
    
    // Question engagement (scaled penalty)
    const questionCount = (response.match(/\?/g) || []).length;
    if (questionCount === 1) {
        score += 0.3;
    } else if (questionCount > 1) {
        score -= questionCount * 0.15; // Increasing penalty for more questions
    }
    
    // Engagement words (weighted by variety)
    const engagementWords = new Set(response.match(/\b(fun|hang|coffee|meet|date|together|chat|talk)\b/gi) || []);
    score += Math.min(0.4, engagementWords.size * 0.1);
    
    // Red flags (weighted by severity and count)
    const redFlags = {
        severe: /\b(AI|model|assistant|apologize|sorry|cannot|unable)\b/gi,
        moderate: /\b(hereby|furthermore|nevertheless|thus|therefore|moreover)\b/gi,
        mild: /\b(system|process|function|execute)\b/gi
    };
    
    const severeCount = (response.match(redFlags.severe) || []).length;
    const moderateCount = (response.match(redFlags.moderate) || []).length;
    const mildCount = (response.match(redFlags.mild) || []).length;
    
    score -= severeCount * 0.3;
    score -= moderateCount * 0.2;
    score -= mildCount * 0.1;
    
    // Sentence structure variety
    const sentences = response.split(/[.!?]+/).filter(Boolean);
    const avgSentenceLength = sentences.reduce((sum, sent) => sum + sent.length, 0) / sentences.length;
    const sentenceLengthVariance = sentences.reduce((sum, sent) => sum + Math.abs(sent.length - avgSentenceLength), 0) / sentences.length;
    
    // Reward varied sentence structure
    score += Math.min(0.3, sentenceLengthVariance / 20);
    
    // Emotional content
    const emotionalWords = new Set(response.match(/\b(happy|excited|love|enjoy|great|wonderful|amazing)\b/gi) || []);
    score += Math.min(0.2, emotionalWords.size * 0.05);
    
    // Add small controlled randomness
    score += (Math.random() * 0.1) - 0.05;
    
    // Normalize score to 0-1 range with sigmoid function
    return 1 / (1 + Math.exp(-score));
}

function backpropagate(node: Node, score: number) {
    let current: Node | null = node;
    while (current !== null) {
        current.visits += 1;
        current.score += score;
        current = current.parent;
    }
}

function calculateResponseStatus(ratio: number): string {
    if (ratio >= 0.9) return 'good';
    if (ratio >= 0.7) return 'okay';
    if (ratio > 0) return 'bad';
    return 'error';
}

interface SelectBestResponseResult {
    bestResponse: {
        response: string;
        score: number;
        model: string;
        responseId: string;
        status: 'best';
    };
    allResponses: {
        response: string;
        ratio: number;
        status: string;
        model: string;
        responseId: string;
    }[];
}

export function selectBestResponse(responses: ResponseFormat[]): SelectBestResponseResult {
    if (responses.length === 0) return { bestResponse: { response: '', score: 0, model: '', responseId: responses[0].responseId, status: 'best' }, allResponses: [] };
    if (responses.length === 1) return { bestResponse: { response: responses[0].response, score: 1, model: responses[0].modelName || '', responseId: responses[0].responseId, status: 'best' }, allResponses: [{ response: responses[0].response, ratio: 1, status: 'best', model: responses[0].modelName || '', responseId: responses[0].responseId }] };
    
    console.log('best response', responses);
    // Create root node
    const root = createNode('root', null, '', '');
    
    // Create child nodes for each response
    responses.forEach(response => {
        root.children.push(createNode(
            response.response, 
            root, 
            response.modelName,
            response.responseId
        ));
    });
    
    // Run MCTS for a fixed number of iterations
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
        // Selection
        const selectedNode = select(root);
        
        // Simulation
        const score = simulate(selectedNode.response);
        
        // Backpropagation
        backpropagate(selectedNode, score);
    }
    
    // Calculate scores for all children
    const scoredResponses = root.children.map(child => ({
        response: child.response,
        ratio: child.score / (child.visits || 1),
        status: calculateResponseStatus(child.score / (child.visits || 1)),
        model: child.modelName,
        responseId: child.responseId
    }));


    // Find best child based on average score
    const bestChild = root.children.reduce((best, child) => {
        const avgScore = child.score / (child.visits || 1);
        const bestAvgScore = best.score / (best.visits || 1);
        return avgScore > bestAvgScore ? child : best;
    }, root.children[0]);
    
    return {
        bestResponse: { 
            response: bestChild.response, 
            score: bestChild.score, 
            model: bestChild.modelName,
            responseId: bestChild.responseId,
            status: 'best'
        },
        allResponses: scoredResponses
    };
}
