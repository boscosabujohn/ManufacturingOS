"""
Channel adapter registry. Each adapter is a callable (recipient_address,
subject, body) -> None that raises on failure. Real adapters (SES/SendGrid,
Twilio, APNs/FCM) plug in via `register_channel_adapter`. Tests use the
in-memory adapter that records every send.
"""
from collections import defaultdict


class ChannelNotRegisteredError(LookupError):
    """Raised when a send is requested on a channel with no registered adapter."""


class ChannelSendError(RuntimeError):
    """Wraps adapter-specific failures."""


_adapters = {}


def register_channel_adapter(channel, adapter):
    _adapters[channel] = adapter


def get_channel_adapter(channel):
    if channel not in _adapters:
        raise ChannelNotRegisteredError(f"No adapter registered for channel '{channel}'")
    return _adapters[channel]


def registered_channels():
    return sorted(_adapters.keys())


def clear_channel_adapters():
    _adapters.clear()


class InMemoryChannel:
    """Test adapter: records every send for assertion."""

    def __init__(self, fail_for=None):
        self.sent = []
        self.fail_for = fail_for or set()  # addresses that should simulate failure

    def __call__(self, recipient_address, subject, body):
        if recipient_address in self.fail_for:
            raise ChannelSendError(f"simulated failure for {recipient_address}")
        self.sent.append({
            'recipient_address': recipient_address,
            'subject': subject,
            'body': body,
        })


def install_in_memory_adapters():
    """Install in-memory adapters for all four PRD-named channels."""
    adapters = {ch: InMemoryChannel() for ch in ('email', 'sms', 'push', 'in_app')}
    for ch, adapter in adapters.items():
        register_channel_adapter(ch, adapter)
    return adapters


_DLQ = defaultdict(list)


def record_dlq(channel, delivery, error):
    _DLQ[channel].append({'delivery_id': str(delivery.id), 'error': str(error)})


def get_dlq(channel=None):
    if channel:
        return list(_DLQ[channel])
    return {ch: list(entries) for ch, entries in _DLQ.items()}


def clear_dlq():
    _DLQ.clear()
