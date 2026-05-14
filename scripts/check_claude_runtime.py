import asyncio
from app.config import settings
from app.claude_client import claude_client

print('has_api_key=', bool(settings.ANTHROPIC_API_KEY))
print('api_key_len=', len(settings.ANTHROPIC_API_KEY or ''))
print('model=', settings.MODEL_NAME)
print('client_initialized=', claude_client.client is not None)
print('has_messages_api=', hasattr(claude_client.client, 'messages') if claude_client.client is not None else False)
print('has_completions_api=', hasattr(claude_client.client, 'completions') if claude_client.client is not None else False)

async def main():
    try:
        text = await claude_client.get_custom_completion(
            system_prompt='Return exactly OK',
            user_prompt='Reply with OK only',
            max_tokens=20,
        )
        print('claude_call_ok=True')
        print('claude_text=', text)
    except Exception as exc:
        print('claude_call_ok=False')
        print('claude_error=', type(exc).__name__, str(exc))

asyncio.run(main())
