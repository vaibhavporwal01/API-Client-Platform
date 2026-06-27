import time
import json
import base64
import httpx
from typing import Dict, Any, Optional
from schemas import RunRequest

async def execute_request(request: RunRequest) -> Dict[str, Any]:
    # 1. Build headers dict (skip disabled)
    headers = {h.key: h.value for h in request.headers if h.enabled and h.key}
    
    # 2. Build params dict (skip disabled)
    params = {p.key: p.value for p in request.params if p.enabled and p.key}
    
    # 3. Handle Auth
    if request.auth_type == "bearer" and "token" in request.auth_data:
        headers["Authorization"] = f"Bearer {request.auth_data['token']}"
    elif request.auth_type == "basic" and "username" in request.auth_data and "password" in request.auth_data:
        creds = f"{request.auth_data['username']}:{request.auth_data['password']}"
        encoded_creds = base64.b64encode(creds.encode()).decode()
        headers["Authorization"] = f"Basic {encoded_creds}"

    # 4. Handle Body
    content = None
    data = None
    files = None
    
    if request.body_type == "raw" and request.body_raw:
        content = request.body_raw.encode("utf-8")
    elif request.body_type == "urlencoded":
        data = {item.key: item.value for item in request.body_form if item.enabled and item.key}
    elif request.body_type == "form-data":
        # Simplified form-data handling (assuming text fields)
        files = {item.key: (None, item.value) for item in request.body_form if item.enabled and item.key}

    # 5. Execute with httpx
    start_time = time.monotonic()
    error_message = None
    response_data = {
        "status_code": None,
        "status_text": None,
        "response_headers": {},
        "response_body": "",
        "response_size_bytes": 0,
        "response_time_ms": 0,
        "error_message": None
    }

    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
            resp = await client.request(
                method=request.method,
                url=request.url,
                headers=headers,
                params=params,
                content=content,
                data=data,
                files=files
            )
            
            end_time = time.monotonic()
            
            # 6. Process response
            response_data["status_code"] = resp.status_code
            response_data["status_text"] = resp.reason_phrase
            response_data["response_headers"] = dict(resp.headers)
            response_data["response_size_bytes"] = len(resp.content)
            response_data["response_time_ms"] = int((end_time - start_time) * 1000)
            
            # Try to JSON parse body
            try:
                body_json = resp.json()
                response_data["response_body"] = json.dumps(body_json, indent=2)
            except (json.JSONDecodeError, ValueError):
                response_data["response_body"] = resp.text

    except httpx.TimeoutException:
        response_data["error_message"] = "Request timed out after 30s"
    except httpx.InvalidURL:
        response_data["error_message"] = "Invalid URL"
    except Exception as e:
        response_data["error_message"] = str(e)

    return response_data
