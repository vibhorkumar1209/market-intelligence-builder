import asyncio
from fastapi import FastAPI, HTTPException
from playwright.async_api import async_playwright
import os

app = FastAPI()

# Path to the user's Chrome profile for persistent login
CHROME_PATH = os.path.expanduser("~/Library/Application Support/Google/Chrome")
USER_DATA_DIR = CHROME_PATH
PROFILE_NAME = "Default"

async def run_claude_research(prompt: str):
    async with async_playwright() as p:
        # Launch browser with the user's data directory to maintain SaaS login
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            channel="chrome",
            headless=False, # Show browser for visibility during development
            args=["--profile-directory=" + PROFILE_NAME]
        )
        
        page = await browser.new_page()
        await page.goto("https://claude.ai/new")
        
        # Wait for input field
        await page.wait_for_selector('div[contenteditable="true"]')
        await page.fill('div[contenteditable="true"]', prompt)
        await page.keyboard.press("Enter")
        
        # Wait for response to complete (looking for the stop button to disappear or similar)
        # This is a bit simplified for demonstration
        await page.wait_for_selector('button[aria-label="Stop Response"]', state="detached", timeout=60000)
        
        # Extract the last response content
        responses = await page.query_selector_all('div.font-claude-message')
        if not responses:
            await browser.close()
            return "No response found."
            
        last_response = await responses[-1].inner_text()
        await browser.close()
        return last_response

@app.post("/research")
async def research(payload: dict):
    agent_type = payload.get("agent_type")
    prompt = payload.get("prompt")
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
        
    print(f"Running research for: {agent_type}...")
    try:
        content = await run_claude_research(prompt)
        return {"content": content}
    except Exception as e:
        print(f"Error during research: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
