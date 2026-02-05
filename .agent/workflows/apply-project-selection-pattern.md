---
description: Apply the standardized project selection pattern to a project-specific page.
---

# Workflow: Apply Project Selection Pattern

This workflow describes how to convert a page that operates on a hardcoded "current-project" into a project-aware page that allows users to select a project first.

## Prerequisites
- Page is located within `b3-erp/frontend/src/app/(modules)/project-management` or similar.
- `projectManagementService` is available and has `getProjects()` and `getProject(id)`.

## Steps

### 1. Update Imports
Ensure the following are imported:
```tsx
import { projectManagementService, Project, ... } from '@/services/ProjectManagementService';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
```

### 2. Add State and Query Params
Add the following state variables and query param logic at the beginning of the component:
```tsx
const router = useRouter();
const { toast } = useToast();
const searchParams = useSearchParams();
const projectId = searchParams.get('projectId');

const [projects, setProjects] = useState<Project[]>([]);
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const [loading, setLoading] = useState(true);
// ... your existing state (e.g., items, drawings)
```

### 3. Implement Data Loading Logic
Replace the existing `useEffect` and loading logic:
```tsx
useEffect(() => {
  if (projectId) {
    loadProjectData(projectId);
  } else {
    loadProjects();
  }
}, [projectId]);

const loadProjects = async () => {
  setLoading(true);
  try {
    const data = await projectManagementService.getProjects();
    setProjects(data);
  } catch (error) {
    toast({ variant: "destructive", title: "Error", description: "Failed to load projects." });
  } finally {
    setLoading(false);
  }
};

const loadProjectData = async (id: string) => {
  setLoading(true);
  try {
    const [project, pageData] = await Promise.all([
      projectManagementService.getProject(id),
      projectManagementService.getYourSpecificData(id) // e.g., getDrawings, getBOQItems
    ]);
    setSelectedProject(project);
    setYourData(pageData);
  } catch (error) {
    toast({ variant: "destructive", title: "Error", description: "Failed to load project details." });
    router.push('/your-current-path'); // Root of the module
  } finally {
    setLoading(false);
  }
};
```

### 4. Implement Conditional Rendering
Wrap your main JSX in a conditional block based on `projectId`:

#### View 1: Project Selection (When `!projectId`)
```tsx
if (!projectId) {
  return (
    <div className="w-full py-2 space-y-6">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Select Project for [Title]</h1>
          <p className="text-sm text-gray-500">Choose a project to [Action Description]</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-500">Loading projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">{project.projectCode}</Badge>
                  <Badge className={project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : ''}>
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl line-clamp-1">{project.name}</CardTitle>
                <CardDescription>{project.clientName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Type:</span><span className="font-medium">{project.projectType}</span></div>
                  <div className="flex justify-between"><span>Location:</span><span className="font-medium">{project.location}</span></div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => router.push(`${window.location.pathname}?projectId=${project.id}`)}>
                  Select Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### View 2: Main Page Content (When `projectId` is present)
Update your existing header to include project context and a "Change Project" button:
```tsx
return (
  <div className="w-full py-2 space-y-3">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.push(window.location.pathname)} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">[Page Title]</h1>
          <p className="text-sm text-gray-500">
            {selectedProject?.name} • [Module Step Description]
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => router.push(window.location.pathname)}>
        Change Project
      </Button>
    </div>
    
    {/* Existing page content using selectedProject and yourData */}
  </div>
);
```

## Critical Checks
- Ensure `CardFooter` is imported.
- Ensure `toast` is defined.
- Ensure `router` is defined.
- Ensure the `if (!projectId)` block is placed **before** the main `return` statement and **not** inside it.
- Remove any stray text or comments accidentally introduced.
