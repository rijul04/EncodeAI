/**
 * Daydreams agent with cli extension(s)
 * Using Groq as the model provider
 */
import { createGroq } from "@ai-sdk/groq";
import {
    createDreams,
    context,
    render,
    action,
    validateEnv,
} from "@daydreamsai/core";
import { cli } from "@daydreamsai/core/extensions";
import { string, z } from "zod";

const env = validateEnv(
    z.object({
        GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
    })
);

// Initialize Groq client
const groq = createGroq({
    apiKey: env.GROQ_API_KEY!,
});

const template = `
Goal: {{goal}} 
Tasks: {{tasks}}
Current Task: {{currentTask}}
`;

type GoalMemory = {
    goal: string;
    tasks: string[];
    currentTask: string;
};

const goalContexts = context({
    type: "goal",
    schema: z.object({
        id: string(),
        initialGoal: z.string(),
        initialTasks: z.array(z.string()),
    }),

    key({ id }: { id: string }) {
        return id;
    },

    create(state: { args: { initialGoal: string; initialTasks: string[] } }) {
        return {
            goal: state.args.initialGoal,
            tasks: state.args.initialTasks ?? [],
            currentTask: state.args.initialTasks?.[0],
        };
    },

    render({ memory }: { memory: GoalMemory }) {
        return render(template, {
            goal: memory.goal,
            tasks: memory.tasks.join("\n"),
            currentTask: memory.currentTask ?? "NONE",
        });
    },
});

createDreams({
    model: groq("deepseek-r1-distill-llama-70b"),
    extensions: [cli],
    context: goalContexts,
    actions: [
        action({
            name: "addTask",
            description: "Add a task to the goal",
            schema: z.object({ task: z.string() }),
            handler(
                call: { data: { task: string } },
                ctx: { agentMemory: any },
                _agent: any
            ) {
                const agentMemory = ctx.agentMemory as GoalMemory;
                agentMemory.tasks.push(call.data.task);
                return {};
            },
        }),
        action({
            name: "completeTask",
            description: "Complete a task",
            schema: z.object({ task: z.string() }),
            handler(
                call: { data: { task: string } },
                ctx: { agentMemory: any },
                _agent: any
            ) {
                const agentMemory = ctx.agentMemory as GoalMemory;
                agentMemory.tasks = agentMemory.tasks.filter(
                    (task) => task !== call.data.task
                );
                return {};
            },
        }),
    ],
}).start({ id: "test", initialGoal: "", initialTasks: [] });
