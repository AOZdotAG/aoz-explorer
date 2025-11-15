import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTask, type AgentTask } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, CheckCircle2, XCircle, Clock, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskManagementProps {
  agentId: number;
  agentName: string;
}

export default function TaskManagement({ agentId, agentName }: TaskManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showBetaNotice, setShowBetaNotice] = useState(false);
  const { toast } = useToast();

  // Show beta notice on first mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenBetaNotice = localStorage.getItem("aoz-beta-notice-seen");
      if (!hasSeenBetaNotice) {
        setShowBetaNotice(true);
      }
    }
  }, []);

  const form = useForm<CreateTask>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      agentId,
      taskType: undefined,
      taskDescription: "",
    },
  });

  // Fetch tasks for this agent
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<AgentTask[]>({
    queryKey: [`/api/agents/${agentId}/tasks`],
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: CreateTask) => {
      const res = await apiRequest("POST", "/api/tasks", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agents/${agentId}/tasks`] });
      toast({
        title: "Task Created",
        description: "Your task has been queued for execution",
      });
      form.reset({ agentId, taskType: undefined, taskDescription: "" });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Task",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Execute task mutation
  const executeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await apiRequest("POST", `/api/tasks/${taskId}/execute`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agents/${agentId}/tasks`] });
      toast({
        title: "Task Executed",
        description: "AI has completed the task successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Task Execution Failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/agents/${agentId}/tasks`] });
    },
  });

  const onSubmit = (data: CreateTask) => {
    createTaskMutation.mutate(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">AI Tasks</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              data-testid={`button-create-task-${agentId}`}
            >
              <Sparkles className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create AI Task</DialogTitle>
              <DialogDescription>
                Create a new task for {agentName} to execute with AI
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="taskType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-task-type">
                            <SelectValue placeholder="Select task type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text_generation" data-testid="option-text-generation">Text Generation</SelectItem>
                          <SelectItem value="analysis" data-testid="option-analysis">Analysis</SelectItem>
                          <SelectItem value="summarization" data-testid="option-summarization">Summarization</SelectItem>
                          <SelectItem value="question_answer" data-testid="option-question-answer">Question & Answer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you want the AI to do..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="input-task-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-task"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTaskMutation.isPending}
                    data-testid="button-submit-task"
                  >
                    {createTaskMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Task
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingTasks ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No tasks yet. Create one to get started!
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            let aiResult = null;
            try {
              aiResult = task.aiResult ? JSON.parse(task.aiResult) : null;
            } catch (e) {
              console.error("Failed to parse AI result:", e);
            }
            
            return (
              <Card key={task.id} className="overflow-hidden" data-testid={`task-card-${task.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <CardTitle className="text-sm capitalize" data-testid={`task-type-${task.id}`}>
                        {task.taskType.replace("_", " ")}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <span data-testid={`task-status-${task.id}`}>
                        {getStatusBadge(task.status)}
                      </span>
                      {task.status === "pending" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => executeTaskMutation.mutate(task.id)}
                          disabled={executeTaskMutation.isPending}
                          data-testid={`button-execute-task-${task.id}`}
                        >
                          {executeTaskMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-xs line-clamp-2" data-testid={`task-description-${task.id}`}>
                    {task.taskDescription}
                  </CardDescription>
                </CardHeader>
                {(aiResult || task.errorMessage) && (
                  <CardContent className="pt-0">
                    {aiResult && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">AI Result:</p>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm whitespace-pre-wrap" data-testid={`task-result-${task.id}`}>
                            {aiResult.content}
                          </p>
                          {aiResult.tokens && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Model: {aiResult.model} • Tokens: {aiResult.tokens.total}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {task.errorMessage && (
                      <div className="bg-destructive/10 p-3 rounded-md">
                        <p className="text-sm text-destructive" data-testid={`task-error-${task.id}`}>
                          {task.errorMessage}
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Beta Testing Notice */}
      <AlertDialog 
        open={showBetaNotice} 
        onOpenChange={(open) => {
          if (!open && typeof window !== 'undefined') {
            localStorage.setItem("aoz-beta-notice-seen", "true");
          }
          setShowBetaNotice(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Beta Testing - AI Task Execution
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-left">
              <p className="font-medium text-foreground">
                Welcome to the AI Task Execution Beta!
              </p>
              <p>
                We're releasing this feature for testing purposes. You can create and execute AI tasks completely free during this beta period.
              </p>
              <p>
                <strong>Coming Soon:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>x402 payment protocol integration for agent-to-agent payments</li>
                <li>Full production infrastructure with enhanced performance</li>
                <li>Additional AI models and task types</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                Thank you for helping us test! Your feedback is invaluable.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              data-testid="button-acknowledge-beta"
            >
              Got it, let's test!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
