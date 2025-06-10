# Lawdesk CRM - Architecture Documentation

## Overview

This document describes the standardized architecture for the Lawdesk CRM application, designed to be scalable, maintainable, and enable parallel team development.

## Architecture Principles

### 1. Clean Architecture

- **Separation of Concerns**: Clear boundaries between business logic, UI, and data access
- **Dependency Inversion**: Core business logic doesn't depend on external frameworks
- **Domain-Driven Design**: Code organized around business domains

### 2. Atomic Design System

- **Atoms**: Basic building blocks (buttons, inputs, labels)
- **Molecules**: Simple combinations of atoms (search boxes, form fields)
- **Organisms**: Complex UI sections (headers, sidebars, forms)
- **Templates**: Page layouts and structure

### 3. Feature-Based Organization

- Each business domain has its own feature module
- Self-contained features with their own components, hooks, services, and types
- Clear boundaries between features

## Directory Structure

```
src/
├── features/                   # Domain-specific features
│   ├── agenda/                # Calendar and scheduling
│   ├── crm/                   # Client relationship management
│   ├── ged/                   # Document management
│   ├── admin/                 # Administrative features
│   ├── financial/             # Financial management
│   └── ai/                    # AI-powered features
├── shared/                    # Reusable across domains
│   ├── components/            # Atomic Design components
│   │   ├── atoms/            # Basic UI elements
│   │   ├── molecules/        # Simple combinations
│   │   ├── organisms/        # Complex combinations
│   │   └── templates/        # Page layouts
│   ├── hooks/                # Reusable React hooks
│   ├─�� utils/                # Utility functions
│   └── types/                # Shared TypeScript types
├── core/                     # Application core
│   ├── api/                  # API layer and clients
│   ├── context/              # Global React contexts
│   ├── providers/            # Application providers
│   └── router/               # Routing configuration
├── config/                   # Configuration files
└── assets/                   # Static assets
```

## Feature Structure

Each feature follows this standardized structure:

```
features/[domain]/
├── components/               # Domain-specific components
│   ├── [ComponentName]/     # Component folder
│   │   ├── index.tsx        # Main component
│   │   ├── [ComponentName].types.ts  # Component types
│   │   └── [ComponentName].styles.ts # Component styles (if needed)
├── hooks/                   # Domain-specific hooks
├── services/                # Domain API services
├── types/                   # Domain TypeScript types
├── utils/                   # Domain utilities
├── constants/               # Domain constants
└── index.ts                 # Domain exports
```

## Naming Conventions

### Files and Folders

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useUserData.ts`)
- **Services**: camelCase ending with "Service" (e.g., `userService.ts`)
- **Types**: camelCase ending with "Types" (e.g., `userTypes.ts`)
- **Utils**: camelCase (e.g., `dateUtils.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Code Conventions

- **Variables**: camelCase
- **Functions**: camelCase
- **Classes**: PascalCase
- **Interfaces**: PascalCase with "I" prefix (e.g., `IUser`)
- **Types**: PascalCase
- **Enums**: PascalCase

## Component Guidelines

### Atomic Components (Atoms)

```typescript
// Example: Button atom
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'button-base',
        `button-${variant}`,
        `button-${size}`
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Molecule Components

```typescript
// Example: Search box molecule
interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Buscar...",
  onSearch
}) => {
  const [query, setQuery] = useState('');

  return (
    <div className="search-box">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      <Button onClick={() => onSearch(query)}>
        <SearchIcon />
      </Button>
    </div>
  );
};
```

### Feature Components

```typescript
// Example: CRM client list
interface ClientListProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  onClientSelect
}) => {
  return (
    <div className="client-list">
      {clients.map(client => (
        <ClientCard
          key={client.id}
          client={client}
          onClick={() => onClientSelect(client)}
        />
      ))}
    </div>
  );
};
```

## API Layer

### Service Structure

```typescript
// Example: CRM service
export class CRMService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getClients(): Promise<Client[]> {
    return this.apiClient.get("/clients");
  }

  async createClient(client: CreateClientRequest): Promise<Client> {
    return this.apiClient.post("/clients", client);
  }

  async updateClient(id: string, client: UpdateClientRequest): Promise<Client> {
    return this.apiClient.put(`/clients/${id}`, client);
  }

  async deleteClient(id: string): Promise<void> {
    return this.apiClient.delete(`/clients/${id}`);
  }
}
```

### Hook Integration

```typescript
// Example: CRM hook
export const useClients = () => {
  const crmService = useService(CRMService);

  return useQuery({
    queryKey: ["clients"],
    queryFn: () => crmService.getClients(),
  });
};

export const useCreateClient = () => {
  const crmService = useService(CRMService);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (client: CreateClientRequest) =>
      crmService.createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
```

## State Management

### Global State (Zustand)

```typescript
// Example: Global store
interface GlobalState {
  user: User | null;
  theme: Theme;
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  theme: "light",
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));
```

### Feature State

```typescript
// Example: Feature-specific store
interface CRMState {
  selectedClient: Client | null;
  filterOptions: FilterOptions;
  setSelectedClient: (client: Client | null) => void;
  setFilterOptions: (options: FilterOptions) => void;
}

export const useCRMStore = create<CRMState>((set) => ({
  selectedClient: null,
  filterOptions: {},
  setSelectedClient: (selectedClient) => set({ selectedClient }),
  setFilterOptions: (filterOptions) => set({ filterOptions }),
}));
```

## Testing Guidelines

### Component Testing

```typescript
// Example: Component test
describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button-primary');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Testing

```typescript
// Example: Hook test
describe("useClients", () => {
  it("fetches clients successfully", async () => {
    const mockClients = [{ id: "1", name: "Test Client" }];
    mockApiClient.get.mockResolvedValue(mockClients);

    const { result } = renderHook(() => useClients());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockClients);
  });
});
```

## Performance Guidelines

### Code Splitting

```typescript
// Lazy load feature components
const CRMModule = React.lazy(() => import("@/features/crm"));
const AgendaModule = React.lazy(() => import("@/features/agenda"));
```

### Memoization

```typescript
// Use React.memo for expensive components
export const ClientList = React.memo<ClientListProps>(
  ({ clients, onClientSelect }) => {
    // Component logic
  },
);

// Use useMemo for expensive calculations
const filteredClients = useMemo(() => {
  return clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
}, [clients, searchQuery]);
```

## Migration Guide

### Phase 1: Structure Setup

1. Create new folder structure
2. Move shared UI components to atomic design structure
3. Update import paths

### Phase 2: Feature Migration

1. Migrate CRM components to `/features/crm/`
2. Migrate Agenda components to `/features/agenda/`
3. Continue with other features

### Phase 3: API Reorganization

1. Move services to feature-specific API modules
2. Update hooks to use new service structure
3. Test all API integrations

### Phase 4: Documentation

1. Document each component with examples
2. Create Storybook stories for shared components
3. Add README files for each feature

## Best Practices

### Component Design

- Keep components small and focused
- Use composition over inheritance
- Prefer props over context for component communication
- Always define TypeScript interfaces for props

### Performance

- Use React.memo for components that re-render frequently
- Implement proper key props for lists
- Avoid inline functions in render methods
- Use useMemo and useCallback judiciously

### Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

### Code Quality

- Write comprehensive tests for business logic
- Use TypeScript strictly (no `any` types)
- Follow ESLint and Prettier rules
- Document complex business logic

## Tools and Libraries

### Development

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and development server
- **TailwindCSS**: Styling framework

### State Management

- **Zustand**: Global state management
- **React Query**: Server state management
- **React Hook Form**: Form state management

### Testing

- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Static type checking

## Contributing

When adding new features or components:

1. Follow the established folder structure
2. Use proper naming conventions
3. Write comprehensive tests
4. Document your components
5. Update this architecture guide if needed

## Future Considerations

- **Micro-frontends**: Consider splitting large features into separate applications
- **Design System**: Evolve shared components into a standalone design system
- **Performance**: Implement advanced performance monitoring and optimization
- **Internationalization**: Add support for multiple languages
