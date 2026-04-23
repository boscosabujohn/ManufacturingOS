"""
Extension-point registry for the OptiForge platform.
Phase 1 ships a single extension point: integration connector parsers keyed by source_type.
Phase 2 will add the remaining 9 extension points.
"""


class DuplicateRegistrationError(Exception):
    """Raised when two packs try to register for the same extension point key."""
    pass


class NoParserRegisteredError(Exception):
    """Raised when core attempts to invoke a parser for an unregistered source_type."""
    pass


class _ExtensionPointRegistry:
    """
    Singleton registry for all extension points.
    """
    def __init__(self):
        # source_type -> (pack_id, callable)
        self._parsers = {}

    def register_parser(self, source_type, pack_id, parser_callable):
        """
        Register a parser callable for a given source_type.
        Raises DuplicateRegistrationError if already registered.
        """
        if source_type in self._parsers:
            existing_pack = self._parsers[source_type][0]
            raise DuplicateRegistrationError(
                f"source_type '{source_type}' is already registered by pack '{existing_pack}'. "
                f"Cannot register again from pack '{pack_id}'."
            )
        self._parsers[source_type] = (pack_id, parser_callable)

    def get_parser(self, source_type):
        """
        Get the registered parser for a source_type.
        Returns (pack_id, callable) or raises NoParserRegisteredError.
        """
        if source_type not in self._parsers:
            raise NoParserRegisteredError(
                f"No parser registered for source_type '{source_type}'. "
                f"Available types: {list(self._parsers.keys())}"
            )
        return self._parsers[source_type]

    def invoke_parser(self, source_type, payload):
        """
        Invoke the registered parser for a given source_type with the given payload.
        Returns the parser result.
        """
        pack_id, parser_callable = self.get_parser(source_type)
        return parser_callable(payload)

    def clear(self):
        """Clear all registrations (for testing)."""
        self._parsers.clear()

    def registered_types(self):
        """Return all registered source_types."""
        return list(self._parsers.keys())


# Global singleton
extension_registry = _ExtensionPointRegistry()
