"""
Role-hierarchy engine. Roles are declared with optional parents; a role
inherits the union of its parents' permissions. Cycles are rejected at
definition time.
"""


class RoleCycleError(ValueError):
    pass


class UnknownRoleError(LookupError):
    pass


class RoleHierarchy:
    def __init__(self):
        self._roles = {}  # name -> {'parents': [...], 'permissions': set()}

    def add_role(self, name, parents=None, permissions=None):
        if name in self._roles:
            raise ValueError(f"role '{name}' already defined")
        self._roles[name] = {
            'parents': list(parents or []),
            'permissions': set(permissions or []),
        }
        self._check_cycle(name)

    def grant(self, name, permission):
        if name not in self._roles:
            raise UnknownRoleError(name)
        self._roles[name]['permissions'].add(permission)

    def permissions_of(self, name):
        if name not in self._roles:
            raise UnknownRoleError(name)
        perms = set()
        visited = set()

        def walk(role):
            if role in visited:
                return
            visited.add(role)
            perms.update(self._roles[role]['permissions'])
            for parent in self._roles[role]['parents']:
                walk(parent)

        walk(name)
        return perms

    def _check_cycle(self, start):
        stack = [(start, [start])]
        while stack:
            role, path = stack.pop()
            for parent in self._roles.get(role, {}).get('parents', []):
                if parent not in self._roles:
                    raise UnknownRoleError(parent)
                if parent in path:
                    raise RoleCycleError(
                        "cycle: " + " → ".join(path + [parent])
                    )
                stack.append((parent, path + [parent]))

    def reset(self):
        self._roles.clear()


hierarchy = RoleHierarchy()
