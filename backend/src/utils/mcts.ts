interface Node {
    response: string;
    visits: number;
    score: number;
    children: Node[];
    parent: Node | null;
}

function createNode(response: string, parent: Node | null = null): Node {
    return {
        response,
        visits: 0,
        score: 0,
        children: [],
        parent
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
    
    // Length penalty (prefer responses between 30-150 characters)
    const length = response.length;
    if (length >= 30 && length <= 150) {
        score += 0.4;
    } else if (length < 20 || length > 200) {
        score -= 0.4;
    }
    
    // Personality and engagement scoring
    if (/\b(I|me|my|mine)\b/i.test(response)) {
        score += 0.3;
    }
    
    // Natural conversation markers
    if (/\b(hey|oh|well|so|actually|yeah|cool|nice)\b/i.test(response)) {
        score += 0.25;
    }
    
    // Question engagement (but not too many questions)
    const questionCount = (response.match(/\?/g) || []).length;
    if (questionCount === 1) {
        score += 0.3;
    } else if (questionCount > 1) {
        score -= 0.2; // Penalize multiple questions
    }
    
    // Flirty/friendly tone
    if (/\b(fun|hang out|coffee|meet|date|together|chat|talk)\b/i.test(response)) {
        score += 0.3;
    }
    
    // Penalize red flags
    if (/\b(AI|model|assistant|apologize|sorry|cannot|unable)\b/i.test(response)) {
        score -= 0.6;
    }
    
    if (/\b(hereby|furthermore|nevertheless|thus|therefore|moreover)\b/i.test(response)) {
        score -= 0.4; // Too formal
    }
    
    // Add small randomness
    score += Math.random() * 0.05;
    
    return Math.max(0, Math.min(1, score));
}

function backpropagate(node: Node, score: number) {
    let current: Node | null = node;
    while (current !== null) {
        current.visits += 1;
        current.score += score;
        current = current.parent;
    }
}

export function selectBestResponse(responses: string[]): string {
    if (responses.length === 0) return '';
    if (responses.length === 1) return responses[0];
    
    // Create root node
    const root = createNode('root');
    
    // Create child nodes for each response
    responses.forEach(response => {
        root.children.push(createNode(response, root));
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
    
    // Select the best child based on average score
    const bestChild = root.children.reduce((best, child) => {
        const avgScore = child.score / (child.visits || 1);
        const bestAvgScore = best.score / (best.visits || 1);
        return avgScore > bestAvgScore ? child : best;
    }, root.children[0]);

    console.log(bestChild);
    
    return bestChild.response;
}
